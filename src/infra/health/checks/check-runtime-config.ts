import { loadRuntimeConfig } from "../../../config/runtime-config.js";
import type { HealthCheckResult } from "../types.js";

export async function checkRuntimeConfigStatus(): Promise<HealthCheckResult> {
  try {
    const config = loadRuntimeConfig();
    return {
      key: "runtime_config",
      status: "ok",
      summary: "Configuração de runtime carregada com sucesso.",
      details: {
        version: (config as Record<string, unknown>).version,
        governance: (config as Record<string, unknown>).governance_mode,
      },
    };
  } catch (error: unknown) {
    return {
      key: "runtime_config",
      status: "fail",
      summary: `Falha ao carregar configuração: ${error instanceof Error ? error.message : String(error)}`,
      recommendation: "Verifique o arquivo config/neobot.runtime.json para erros de sintaxe JSON.",
    };
  }
}
