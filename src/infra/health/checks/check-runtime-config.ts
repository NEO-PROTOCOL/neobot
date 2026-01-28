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
        version: (config as any).version,
        governance: (config as any).governance_mode,
      },
    };
  } catch (error: any) {
    return {
      key: "runtime_config",
      status: "fail",
      summary: `Falha ao carregar configuração: ${error.message}`,
      recommendation: "Verifique o arquivo config/neobot.runtime.json para erros de sintaxe JSON.",
    };
  }
}
