# 🎯 Automações Notion + Telegram

Sistema completo de automações para gerenciar o NEØ Command Center via Telegram.

## 📋 Comandos Disponíveis

### 📝 /log - Criar Work Log
Registra progresso de trabalho no Notion.

```bash
# Sintaxe
/log <projeto> <texto>

# Exemplos
/log NODE NEØ "Integrei MCP do Notion com sucesso"
/log neo-agent "Corrigi bug no dashboard"
/log neobot "Setup das automações do Telegram"
```

### ✅ /task - Criar Tarefa

Adiciona nova tarefa ao backlog.

```bash
# Sintaxe
/task "<título>" <projeto> [prioridade]

# Prioridades
🔥 Alta
⚡ Média (padrão)
💤 Baixa

# Exemplos
/task "Integrar MCP com Telegram" NODE NEØ "🔥 Alta"
/task "Revisar documentação" neo-agent
/task "Testar nova feature" neobot
```

### 📊 /status - Ver Resumo
Mostra status atual de projetos, tarefas e decisões.

```bash
/status
```

Retorna:
- Projetos ativos
- Tarefas em progresso
- Decisões pendentes
- Links rápidos

### 📁 /projetos - Listar Projetos
Lista todos os projetos ativos.

```bash
/projetos
```

## 🚀 Uso via Telegram

### Método 1: Bot Direto (Recomendado)

```bash
# No Telegram, envie:
/log NODE NEØ "Criei automações do Telegram"
```

### Método 2: CLI Local

```bash
# Criar Work Log
pnpm tsx skills/notion/commands/log.ts NODE NEØ "Texto do log"

# Criar Tarefa
pnpm tsx skills/notion/commands/task.ts "Título da tarefa" NODE NEØ "🔥 Alta"

# Ver Status
pnpm tsx skills/notion/commands/status.ts

# Listar Projetos
pnpm tsx skills/notion/commands/projetos.ts
```

## 🔧 Configuração

### 1. MCP do Notion
O MCP do Notion já está configurado. Certifique-se de que está autenticado.

### 2. IDs dos Databases
Os IDs já estão hard-coded nos scripts:
- **Projetos:** `b826dfbe-b0a4-47e8-838f-f05f33771996`
- **Tarefas:** `af8aafe2-3a5c-41c9-b707-8bb55bdfb14d`
- **Decisões:** `9da4c091-6a77-4bee-a17c-822d5dc2a1b3`
- **Work Log:** `2294ae4d-3f0f-43a9-8928-790b01da5be5`

### 3. Telegram Bot (Próximo Passo)
Para usar via Telegram, vamos criar um bot listener que processa os comandos.

## 📂 Estrutura

```
skills/notion/
├── SKILL.md          # Documentação da API Notion
├── README.md         # Este arquivo
└── commands/
    ├── log.ts        # Criar Work Log
    ├── task.ts       # Criar Tarefa
    ├── status.ts     # Ver Status
    └── projetos.ts   # Listar Projetos
```

## 🎯 Databases no Notion

- [Command Center](https://www.notion.so/2f78c6e83be081af880edd88440a4642) - Hub principal
- [Projetos](https://www.notion.so/29fb6f21b53441c08a2a88dbefedc498) - Todos os projetos
- [Tarefas](https://www.notion.so/73b8b7ccb81845b98907fc7066b4c2da) - Sistema Kanban
- [Decisões](https://www.notion.so/5041cdeb1d584029bdfc6e7271a3a20b) - Decisões estratégicas
- [Work Log](https://www.notion.so/93f062cdfb284c48a370d67579b9c902) - Diário de progresso

## 🔍 Troubleshooting

### "Projeto não encontrado"
- Use `/projetos` para ver a lista exata
- O nome deve corresponder exatamente ao nome no Notion
- Exemplo: `NODE NEØ.run` (não `nodemello` ou `NODE NEØ`)

### Erro de MCP
- Verifique se o Notion MCP está ativo no Cursor
- Settings → MCP → user-Notion

### Permissões
- Certifique-se de que a integração do Notion tem acesso aos databases

## 📚 Próximos Passos

1. ✅ Comandos básicos criados
2. ⏳ Bot listener do Telegram
3. ⏳ Comandos avançados (/done, /decidir)
4. ⏳ Automações agendadas (relatórios)
5. ⏳ Notificações proativas

---

*Criado em 2026-01-29*
*Powered by NEØbot + Notion MCP*
