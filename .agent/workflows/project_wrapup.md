---
description: Check status of all stack projects and ensure clean exit.
---

# Project Wrap-up: Safe Shutdown

## 1. Audit Stack

```bash
node --import tsx scripts/wrapup.ts
```

Mostra projetos com mudanças não commitadas ou não enviadas.

## 2. Commit Pendências (se necessário)

Se o script acima mostrar ⚠️ warnings:

- Navegar até as pastas específicas e commitar
- Separar commits por contexto (neobot, smart-core, dashboard, etc.)
- Fazer push após cada commit

```bash
git add .
git commit -m "chore: wrapup session"
git push origin main
```

## 3. Notion Sync (se necessário)

```bash
node --import tsx scripts/notion-sync.ts
```

## 4. Output Format

**Reportar apenas o resumo final.** Não expor raciocínio interno ou passos intermediários. Formato obrigatório:

```
🛡️ WRAPUP REPORT
Projetos: [ok | warnings]
Pendências: [lista curta ou "none"]
Push: [ok | falhou em: ...]
Status: [clean | dirty]
```

## 5. Shutdown

Sessão encerrada com segurança.
