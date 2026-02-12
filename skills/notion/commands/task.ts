#!/usr/bin/env node

/**
 * Comando /task - Criar nova tarefa no Notion
 * Uso: /task <título> <projeto> [prioridade]
 */

import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

const TAREFAS_DATABASE_ID = "af8aafe2-3a5c-41c9-b707-8bb55bdfb14d"; // Tarefas database
const PROJETOS_DATABASE_ID = "b826dfbe-b0a4-47e8-838f-f05f33771996"; // Projetos database

async function createTask(
  taskTitle: string,
  projectName: string,
  priority: string = "⚡ Média"
): Promise<string> {
  try {
    // Buscar projeto pelo nome
    const searchCmd = `mcp call user-Notion notion-search '{"query": "${projectName}", "query_type": "internal", "data_source_url": "collection://${PROJETOS_DATABASE_ID}"}'`;
    const { stdout: searchResult } = await execAsync(searchCmd);
    const search = JSON.parse(searchResult);

    if (!search.results || search.results.length === 0) {
      return `❌ Projeto "${projectName}" não encontrado. Use /projetos para ver a lista.`;
    }

    const projectUrl = search.results[0].url;

    // Validar prioridade
    const validPriorities = ["🔥 Alta", "⚡ Média", "💤 Baixa"];
    if (!validPriorities.includes(priority)) {
      priority = "⚡ Média";
    }

    // Criar tarefa
    const createCmd = `mcp call user-Notion notion-create-pages '${JSON.stringify({
      parent: { data_source_id: TAREFAS_DATABASE_ID },
      pages: [
        {
          properties: {
            Tarefa: taskTitle,
            Status: "📋 Backlog",
            Prioridade: priority,
            Projeto: `["${projectUrl}"]`,
            Descrição: `Criada via Telegram em ${new Date().toLocaleString("pt-BR")}`,
          },
        },
      ],
    })}'`;

    const { stdout: createResult } = await execAsync(createCmd);
    const result = JSON.parse(createResult);

    if (result.pages && result.pages.length > 0) {
      const pageUrl = result.pages[0].url;
      return `✅ Tarefa criada com sucesso!\n📋 "${taskTitle}"\n${priority}\n🔗 ${pageUrl}`;
    }

    return "❌ Erro ao criar tarefa.";
  } catch (error) {
    console.error("Erro:", error);
    return `❌ Erro: ${error.message}`;
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(`
✅ Comando /task - Criar nova tarefa no Notion

Uso:
  /task "<título>" <projeto> [prioridade]

Prioridades disponíveis:
  🔥 Alta
  ⚡ Média (padrão)
  💤 Baixa

Exemplos:
  /task "Integrar MCP com Telegram" NODE NEØ "🔥 Alta"
  /task "Revisar documentação" neo-agent
  /task "Testar nova feature" neobot "⚡ Média"

Dica: Use /projetos para ver todos os projetos disponíveis
    `);
    process.exit(1);
  }

  const [taskTitle, projectName, priority] = args;

  console.log(`📋 Criando tarefa...`);
  console.log(`📝 Título: ${taskTitle}`);
  console.log(`📁 Projeto: ${projectName}`);
  console.log(`⚡ Prioridade: ${priority || "⚡ Média"}\n`);

  const result = await createTask(taskTitle, projectName, priority);
  console.log(result);
}

main();
