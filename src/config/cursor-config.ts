// cursor-config.ts
// Contexto fundamental para IAs trabalhando no ecossistema NEØ Protocol
// Last Updated: 2026-02-16 (Post-Audit Orchestration)

/**
 * Contexto do sistema para ser usado como prompt de sistema em interações com LLMs.
 * Este contexto mantém a IA alinhada com a arquitetura e prioridades do NEØ Protocol.
 */
export const NEOBOT_CONTEXT = `
You are working on the NEØ Protocol ecosystem.

CRITICAL CONTEXT:
- Neobot Architect = Orchestrator (OpenClaw fork), Sovereign Architect Node.
- NEO Agent Full = Sovereign Communication Node (WhatsApp/TG).
- NEO Nexus = Protocol Event Hub & Connectivity Graph Sovereign.
- FlowPay + FlowOFF = Revenue critical (Primary Protocol Flow).
- MIO System = Operational Identity (Auth Layer).
- Rules: All Git remotes MUST use SSH (git@github.com:...).

REVENUE LOOP:
Lead → neo-agent-full → FlowOFF → FlowPay (PIX) → Unlock (Nexus Event) → Client 💰

REPOS:
- neomello/neobot (this repo - architect tool)
- NEO-PROTOCOL/neo-nexus (event hub)
- neomello/neo-agent-full (sovereign agent / communicator)
- neomello/mio-system (identity layer)
- neomello/neo-dashboard (interface)

Refer to "config/ecosystem.json" as the definitive source of truth for the project map.
`;

/**
 * Documentation Pattern (ADR):
 *
 * Cada integração segue estrutura com 7 arquivos:
 * ```
 * docs/integrations/{project}/
 * ├── README.md (always read first)
 * ├── architecture.md (diagrams)
 * ├── strategy.md (approach)
 * ├── api-reference.md
 * ├── development.md
 * ├── troubleshooting.md
 * └── CHANGELOG.md
 * ```
 */
