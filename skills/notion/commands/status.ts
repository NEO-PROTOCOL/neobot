#!/usr/bin/env node

/**
 * Comando /status - Ver resumo do dia no Notion
 */

import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

const PROJETOS_DATABASE_ID = "b826dfbe-b0a4-47e8-838f-f05f33771996";
const TAREFAS_DATABASE_ID = "af8aafe2-3a5c-41c9-b707-8bb55bdfb14d";
const DECISOES_DATABASE_ID = "9da4c091-6a77-4bee-a17c-822d5dc2a1b3";

async function getStatus(): Promise<string> {
  try {
    let status = "📊 **NEØ Command Center - Status**\n\n";

    // Buscar projetos ativos
    const projetosCmd = `mcp call user-Notion notion-search '{"query": "🟢 Ativo", "query_type": "internal", "data_source_url": "collection://${PROJETOS_DATABASE_ID}"}'`;
    const { stdout: projetosResult } = await execAsync(projetosCmd);
    const projetos = JSON.parse(projetosResult);
    const projetosAtivos = projetos.results?.length || 0;

    status += `📁 **Projetos Ativos:** ${projetosAtivos}\n`;

    // Buscar tarefas em progresso
    const tarefasCmd = `mcp call user-Notion notion-search '{"query": "🎯 Doing", "query_type": "internal", "data_source_url": "collection://${TAREFAS_DATABASE_ID}"}'`;
    const { stdout: tarefasResult } = await execAsync(tarefasCmd);
    const tarefas = JSON.parse(tarefasResult);
    const tarefasDoing = tarefas.results?.length || 0;

    status += `🎯 **Tarefas em Progresso:** ${tarefasDoing}\n`;

    // Buscar decisões pendentes
    const decisoesCmd = `mcp call user-Notion notion-search '{"query": "⏳ Pendente", "query_type": "internal", "data_source_url": "collection://${DECISOES_DATABASE_ID}"}'`;
    const { stdout: decisoesResult } = await execAsync(decisoesCmd);
    const decisoes = JSON.parse(decisoesResult);
    const decisoesPendentes = decisoes.results?.length || 0;

    status += `⏳ **Decisões Pendentes:** ${decisoesPendentes}\n\n`;

    // Listar tarefas em progresso
    if (tarefasDoing > 0 && tarefas.results) {
      status += "**Tarefas em Progresso:**\n";
      tarefas.results.slice(0, 5).forEach((task: any, index: number) => {
        status += `  ${index + 1}. ${task.title}\n`;
      });
      status += "\n";
    }

    // Listar decisões urgentes
    if (decisoesPendentes > 0 && decisoes.results) {
      status += "**Decisões Pendentes:**\n";
      decisoes.results.slice(0, 3).forEach((decisao: any, index: number) => {
        status += `  ${index + 1}. ${decisao.title}\n`;
      });
      status += "\n";
    }

    status += `🔗 **Quick Links:**\n`;
    status += `• [Command Center](https://www.notion.so/2f78c6e83be081af880edd88440a4642)\n`;
    status += `• [Tarefas](https://www.notion.so/73b8b7ccb81845b98907fc7066b4c2da)\n`;
    status += `• [Projetos](https://www.notion.so/29fb6f21b53441c08a2a88dbefedc498)\n`;

    return status;
  } catch (error) {
    console.error("Erro:", error);
    return `❌ Erro ao buscar status: ${error.message}`;
  }
}

async function main() {
  console.log("📊 Buscando status...\n");
  const status = await getStatus();
  console.log(status);
}

main();
