---
description: Start the project session, checking connections and status.
---

# Project Kickoff: NΞØ Node Warrior

## 1. System Check

```bash
node scripts/kickoff.js
```

Verifica: `.env` carregado, Anthropic, Notion, Linear, Telegram, build `dist/` e contexto do roadmap.

## 2. Mission Briefing

```bash
node --import tsx scripts/wrapup.ts
```

Mostra status dos projetos do stack (git, branches, pendências).

## 3. Session Planning

- Revisar output acima (Notion, Linear, warnings)
- Se existirem ⚠️ warnings, resolver antes de continuar
- Se upstream do neobot tiver divergido, rodar `/update_clawdbot`

> **macOS:** Se qualquer comando falhar com `EPERM`, pedir ao usuário para rodar manualmente no terminal.
