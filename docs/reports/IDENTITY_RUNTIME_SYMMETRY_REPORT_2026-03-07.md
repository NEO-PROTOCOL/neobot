# Identity Runtime Symmetry Report

Data: 2026-03-07
Base de referencia adotada: `neobot/config/ecosystem.json`

## Objetivo

Fechar a divergencia entre:

- `registry`
- `loader`
- `ecosystem.json`

## Correcoes Aplicadas

### 1. Loader alinhado ao registry

Arquivo:

- `neobot/src/neo/identity/loader.ts`

Mudanca:

- removido o mapa manual de variaveis de ambiente
- adicionado calculo dinamico da `ENV key` a partir de `template.id`

Efeito:

- `mio-telegram` passa a ser reconhecido automaticamente
- novas identidades futuras nao dependerao de lembrar um mapa duplicado no loader

Regra atual:

- `mio-core` -> `NEO_CORE_PRIVATE_KEY`
- `mio-telegram` -> `NEO_TELEGRAM_PRIVATE_KEY`
- `mio-warrior` -> `NEO_WARRIOR_PRIVATE_KEY`

### 2. Contagem sincronizada nos espelhos de ecossistema

Arquivos atualizados:

- `neobot/config/ecosystem.json`
- `neobot-orchestrator/config/ecosystem.json`
- `neo-nexus/config/ecosystem.json`
- `mio-system/ecosystem.json`
- `neo-agent-full/ecosystem.json`

Mudanca:

- nota de identidade alterada de `9 identidades` para `10 identidades`

## Estado Atual

### Registry

- status: simetrico
- fonte: `neobot/src/neo/identity/registry.ts`
- total declarado: 10 identidades

### Loader

- status: simetrico
- fonte: `neobot/src/neo/identity/loader.ts`
- total carregavel: derivado do `registry`, sem lista manual paralela

### Ecosystem

- status: simetrico
- fonte de referencia: `neobot/config/ecosystem.json`
- espelhos sincronizados: sim

## Verificacao

Validacoes executadas:

1. busca confirmando que todos os `ecosystem.json` relevantes agora apontam para `10 identidades`
2. importacao direta do loader com `node --import tsx`, resultado: `loader-ok`

Validacao que falhou, mas por ruido estrutural preexistente:

- `pnpm -C NEO-PROTOCOL/neobot tsgo`

Motivo:

- o projeto possui erros amplos fora do escopo desta correcao, especialmente em `extensions/*`, imports `.ts`, modulos ausentes e tipagem do SDK

Conclusao:

- a correcao de identidade ficou valida localmente
- o `typecheck` global do repositorio continua com dividas independentes

## O Que Continua Aberto

Isto ainda nao foi corrigido porque ja entra em consolidacao de produto, nao em simetria minima:

- `mio-system/src/server.js` ainda expone `/api/v1/identities` como placeholder
- `neo-protcl` e `neo-protocol-landing` continuam duplicando `IdentityGraph`
- ainda nao existe resolvedor canonico unificando:
  - `mio-id`
  - `nodeId`
  - `wallet`
  - `role`
  - `reputation`

## Leitura Final

A simetria minima do runtime foi restaurada.

Agora o ecossistema ja nao se contradiz no nivel mais basico sobre:

- quantas identidades existem
- como elas sao mapeadas para chaves
- qual configuracao de ecossistema descreve esse universo

O proximo passo ja nao e reparo.
E definicao de produto.
