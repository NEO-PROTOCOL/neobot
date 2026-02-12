# Status de Vulnerabilidades de Segurança

## Resumo

Este projeto atualmente possui **13 vulnerabilidades** conhecidas nas dependências, sendo:

- **2 críticas** (sem correção disponível)
- **1 alta** (sem correção disponível)
- **10 moderadas** (maioria sem correção disponível)

## Vulnerabilidades Críticas (2)

### 1. `form-data` (Critical)

- **Severidade**: Crítica
- **CVE**: [GHSA-fjxv-7rqg-78g4](https://github.com/advisories/GHSA-fjxv-7rqg-78g4)
- **Caminho**: `request` → `instagram-private-api`
- **Status**: ❌ **Sem correção disponível**
- **Motivo**: A biblioteca `request` está deprecated e não recebe mais atualizações. O `instagram-private-api` depende dela.

### 2. `qs` (High)

- **Severidade**: Alta
- **CVE**: [GHSA-6rw7-vpxm-498p](https://github.com/advisories/GHSA-6rw7-vpxm-498p)
- **Caminho**: `request` → `instagram-private-api`
- **Status**: ❌ **Sem correção disponível**
- **Motivo**: Dependência transitiva de `request` que está deprecated.

## Vulnerabilidades Moderadas (10)

### 1. `tough-cookie` (Moderate)

- **Severidade**: Moderada
- **CVE**: [GHSA-72xf-g2v4-qvf3](https://github.com/advisories/GHSA-72xf-g2v4-qvf3)
- **Caminho**: `request` → `instagram-private-api`
- **Status**: ❌ **Sem correção disponível**

### 2. `phin` (Moderate) - via `@jimp/core` e `terminal-image`

- **Severidade**: Moderada
- **CVE**: [GHSA-x565-32qp-m3vf](https://github.com/advisories/GHSA-x565-32qp-m3vf)
- **Caminho**: `terminal-image@^2.0.0` → `@jimp/core` → `phin`
- **Status**: ⚠️ **Correção disponível com breaking changes**
- **Correção**: Atualizar `terminal-image` para `4.1.0` (breaking change)
- **Risco**: Pode quebrar funcionalidades de renderização de imagens

### 3-10. Outras vulnerabilidades moderadas

- Maioria relacionada a dependências transitivas de `instagram-private-api`
- Status: ❌ **Sem correção disponível**

## Vulnerabilidades Corrigidas

### ✅ `esbuild` (Moderate)

- **Status**: ✅ **Corrigido**
- **Ação**: Atualizado `tsx` de `^3.12.7` para `^4.21.0`
- **Data**: Janeiro 2025

## Por que não podemos corrigir?

### Dependências Críticas

As vulnerabilidades críticas vêm da cadeia de dependências:
```
instagram-private-api → request → form-data, qs, tough-cookie
```

**Problemas:**

1. `request` está **deprecated** desde 2020 e não recebe mais atualizações
2. `instagram-private-api` depende de `request` e não tem alternativa imediata
3. Não há correções disponíveis para essas vulnerabilidades

### Impacto Real

**Contexto de uso:**

- Este é um **CLI local** (não um servidor web)
- As vulnerabilidades afetam principalmente:
  - Servidores web expostos à internet
  - Aplicações que processam dados não confiáveis
- O uso típico deste CLI:
  - Execução local no terminal do usuário
  - Comunicação direta com APIs do Instagram
  - Não expõe serviços à internet

**Risco prático:**

- **Baixo** para uso local como CLI
- As vulnerabilidades são mais críticas em contextos de servidor web

## Ações Recomendadas

### ✅ Já Implementado

- [x] Atualizado `tsx` para corrigir vulnerabilidade do `esbuild`
- [x] Monitoramento ativo de vulnerabilidades via `npm audit`

### 🔄 Monitoramento Contínuo

- Monitorar atualizações do `instagram-private-api` que possam resolver dependências
- Verificar periodicamente: `npm audit`
- Considerar alternativas futuras se as dependências não forem atualizadas

### ⚠️ Não Recomendado

- **NÃO usar `npm audit fix --force`**:
  - Não resolve as vulnerabilidades críticas
  - Pode causar breaking changes
  - Pode quebrar funcionalidades do projeto

### 🔮 Futuro

- Considerar migração para alternativas ao `instagram-private-api` se disponíveis
- Avaliar atualização de `terminal-image` para `4.1.0` quando houver tempo para testar breaking changes

## Verificação

Para verificar o status atual das vulnerabilidades:

```bash
npm audit
```

Para ver detalhes completos:

```bash
npm audit --json
```

## Referências

- [npm audit documentation](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [GitHub Security Advisories](https://github.com/advisories)
- [CVE Database](https://cve.mitre.org/)

## Atualização

Este documento foi atualizado em: **Janeiro 2025**

Última verificação: `npm audit` executado após atualização do `tsx` para `^4.21.0`

