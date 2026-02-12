#!/usr/bin/env node

/**
 * Comando /log - Criar Work Log no Notion
 * Uso: /log <projeto> <texto>
 */

import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

const NOTION_DATABASE_ID = "2294ae4d-3f0f-43a9-8928-790b01da5be5"; // Work Log database
const PROJETOS_DATABASE_ID = "b826dfbe-b0a4-47e8-838f-f05f33771996"; // Projetos database

async function createWorkLog(projectName: string, logText: string): Promise<string> {
  try {
    // Buscar projeto pelo nome
    const searchCmd = `mcp call user-Notion notion-search '{"query": "${projectName}", "query_type": "internal", "data_source_url": "collection://${PROJETOS_DATABASE_ID}"}'`;
    const { stdout: searchResult } = await execAsync(searchCmd);
    const search = JSON.parse(searchResult);

    if (!search.results || search.results.length === 0) {
      return `❌ Projeto "${projectName}" não encontrado. Use /projetos para ver a lista.`;
    }

    const projectUrl = search.results[0].url;

    // Criar Work Log
    const createCmd = `mcp call user-Notion notion-create-pages '${JSON.stringify({
      parent: { data_source_id: NOTION_DATABASE_ID },
      pages: [
        {
          properties: {
            Registro: logText,
            Projeto: `["${projectUrl}"]`,
            Detalhes: `Registrado via Telegram em ${new Date().toLocaleString("pt-BR")}`,
          },
        },
      ],
    })}'`;

    const { stdout: createResult } = await execAsync(createCmd);
    const result = JSON.parse(createResult);

    if (result.pages && result.pages.length > 0) {
      const pageUrl = result.pages[0].url;
      return `✅ Work Log criado com sucesso!\n📝 "${logText}"\n🔗 ${pageUrl}`;
    }

    return "❌ Erro ao criar Work Log.";
  } catch (error) {
    console.error("Erro:", error);
    return `❌ Erro: ${error.message}`;
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(`
📝 Comando /log - Criar Work Log no Notion

Uso:
  /log <projeto> <texto>

Exemplos:
  /log NODE NEØ "Integrei MCP do Notion com sucesso"
  /log neo-agent "Corrigi bug no dashboard"
  /log neobot "Setup das automações do Telegram"

Dica: Use /projetos para ver todos os projetos disponíveis
    `);
    process.exit(1);
  }

  const [projectName, ...textParts] = args;
  const logText = textParts.join(" ");

  console.log(`📝 Criando Work Log...`);
  console.log(`📁 Projeto: ${projectName}`);
  console.log(`📄 Texto: ${logText}\n`);

  const result = await createWorkLog(projectName, logText);
  console.log(result);
}

main();
