# 🦞 Neobot (Moltbot) Developer Guide - CLAUDE.md

Este arquivo contém as diretrizes essenciais para o desenvolvimento do Neobot. É usado pela IA para manter consistência e pelo desenvolvedor como guia rápido.

## 🚀 Comandos Essenciais (Cheat Sheet)

### Desenvolvimento

- `pnpm install` — Instala dependências.
- `pnpm dev` ou `pnpm moltbot ...` — Executa o CLI em modo desenvolvimento.
- `pnpm build` — Build do projeto (TSC).
- `pnpm lint` / `pnpm format` — Verificação de estilo (Oxlint/Oxfmt).

### Testes

- `pnpm test` — Executa suite de testes (Vitest).
- `pnpm test:coverage` — Verifica cobertura de código (mínimo 70%).
- `CLAWDBOT_LIVE_TEST=1 pnpm test:live` — Testes com chaves reais.

### Operações e Deploy

- `moltbot doctor` — Diagnóstico de saúde e migrações.
- `scripts/package-mac-app.sh` — Empacota App macOS.
- `sync` (Shorthand) — Faz commit, pull --rebase e push.

---

## 📂 Organização do Projeto

- `src/cli/` — Entry points do CLI e lógica de comandos.
- `src/infra/` — Serviços de base (Health, Ledger, Notifiers, Runner).
- `src/config/` — Gestão de runtime config e ambiente.
- `skills/` — Skills do sistema (scripts bash, metadata, prompts).
- `extensions/` — Plugins e integrações de canais (MS Teams, Matrix, etc).
- `dist/` — Saída do build para produção.

---

## 🛠️ Padrões de Engenharia

### Código e Estilo

- **Linguagem**: TypeScript (ESM) com tipagem estrita. Evite `any`.
- **Limites**: Mantenha arquivos abaixo de ~500-700 LOC. Refatore se necessário.
- **Progress**: Use `src/cli/progress.ts` para spinners e barras de progresso.
- **Terminal**: Use a paleta de cores em `src/terminal/palette.ts`.

### Auditoria e Segurança (Ledger)

- **Actor**: Use `actor: "cron"` para tarefas automáticas e `actor: "user"` para CLI.
- **Channel**: Use `channel: "scheduler"` para cron e `channel: "cli"` para uso direto.
- **Sanitização**: Nunca commite números reais, tokens ou segredos. Use placeholders.

### Testes

- Arquivos de teste colocalizados: `filename.test.ts`.
- E2E em `filename.e2e.test.ts`.
- Threshold de cobertura: 70% (Lines/Branches/Functions).

---

## 🤝 Fluxo de Trabalho (Workflows)

### Commits & PRs

1. Use `scripts/committer "<msg>" <file...>` para manter o staging limpo.
2. Siga **Conventional Commits** (`feat:`, `fix:`, `docs:`, `chore:`).
3. **PR Landing**: Rebase linear é preferido. Adicione o autor como co-contributor se fizer squash.
4. **Changelog**: Mantenha o arquivo `CHANGELOG.md` atualizado com o número do PR/Issue.

### Multi-Agent Safety (Convivência com outros IAs)

- **Git**: Evite `git stash` ou `git worktree` a menos que solicitado.
- **Sync**: Use `git pull --rebase` antes de push para integrar mudanças de outros agentes.
- **Escopo**: Commite apenas os arquivos relacionados à sua tarefa.

---

## 🚨 Guardrails Específicos (Agent-Only)

- **Dependency Patching**: Versões exatas para `patchedDependencies`. Não use `^` ou `~`.
- **Carbon**: Nunca atualize a dependência `Carbon`.
- **Tool Schemas**: Evite `Type.Union`, `anyOf`, `oneOf`. Use `stringEnum` e `Type.Optional`. Nunca use a propriedade `format`.
- **macOS Ops**: O Gateway deve ser gerenciado via App Moltbot ou `scripts/restart-mac.sh`. Não use tmux para o gateway no mac.
- **Mobile Apps**: "Restart" para iOS/Android significa Rebuild + Relaunch.
- **Permissions**: Verifique dispositivos reais antes de usar simuladores.

---

## 📖 Referências Úteis

- [Configuração Completa](https://docs.molt.bot/gateway/configuration)
- [Guia de Releasing](https://docs.molt.bot/reference/releasing)
- [Gateway Runbook](https://docs.molt.bot/gateway)
- [Troubleshooting](https://docs.molt.bot/channels/troubleshooting)

---
*Para suporte com 1Password (NPM publish), consulte a seção específica no final da documentação técnica anterior.*
