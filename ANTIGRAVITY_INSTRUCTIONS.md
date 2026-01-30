<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
  ANTIGRAVITY · FLOWCLOSER INSTRUCTIONS
========================================
```

**Instruções para passar à IA no Antigravity**
**quando trabalhar no FlowCloser Agent.**

────────────────────────────────────────

## 🎯 CONTEXTO PARA A IA

Cole isto no Antigravity quando abrir o
projeto FlowCloser:

```markdown
# FlowCloser Agent - Contexto de Trabalho

## 📍 Localização

Este projeto está localizado em:
`/Users/nettomello/CODIGOS/flowcloser-local/`

É um projeto **INDEPENDENTE** do Neobot,
com deploy automático no Railway.

## 🔗 Integração

Este projeto está integrado ao Neobot via
**Remote Integration** (loose-coupled).

**Neobot orquestra via:**
- Skills (HTTP client)
- Scripts de conveniência
- Documentação centralizada

**Referências:**
- Integration config: `/CODIGOS/neobot/extensions/flowcloser/integration.json`
- Documentação: `/CODIGOS/neobot/docs/integrations/flowcloser/`
- ADRs: `/CODIGOS/neobot/extensions/flowcloser/ADR-*.md`

## ⚠️ REGRAS CRÍTICAS

### NUNCA FAÇA:

1. **Quebrar Railway deploy**
   - Deploy é automático via push
   - Todas as rotas estão ativas
   - Webhooks Instagram/WhatsApp funcionando

2. **Remover endpoints sem validar**
   - Clientes externos podem estar usando
   - Meta APIs dependem de rotas específicas

3. **Commitar secrets**
   - Use .env para todas as keys
   - Adicione novos secrets ao .env.example
   - Valide .gitignore

4. **Atualizar deps críticas sem testar**
   - OpenAI SDK
   - Google AI SDK
   - Express
   - better-sqlite3

### SEMPRE FAÇA:

1. **Testar localmente ANTES de commit**
   ```bash
   npm run dev
   curl http://localhost:8042/health
   ```

2. **Usar TypeScript strict**
   - Sem `any` types
   - Interfaces para todos os DTOs
   - Validação runtime

3. **Conventional Commits**
   ```bash
   feat: add Instagram story replies
   fix: resolve Gemini fallback timeout
   chore: update OpenAI SDK to v4.20
   ```

4. **Documentar mudanças significativas**
   - Atualizar README se necessário
   - Adicionar comentários JSDoc
   - Registrar breaking changes

## 🎯 PRIORIDADES ATUAIS

Com base na análise feita, estas são as
prioridades para melhorar o projeto:

### Priority 1 (Critical) 🔥

**1. Adicionar testes automatizados**

Projeto atualmente NÃO tem testes.

```bash
# Instalar Vitest
npm install -D vitest @vitest/ui

# Criar primeiro teste
# src/services/leads.test.ts
```

**Cobertura mínima:** 70%

**2. Melhorar error handling**

- Try/catch em todos os async
- Retry logic para APIs externas
- Fallback GPT-4o → Gemini (já existe)
- Logging estruturado

**3. Type safety**

- TypeScript strict mode (já habilitado)
- Interfaces para todos os DTOs
- Validação runtime (Zod)

### Priority 2 (High) ⚡

**4. Modularizar main.ts**

Arquivo tem 924 linhas! Quebrar em:

```
src/
├── server.ts        (Express setup)
├── routes/
│   ├── webhooks.ts  (todos os webhooks)
│   ├── api.ts       (leads, agents)
│   └── legal.ts     (já existe)
├── middleware/
│   ├── auth.ts
│   └── error.ts
└── main.ts          (entry point simples)
```

**5. Adicionar linter**

```bash
npm install -D eslint @typescript-eslint/parser
npm install -D prettier eslint-config-prettier
```

**6. OpenAPI documentation**

```bash
npm install swagger-jsdoc swagger-ui-express
```

### Priority 3 (Medium) 💤

**7. Performance optimization**

- Cache de respostas frequentes
- Connection pooling (DB)
- Rate limiting

**8. Observability**

- Metrics (Prometheus?)
- APM (Railway integrations)
- Alerting

## 📊 STATUS ATUAL DO PROJETO

```text
[####] Produção Railway ........... OK
[####] TypeScript strict .......... OK
[####] LLM fallback ............... OK
[####] Multi-platform webhooks .... OK
[#---] Testes ................... WARN
[#---] Linter ................... WARN
[----] Modularização ............ TODO
[----] OpenAPI docs ............. TODO
```

## 🛠️ COMANDOS ÚTEIS

```bash
# Desenvolvimento
npm run dev              # Watch mode

# Build
npm run build            # TSC compile

# Testes (quando implementar)
npm test
npm run test:coverage

# Railway
railway logs -f          # Tail logs
railway status           # Check status

# Database
sqlite3 data/flowcloser.db
```

## 📖 RECURSOS

**Documentação oficial:**
- OpenAI: https://platform.openai.com/docs
- Google AI: https://ai.google.dev/docs
- Meta Graph API: https://developers.facebook.com/docs/graph-api
- Railway: https://docs.railway.app

**Neobot docs (para referência):**
- Architecture: `/CODIGOS/neobot/docs/integrations/flowcloser/architecture.md`
- API Reference: `/CODIGOS/neobot/docs/integrations/flowcloser/api-reference.md`
- Development: `/CODIGOS/neobot/docs/integrations/flowcloser/development.md`
- Troubleshooting: `/CODIGOS/neobot/docs/integrations/flowcloser/troubleshooting.md`

## ✅ CHECKLIST PRÉ-COMMIT

Antes de cada commit, verificar:

- [ ] Código compila sem erros (`npm run build`)
- [ ] Testes passam (quando implementar)
- [ ] Linter passa (quando configurar)
- [ ] .env.example atualizado (se novos vars)
- [ ] Nenhum secret commitado
- [ ] Health check funciona localmente
- [ ] Commit message segue Conventional Commits

## 🤝 COMUNICAÇÃO

**Quando pedir ajuda a Mellø:**
- Decisões arquiteturais críticas
- Mudanças que afetam produção
- Dúvidas sobre regras de negócio
- Necessidade de API keys

**Quando atualizar Neobot:**
- Novos endpoints (atualizar api-reference.md)
- Mudanças em schemas (atualizar integration.json)
- Breaking changes (criar novo ADR)

────────────────────────────────────────
```

────────────────────────────────────────

## 💬 PROMPTS ESPECÍFICOS

### Prompt 1: Implementar Testes

```markdown
Preciso implementar testes automatizados
para o FlowCloser Agent.

## Setup

Usar **Vitest** como test runner.

```bash
npm install -D vitest @vitest/ui @types/node
```

## Estrutura

Testes colocalizados:

```
src/services/leads.ts
src/services/leads.test.ts  ← criar
```

## O que testar

**Unit tests:**
- Lead qualification logic
- Score calculation
- Data validation

**Integration tests:**
- Health endpoint
- Message endpoint
- Webhook handlers

**Mocks necessários:**
- OpenAI responses
- Gemini responses
- Instagram API
- SQLite database

## Cobertura mínima

70% (lines/branches/functions)

## NÃO modifique

- Lógica de negócio existente
- Endpoints ativos
- Webhooks funcionando

Por favor, implemente apenas os testes
sem alterar funcionalidades.
```

────────────────────────────────────────

### Prompt 2: Modularizar main.ts

```markdown
Preciso refatorar o arquivo main.ts que
está muito grande (924 linhas).

## Problema

main.ts contém:
- Express setup
- Todas as rotas
- Webhooks
- Agent initialization
- Middleware
- Error handling

## Estrutura desejada

```
src/
├── server.ts          # Express setup
├── routes/
│   ├── webhooks.ts    # Todos webhooks
│   ├── api.ts         # /api/leads, /api/agents
│   └── legal.ts       # (já existe)
├── middleware/
│   ├── auth.ts        # Webhook validation
│   └── error.ts       # Error handler
└── main.ts            # Entry point simples
```

## Requisitos

1. **Manter funcionalidades**
   - Todos endpoints funcionando
   - Webhooks preservados
   - Health check OK

2. **Backwards compatibility**
   - Mesmas rotas
   - Mesmos responses
   - Railway deploy não quebra

3. **TypeScript strict**
   - Interfaces
   - Sem any
   - Exports/imports corretos

4. **Testar após refactor**
   ```bash
   npm run build
   npm run dev
   curl http://localhost:8042/health
   ```

Por favor, refatore mantendo tudo
funcionando. Não adicione funcionalidades
novas.
```

────────────────────────────────────────

### Prompt 3: Adicionar OpenAPI Docs

```markdown
Preciso documentar os endpoints do
FlowCloser com OpenAPI/Swagger.

## Endpoints a documentar

**Core:**
- GET /health
- GET /dashboard

**API:**
- GET /api/leads
- GET /api/agents
- POST /api/agents/flowcloser/message

**Webhooks:**
- GET /api/webhooks/instagram
- POST /api/webhooks/instagram
- GET /api/webhooks/whatsapp
- POST /api/webhooks/whatsapp

**Legal:**
- GET /privacy-policy
- GET /terms-of-service
- POST /api/data-deletion

## Setup

```bash
npm install swagger-jsdoc swagger-ui-express
npm install -D @types/swagger-jsdoc
npm install -D @types/swagger-ui-express
```

## Implementação

1. Criar `src/swagger.ts` com config
2. Adicionar JSDoc nos endpoints
3. Servir UI em `/api-docs`
4. Gerar `openapi.json` automaticamente

## Requisitos

- OpenAPI 3.0 spec
- Request/response examples
- Status codes documentados
- Schemas com tipos TypeScript

Por favor, implemente sem quebrar rotas
existentes.
```

────────────────────────────────────────

### Prompt 4: Configurar Linter

```markdown
Preciso configurar ESLint + Prettier
para o FlowCloser.

## Setup

```bash
npm install -D eslint @typescript-eslint/parser
npm install -D @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier
npm install -D eslint-plugin-prettier
```

## Configuração

**`.eslintrc.js`:**
- TypeScript rules
- Strict mode
- No console.log em production
- Async/await preferred

**`.prettierrc`:**
- 2 spaces
- Single quotes
- Trailing commas
- Line length: 80

**Scripts `package.json`:**
```json
{
  "lint": "eslint src --ext .ts",
  "lint:fix": "eslint src --ext .ts --fix",
  "format": "prettier --write 'src/**/*.ts'"
}
```

## NÃO modifique

- Código existente (só configurar)
- Funcionalidades
- Endpoints

Após configurar, rode `npm run lint`
e veja quantos warnings existem.

NÃO conserte todos de uma vez. Apenas
configure as ferramentas.
```

────────────────────────────────────────

## 📋 WORKFLOW RECOMENDADO

```text
▓▓▓ TÍPICO WORKFLOW
────────────────────────────────────────
1. Mellø abre Antigravity
2. Cole "Contexto de Trabalho" (acima)
3. IA analisa projeto (já feito)
4. Mellø escolhe prioridade
5. Mellø cola Prompt específico
6. IA implementa
7. Mellø testa localmente
8. Mellø commita
9. Railway auto-deploya
10. Mellø valida production
```

────────────────────────────────────────

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"Code is law. Expand until
 chaos becomes protocol."

Security by design.
Exploits find no refuge here.
────────────────────────────────────────
