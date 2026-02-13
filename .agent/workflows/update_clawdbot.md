---
description: Sync neobot with OpenClaw upstream when the fork has diverged
---

# OpenClaw Upstream Sync

O neobot é um fork do [OpenClaw](https://github.com/openclaw/openclaw) (ex-Clawdbot/Moltbot).
Use este workflow quando o upstream tiver updates relevantes (Baileys, modelos, protocolo, segurança).

## 1. Verificar Divergência

```bash
git fetch upstream
git rev-list --left-right --count main...upstream/main
```

Resultado: `<X> aheadlocal  >Y behind upstream`

- `X` = seus commits no neobot
- `Y` = commits do upstream que você ainda não tem

Ver o que mudou no upstream:

```bash
git log --oneline upstream/main ^main | head -20
```

## 2. Decisão de Estratégia

| Situação | Estratégia |
|----------|-----------|
| Poucos commits locais, muitos upstream | **Rebase** (histórico limpo) |
| Muitos commits locais ou branch compartilhada | **Merge** (preserva histórico) |

## 3A. Rebase (preferido)

```bash
# Garantir working tree limpo
git status

# Rebase
git rebase upstream/main
```

**Conflitos comuns:**

| Arquivo | Resolução |
|---------|-----------|
| `package.json` | Manter deps do upstream, preservar scripts NEO |
| `pnpm-lock.yaml` | Aceitar upstream, rodar `pnpm install` depois |
| `src/` | Mesclar com cuidado, preferir estrutura do upstream |

```bash
# Após resolver conflito
git add <arquivo>
git rebase --continue

# Pular commit já aplicado
git rebase --skip

# Abortar e voltar ao estado anterior
git rebase --abort
```

## 3B. Merge (alternativo)

```bash
git merge upstream/main --no-edit
git add <arquivos resolvidos>
git commit
```

## 4. Rebuild

```bash
pnpm install
pnpm build
```

## 5. Verificar e Push

```bash
# Checar se o build está ok
ls dist/

# Push (force necessário após rebase)
git push origin main --force-with-lease

# Ou push normal após merge
git push origin main
```

## Troubleshooting

**EPERM / sandbox macOS:**
Se `pnpm install`, `pnpm build` ou qualquer script falhar com `EPERM` ou `operation not permitted` — **PARAR e pedir ao usuário para rodar o comando manualmente no terminal.** Não tentar novamente, não usar sudo. Aguardar confirmação antes de continuar.

**Build falha após sync:**
```bash
rm -rf node_modules dist
pnpm install
pnpm build
```

**Patch failures:**
```bash
pnpm install 2>&1 | grep -i patch
# Checar patches/ vs patchedDependencies no package.json
```

**Type errors após sync:**
Verificar se alguma interface do upstream quebrou tipos customizados do NEO em `src/neo/` ou `skills/`.
