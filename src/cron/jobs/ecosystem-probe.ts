import { Nexus, ProtocolEvent } from "../../nexus/index.js";

/**
 * Ecosystem Health Probe
 * ─────────────────────
 * Roda a cada 5 minutos no Railway (sempre ativo, independente do dashboard).
 * Monitora todos os nodes com nexusConnection: "linked" do ecosystem-graph.json.
 *
 * Comportamento:
 *  - Só dispara Nexus.dispatch() em MUDANÇA de estado (não a cada poll)
 *  - Primera execução (unknown → online): sem alerta, apenas baseline
 *  - offline → Telegram/WhatsApp via regra no nexus-reactors.json
 *  - recovery → notificação de retorno
 *  - Reporta resultado agregado ao neo-nexus para o dashboard consumir via SSE
 */

const PROBE_TIMEOUT_MS = 3_000;

// Resolve URL do neo-nexus para reporte:
// Prefere URL interna Railway (latência ~0), cai para produção se não configurado
const NEXUS_EVENTS_URL = (() => {
  const internal = process.env.NEXUS_INTERNAL_URL;
  const prod = (process.env.NEXUS_API_URL ?? "https://nexus.neoprotocol.space").replace(/\/$/, "");
  return internal ? `${internal.replace(/\/$/, "")}/api/events` : `${prod}/api/events`;
})();

// ─── Nodes monitorados ────────────────────────────────────────────────────────
// Fonte: ecosystem-graph.json → nexusConnection: "linked"
const MONITORED_NODES = [
  {
    id: "neo-nexus",
    name: "NEO Nexus Event Hub",
    url: "https://nexus.neoprotocol.space",
  },
  {
    id: "neo-agent-full",
    name: "NEO Agent Full (WhatsApp/TG)",
    url: "https://agent.neoprotocol.space",
  },
  {
    id: "mio-system",
    name: "MIO System",
    url: "https://id.neoprotocol.space",
  },
  {
    id: "neo-tunnel",
    name: "NΞØ Tunnel",
    url: "https://tunnel.neoprotocol.space",
  },
  {
    id: "neobot-orchestrator",
    name: "Neobot Orchestrator",
    url: "https://architect.neoprotocol.space",
  },
  {
    id: "flowpay",
    name: "FlowPay Platform",
    url: "https://api.flowpay.cash",
  },
] as const;

// ─── Estado em memória ────────────────────────────────────────────────────────
// Persiste entre execuções do cron no mesmo processo Railway.
// "unknown" = primeira execução, sem alerta (estabelece baseline).
type NodeStatus = "online" | "offline" | "unknown";
const nodeStateMap = new Map<string, NodeStatus>();

// ─── Probe individual ─────────────────────────────────────────────────────────
async function probeNode(
  url: string,
): Promise<{ ok: boolean; latencyMs: number; httpStatus?: number }> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
  const startedAt = Date.now();

  const tryFetch = async (endpoint: string) => {
    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: { "User-Agent": "neobot-ecosystem-probe/1.0" },
    });
    return { ok: res.ok, latencyMs: Date.now() - startedAt, httpStatus: res.status };
  };

  try {
    // Tenta /health primeiro, fallback /api/health
    try {
      return await tryFetch(`${url.replace(/\/$/, "")}/health`);
    } catch {
      return await tryFetch(`${url.replace(/\/$/, "")}/api/health`);
    }
  } catch {
    return { ok: false, latencyMs: Date.now() - startedAt };
  } finally {
    clearTimeout(timer);
  }
}

// ─── Reporte ao neo-nexus ─────────────────────────────────────────────────────
// Dashboard consome esse evento via SSE para atualizar o flow visualization
async function reportToNexus(
  results: Array<{ id: string; status: "online" | "offline"; latencyMs: number }>,
) {
  try {
    await fetch(NEXUS_EVENTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event: "ECOSYSTEM:PROBE_RESULT",
        source: "neobot-ecosystem-probe",
        ts: new Date().toISOString(),
        nodes: results,
      }),
    });
  } catch (err) {
    console.warn(
      "[PROBE] ⚠️ Falha ao reportar ao Nexus:",
      err instanceof Error ? err.message : err,
    );
  }
}

// ─── Job Principal ────────────────────────────────────────────────────────────
export const ecosystemProbeJob = {
  name: "ecosystem-probe",
  schedule: "*/5 * * * *", // a cada 5 minutos

  run: async () => {
    console.log("[PROBE] 🔍 Iniciando Ecosystem Health Probe...");
    const results: Array<{ id: string; status: "online" | "offline"; latencyMs: number }> = [];

    for (const node of MONITORED_NODES) {
      const probe = await probeNode(node.url);
      const currentStatus: "online" | "offline" = probe.ok ? "online" : "offline";
      const previousStatus: NodeStatus = nodeStateMap.get(node.id) ?? "unknown";

      results.push({ id: node.id, status: currentStatus, latencyMs: probe.latencyMs });

      // Só dispatch em MUDANÇA de estado
      if (previousStatus !== currentStatus) {
        if (currentStatus === "offline") {
          // online/unknown → offline: ALERTA
          console.warn(`[PROBE] 🔴 ${node.name} OFFLINE (anterior: ${previousStatus})`);
          Nexus.dispatch(ProtocolEvent.NODE_OFFLINE, {
            id: node.id,
            name: node.name,
            url: node.url,
            ts: new Date().toISOString(),
          });
        } else if (previousStatus === "offline") {
          // offline → online: RECUPERAÇÃO (não alerta se era unknown)
          console.log(`[PROBE] 🟢 ${node.name} RECUPERADO`);
          Nexus.dispatch(ProtocolEvent.NODE_RECOVERED, {
            id: node.id,
            name: node.name,
            url: node.url,
            ts: new Date().toISOString(),
          });
        } else {
          // unknown → online: baseline silencioso (primeira execução)
          console.log(`[PROBE] ✅ ${node.name} baseline online (${probe.latencyMs}ms)`);
        }
      } else {
        const icon = currentStatus === "online" ? "✅" : "🔴";
        console.log(`[PROBE] ${icon} ${node.name} ${currentStatus} (${probe.latencyMs}ms)`);
      }

      nodeStateMap.set(node.id, currentStatus);
    }

    // Reporta snapshot ao neo-nexus para o dashboard
    await reportToNexus(results);

    const offline = results.filter((r) => r.status === "offline");
    if (offline.length === 0) {
      console.log(`[PROBE] ✅ Todos os ${results.length} nodes online.`);
    } else {
      console.warn(
        `[PROBE] ⚠️ ${offline.length}/${results.length} offline: ${offline.map((n) => n.id).join(", ")}`,
      );
    }
  },
};
