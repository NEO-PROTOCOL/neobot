#!/usr/bin/env node

/**
 * Script para padronizar formatação de arquivos Markdown no projeto NeoBot
 * Autor: NeoBot Team
 * Data: 2026-01-28
 * 
 * Regras aplicadas:
 * 1. Linha vazia após cabeçalhos (###, ##, #)
 * 2. Linha vazia após linhas que terminam com ":"
 * 3. Underline (_) substituído por hífen (-) em listas
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cores ANSI
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.blue}${colors.bright}${msg}${colors.reset}\n`),
  separator: () => console.log(`${colors.blue}${'━'.repeat(50)}${colors.reset}`)
};

/**
 * Formata o conteúdo de um arquivo Markdown
 */
function formatMarkdown(content) {
  const lines = content.split('\n');
  const formatted = [];
  let inCodeBlock = false;
  let changes = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = lines[i + 1];
    const prevLine = i > 0 ? lines[i - 1] : '';

    // Detectar blocos de código
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      formatted.push(line);
      continue;
    }

    // Não processar dentro de blocos de código
    if (inCodeBlock) {
      formatted.push(line);
      continue;
    }

    // Regra 3: Substituir underline por hífen em listas
    let processedLine = line;
    if (line.match(/^_ /)) {
      processedLine = line.replace(/^_ /, '- ');
      changes++;
    }

    formatted.push(processedLine);

    // Regra 1: Adicionar linha vazia após cabeçalhos
    if (line.match(/^#{1,6} /) && nextLine && nextLine.trim() !== '' && !nextLine.match(/^#{1,6} /)) {
      formatted.push('');
      changes++;
    }

    // Regra 2: Adicionar linha vazia após linhas que terminam com ":"
    if (
      line.match(/:$/) &&
      !line.match(/^```/) &&
      !line.match(/https?:/) &&
      nextLine &&
      nextLine.trim() !== '' &&
      !nextLine.match(/^$/)
    ) {
      // Evitar duplicar linhas vazias
      if (!formatted[formatted.length - 1] || formatted[formatted.length - 1].trim() !== '') {
        formatted.push('');
        changes++;
      }
    }
  }

  return {
    content: formatted.join('\n'),
    changes
  };
}

/**
 * Processa um arquivo Markdown
 */
async function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { content: formatted, changes } = formatMarkdown(content);

    if (changes > 0) {
      // Criar backup
      const backupPath = `${filePath}.backup`;
      fs.writeFileSync(backupPath, content);

      // Salvar arquivo formatado
      fs.writeFileSync(filePath, formatted);

      return { success: true, changes, modified: true };
    }

    return { success: true, changes: 0, modified: false };
  } catch (error) {
    return { success: false, error: error.message, modified: false };
  }
}

/**
 * Função principal
 */
async function main() {
  log.separator();
  log.header('  📝 NeoBot Markdown Formatter');
  log.separator();

  console.log();
  log.info('Buscando arquivos .md...\n');

  // Padrões de busca
  const patterns = [
    '*.md',
    'docs/**/*.md',
    'dashboard/**/*.md',
    'skills/**/*.md',
    'extensions/**/*.md',
    'src/**/*.md'
  ];

  // Padrões para ignorar
  const ignore = [
    '**/node_modules/**',
    '**/.git/**',
    '**/dist/**',
    '**/.cursor/**',
    '**/coverage/**'
  ];

  let totalFiles = 0;
  let modifiedFiles = 0;
  let totalChanges = 0;
  const errors = [];

  // Processar cada padrão
  for (const pattern of patterns) {
    const files = await glob(pattern, { ignore, cwd: path.resolve(__dirname, '..') });

    for (const file of files) {
      const filePath = path.resolve(__dirname, '..', file);
      totalFiles++;

      console.log(`${colors.yellow}Processando:${colors.reset} ${file}`);

      const result = await processFile(filePath);

      if (result.success) {
        if (result.modified) {
          modifiedFiles++;
          totalChanges += result.changes;
          log.success(`Formatado (${result.changes} mudanças)`);
        } else {
          log.info('Nenhuma mudança necessária');
        }
      } else {
        errors.push({ file, error: result.error });
        log.error(`Erro: ${result.error}`);
      }

      console.log();
    }
  }

  // Resumo
  log.separator();
  log.header('  📊 Resumo');
  log.separator();

  console.log();
  console.log(`  Total de arquivos: ${colors.yellow}${totalFiles}${colors.reset}`);
  console.log(`  Arquivos modificados: ${colors.green}${modifiedFiles}${colors.reset}`);
  console.log(`  Arquivos sem mudanças: ${colors.blue}${totalFiles - modifiedFiles}${colors.reset}`);
  console.log(`  Total de mudanças: ${colors.cyan}${totalChanges}${colors.reset}`);

  if (errors.length > 0) {
    console.log(`  Erros: ${colors.red}${errors.length}${colors.reset}`);
  }

  console.log();

  if (modifiedFiles > 0) {
    log.success('Formatação concluída!');
    console.log();
    log.warning('Backups criados: *.md.backup');
    log.warning('Para remover backups: find . -name "*.md.backup" -delete');
    console.log();
  } else if (totalFiles > 0) {
    log.info('Todos os arquivos já estão formatados corretamente!');
    console.log();
  } else {
    log.warning('Nenhum arquivo .md encontrado!');
    console.log();
  }

  if (errors.length > 0) {
    log.error('Erros encontrados:');
    errors.forEach(({ file, error }) => {
      console.log(`  ${colors.red}•${colors.reset} ${file}: ${error}`);
    });
    console.log();
  }

  log.separator();
  console.log();

  process.exit(errors.length > 0 ? 1 : 0);
}

// Executar
main().catch((error) => {
  log.error(`Erro fatal: ${error.message}`);
  console.error(error);
  process.exit(1);
});
