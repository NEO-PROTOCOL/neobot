#!/usr/bin/env node

/**
 * Comando /projetos - Listar projetos ativos do Notion
 */

import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

const PROJETOS_DATABASE_ID = "b826dfbe-b0a4-47e8-838f-f05f33771996";

async function listProjects(): Promise<string> {
  try {
    // Buscar todos os projetos
    const searchCmd = `mcp call user-Notion notion-search '{"query": "", "query_type": "internal", "data_source_url": "collection://${PROJETOS_DATABASE_ID}"}'`;
    
    // Como query vazio pode dar erro, vamos buscar projetos ativos
    const ativosCmd = `mcp call user-Notion notion-search '{"query": "🟢", "query_type": "internal", "data_source_url": "collection://${PROJETOS_DATABASE_ID}"}'`;
    
    const { stdout: ativosResult } = await execAsync(ativosCmd);
    const ativos = JSON.parse(ativosResult);

    let output = "📁 **Projetos NEØ Protocol**\n\n";

    if (!ativos.results || ativos.results.length === 0) {
      output += "Nenhum projeto ativo encontrado.\n";
    } else {
      output += `**🟢 Projetos Ativos:** (${ativos.results.length})\n\n`;
      ativos.results.forEach((projeto: any, index: number) => {
        output += `${index + 1}. **${projeto.title}**\n`;
        if (projeto.snippet) {
          output += `   ${projeto.snippet}\n`;
        }
        output += `   🔗 ${projeto.url}\n\n`;
      });
    }

    output += `\n📊 **Ver todos:** https://www.notion.so/29fb6f21b53441c08a2a88dbefedc498\n`;
    output += `🎯 **Command Center:** https://www.notion.so/2f78c6e83be081af880edd88440a4642`;

    return output;
  } catch (error) {
    console.error("Erro:", error);
    return `❌ Erro ao listar projetos: ${error.message}`;
  }
}

async function main() {
  console.log("📁 Listando projetos...\n");
  const projects = await listProjects();
  console.log(projects);
}

main();
