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

> **macOS / EPERM:** Se qualquer comando falhar com `EPERM`, `operation not permitted`, ou `sandbox` error — **PARAR imediatamente** e pedir ao usuário para rodar o comando manualmente no terminal. Não tentar novamente, não usar flags de bypass. Aguardar confirmação do usuário antes de continuar.
