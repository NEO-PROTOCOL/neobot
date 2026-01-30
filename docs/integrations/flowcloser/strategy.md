========================================
 FLOWCLOSER · INTEGRAÇÃO REMOTA (LOOSE)
========================================

Estratégia de integração loose-coupled
mantendo FlowCloser independente e Neobot
como orquestrador + centro de documentação.

========================================
   🎯 FILOSOFIA: "Orquestração, não Fusão"
========================================

## CONCEITO

```text
FlowCloser Agent                 Neobot
(Independente)                   (Orquestrador)
─────────────────────────────────────────────
📍 Local próprio                 📍 Local próprio
🚀 Deploy Railway                📚 ADRs + Docs
🔧 Dev em Antigravity            🔧 Dev em Cursor
💾 Código completo               🔗 Referências
🌐 HTTP API                      🎯 Skills (client)
📊 Database SQLite               📖 Documentação
──────────────────────────────────────────────
         ↕️ HTTP / Filesystem
         ↕️ Skills orchestration
```

**Vantagens:**

- ✅ Railway rotas preservadas
- ✅ Zero risco de quebrar deploy
- ✅ Desenvolvimento totalmente isolado
- ✅ Neobot = Centro de controle
- ✅ ADRs bem organizados

---

## 📂 ESTRUTURA PROPOSTA

### FlowCloser (mantém tudo como está)

```text
/Users/nettomello/CODIGOS/flowcloser-local/
├── src/                  # Código completo
├── data/                 # SQLite databases
├── package.json          # Deps completas
├── .env                  # Env vars
└── ...                   # Tudo preservado

Git: github.com/neomello/flowcloser-agent
Deploy: Railway (sem mudanças)
URL: flowcloser-agent-production.up.railway.app
```

### Neobot (orquestração + docs)


```text
/Users/nettomello/CODIGOS/neobot/
├── extensions/
│   └── flowcloser/           # Não tem código!
│       ├── README.md         # Overview
│       ├── ADR-001.md        # Por que FlowCloser separado
│       ├── ADR-002.md        # Estratégia de integração
│       ├── ADR-003.md        # Deploy Railway
│       ├── integration.json  # Config de integração
│       └── schema/           # JSON schemas (para validação)
│           ├── lead.schema.json
│           └── webhook.schema.json
│
├── skills/
│   └── flowcloser/           # Skills que chamam FlowCloser
│       ├── qualify.ts        # HTTP → FlowCloser
│       ├── dashboard.ts      # Open dashboard URL
│       ├── backup.ts         # Trigger backup
│       ├── health.ts         # Check health
│       └── leads.ts          # Query leads (filesystem)
│
├── scripts/
│   └── flowcloser/
│       ├── open-antigravity.sh  # Abrir no Antigravity
│       ├── check-health.sh      # Health check
│       ├── tail-logs.sh         # Tail Railway logs
│       └── backup-db.sh         # Backup local SQLite
│
└── docs/
    └── integrations/
        └── flowcloser/
            ├── README.md            # Overview geral
            ├── architecture.md      # Diagrama arquitetura
            ├── api-reference.md     # API endpoints
            ├── development.md       # Como desenvolver
            ├── deployment.md        # Railway setup
            ├── troubleshooting.md   # Como debugar
            └── changelog.md         # Histórico mudanças
```

---

## 🔗 INTEGRATION CONFIG

### `extensions/flowcloser/integration.json`

```json
{
  "name": "FlowCloser Agent",
  "version": "1.0.0",
  "type": "remote",
  "status": "active",
  "location": {
    "local": "/Users/nettomello/CODIGOS/flowcloser-local",
    "repository": "https://github.com/neomello/flowcloser-agent",
    "production": "https://flowcloser-agent-production.up.railway.app"
  },
  "endpoints": {
    "health": "/health",
    "dashboard": "/dashboard",
    "api_leads": "/api/leads",
    "webhook_instagram": "/api/webhooks/instagram",
    "webhook_whatsapp": "/api/webhooks/whatsapp"
  },
  "data": {
    "sqlite": "/Users/nettomello/CODIGOS/flowcloser-local/data/flowcloser.db",
    "leads_json": "/Users/nettomello/CODIGOS/flowcloser-local/data/leads.json"
  },
  "ide": "Antigravity",
  "maintainer": "Mellø",
  "last_updated": "2026-01-30"
}
```

---

## 📝 ADR TEMPLATE

### `extensions/flowcloser/ADR-001.md`

```markdown
========================================
ADR-001 · FlowCloser como Projeto
         Independente
========================================

Data: 2026-01-30
Status: ACEITO ✅
Decisor: Mellø

----------------------------------------

## CONTEXTO

FlowCloser Agent está em produção no Railway
com deploy automático, rotas estabelecidas e
integração com Meta APIs (Instagram/WhatsApp).

Consideramos trazer o código para dentro do
monorepo Neobot (opção "Monorepo Modular"),
mas isso apresenta riscos.

----------------------------------------

## DECISÃO

**Manter FlowCloser como projeto independente.**

FlowCloser permanece em:
`/Users/nettomello/CODIGOS/flowcloser-local/`

Neobot orquestra via:
- Skills (HTTP client)
- Scripts de conveniência
- ADRs bem documentados

----------------------------------------

## CONSEQUÊNCIAS

### Positivas ✅

1. **Zero risco de quebrar Railway**
   - Deploy continua funcionando
   - Rotas preservadas
   - Webhooks não afetados

2. **Desenvolvimento isolado**
   - Antigravity para FlowCloser
   - Cursor para Neobot
   - Sem conflitos

3. **Clareza de responsabilidades**
   - FlowCloser = Agent execution
   - Neobot = Orchestration + Docs

4. **Flexibilidade futura**
   - Fácil escalar FlowCloser
   - Fácil adicionar outras extensões
   - Loose coupling = fácil manutenção

### Negativas ⚠️

1. **Duplicação de documentação**
   - Mitigado por ADRs no Neobot
   - Docs de referência centralizados

2. **Dois repos para manter**
   - Aceitável dado isolamento
   - Skills abstraem complexidade

3. **Sincronização manual**
   - Skills precisam conhecer API
   - Schemas ajudam validação

----------------------------------------

## ALTERNATIVAS CONSIDERADAS

### A) Monorepo Modular
- Pros: Tudo em um lugar
- Cons: Risco Railway, complexidade Git

### B) Git Subtree
- Pros: Histórico preservado
- Cons: Complexidade sincronização

### C) Integração Remota ← ESCOLHIDA
- Pros: Isolamento, segurança
- Cons: Duas bases de código

----------------------------------------

## REFERÊNCIAS

- FLOWCLOSER_INTEGRATION_STRATEGY.md
- FLOWCLOSER_MIGRATION_PLAN.md
- Railway Docs: https://docs.railway.app

----------------------------------------

▓▓▓ NΞØ MELLØ - 2026
========================================
```

---

## 🎯 SKILLS DE INTEGRAÇÃO

### `skills/flowcloser/qualify.ts`

```typescript
/**
 * FlowCloser Qualify Lead Skill
 * 
 * Qualifica um lead consultando o FlowCloser Agent
 * via HTTP API.
 */

import type { SkillContext } from '../../src/types/skill.js';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const metadata = {
  name: 'flowcloser:qualify',
  description: 'Qualifica lead do FlowCloser',
  category: 'flowcloser',
  tags: ['leads', 'sales', 'qualification'],
  version: '1.0.0'
};

interface Lead {
  id: string;
  name: string;
  score: number;
  qualified: boolean;
  [key: string]: any;
}

export async function execute(ctx: SkillContext) {
  const leadId = ctx.args.leadId as string;
  
  if (!leadId) {
    return {
      error: 'leadId é obrigatório',
      usage: 'moltbot flowcloser:qualify --leadId=abc123'
    };
  }
  
  try {
    // Ler config de integração
    const configPath = join(
      process.cwd(),
      'extensions/flowcloser/integration.json'
    );
    const config = JSON.parse(await readFile(configPath, 'utf-8'));
    
    // Ler leads do filesystem (SQLite ou JSON)
    const leadsPath = config.data.leads_json;
    const leadsData = JSON.parse(await readFile(leadsPath, 'utf-8'));
    
    const lead = leadsData.find((l: Lead) => l.id === leadId);
    
    if (!lead) {
      return {
        error: 'Lead não encontrado',
        leadId
      };
    }
    
    // Registrar no Ledger
    await ctx.ledger.record({
      action: 'qualify_lead',
      actor: 'user',
      channel: 'cli',
      details: {
        leadId,
        score: lead.score,
        qualified: lead.qualified
      }
    });
    
    return {
      success: true,
      lead: {
        id: lead.id,
        name: lead.name,
        score: lead.score,
        qualified: lead.qualified,
        status: lead.status
      }
    };
    
  } catch (error) {
    return {
      error: 'Falha ao qualificar lead',
      message: error instanceof Error ? error.message : 'Unknown error',
      hint: 'Verifique se FlowCloser está rodando'
    };
  }
}
```

---

### `skills/flowcloser/dashboard.ts`

```typescript
/**
 * FlowCloser Dashboard Skill
 * 
 * Abre o dashboard do FlowCloser no browser.
 */

import type { SkillContext } from '../../src/types/skill.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import { readFile } from 'fs/promises';
import { join } from 'path';

const execAsync = promisify(exec);

export const metadata = {
  name: 'flowcloser:dashboard',
  description: 'Abre dashboard de leads do FlowCloser',
  category: 'flowcloser',
  tags: ['dashboard', 'ui', 'leads'],
  version: '1.0.0'
};

export async function execute(ctx: SkillContext) {
  try {
    // Ler config
    const configPath = join(
      process.cwd(),
      'extensions/flowcloser/integration.json'
    );
    const config = JSON.parse(await readFile(configPath, 'utf-8'));
    
    // Escolher URL (local ou production)
    const useProduction = ctx.args.production === 'true';
    const baseUrl = useProduction 
      ? config.location.production
      : 'http://localhost:8042';
    
    const dashboardUrl = `${baseUrl}${config.endpoints.dashboard}`;
    
    // Abrir no browser
    await execAsync(`open ${dashboardUrl}`);
    
    // Registrar no Ledger
    await ctx.ledger.record({
      action: 'open_dashboard',
      actor: 'user',
      channel: 'cli',
      details: { url: dashboardUrl }
    });
    
    return {
      success: true,
      url: dashboardUrl,
      message: 'Dashboard aberto no browser'
    };
    
  } catch (error) {
    return {
      error: 'Falha ao abrir dashboard',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
```

---

### `skills/flowcloser/health.ts`

```typescript
/**
 * FlowCloser Health Check Skill
 * 
 * Verifica se FlowCloser está rodando (local ou prod).
 */

import type { SkillContext } from '../../src/types/skill.js';
import { readFile } from 'fs/promises';
import { join } from 'path';

export const metadata = {
  name: 'flowcloser:health',
  description: 'Health check do FlowCloser Agent',
  category: 'flowcloser',
  tags: ['health', 'monitoring'],
  version: '1.0.0'
};

export async function execute(ctx: SkillContext) {
  try {
    // Ler config
    const configPath = join(
      process.cwd(),
      'extensions/flowcloser/integration.json'
    );
    const config = JSON.parse(await readFile(configPath, 'utf-8'));
    
    // Check local
    const localUrl = `http://localhost:8042${config.endpoints.health}`;
    const localHealth = await checkHealth(localUrl);
    
    // Check production
    const prodUrl = `${config.location.production}${config.endpoints.health}`;
    const prodHealth = await checkHealth(prodUrl);
    
    return {
      success: true,
      local: localHealth,
      production: prodHealth
    };
    
  } catch (error) {
    return {
      error: 'Falha no health check',
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function checkHealth(url: string) {
  try {
    const response = await fetch(url, { 
      signal: AbortSignal.timeout(5000) 
    });
    
    if (!response.ok) {
      return { status: 'down', url };
    }
    
    const data = await response.json();
    return { 
      status: 'up', 
      url,
      data 
    };
    
  } catch (error) {
    return { 
      status: 'down', 
      url,
      error: error instanceof Error ? error.message : 'Unknown' 
    };
  }
}
```

---

## 📜 SCRIPTS DE CONVENIÊNCIA

### `scripts/flowcloser/open-antigravity.sh`

```bash
#!/bin/bash
# Abre FlowCloser no Antigravity IDE

set -e

FLOWCLOSER_PATH="/Users/nettomello/CODIGOS/flowcloser-local"

if [ ! -d "$FLOWCLOSER_PATH" ]; then
  echo "❌ FlowCloser não encontrado em: $FLOWCLOSER_PATH"
  exit 1
fi

echo "🚀 Abrindo FlowCloser no Antigravity..."
open -a "Antigravity" "$FLOWCLOSER_PATH"

echo "✅ FlowCloser aberto!"
```

---

### `scripts/flowcloser/check-health.sh`

```bash
#!/bin/bash
# Health check do FlowCloser (local + prod)

set -e

echo "🔍 Checking FlowCloser health..."
echo ""

# Local
echo "📍 Local (localhost:8042):"
if curl -sf http://localhost:8042/health > /dev/null 2>&1; then
  echo "✅ UP"
  curl -s http://localhost:8042/health | jq
else
  echo "❌ DOWN"
fi

echo ""

# Production
echo "🌐 Production (Railway):"
if curl -sf https://flowcloser-agent-production.up.railway.app/health > /dev/null 2>&1; then
  echo "✅ UP"
  curl -s https://flowcloser-agent-production.up.railway.app/health | jq
else
  echo "❌ DOWN"
fi
```

---

## 📖 DOCUMENTAÇÃO COMPLETA

### `docs/integrations/flowcloser/README.md`

```markdown
# FlowCloser Integration

## Overview

FlowCloser Agent é um lead qualification agent
integrado ao Neobot via **Remote Integration**
(loose-coupled).

## Arquitetura

```
┌─────────────────────┐
│   FlowCloser Agent  │ (Independente)
│  (Antigravity IDE)  │
│                     │
│ - Lead qualification│
│ - Instagram DM      │
│ - WhatsApp API      │
│ - SQLite database   │
│ - Railway deploy    │
└──────────┬──────────┘
           │ HTTP API
           │ Filesystem
           ↓
┌─────────────────────┐
│      Neobot         │ (Orquestrador)
│   (Cursor IDE)      │
│                     │
│ - Skills (client)   │
│ - Scripts           │
│ - ADRs + Docs       │
│ - Ledger audit      │
└─────────────────────┘
```

## Localização

- **FlowCloser:** `/Users/nettomello/CODIGOS/flowcloser-local/`
- **Git:** `https://github.com/neomello/flowcloser-agent`
- **Deploy:** Railway (auto)
- **URL Prod:** `flowcloser-agent-production.up.railway.app`

## Skills Disponíveis

```bash
# Qualificar lead
moltbot flowcloser:qualify --leadId=abc123

# Abrir dashboard
moltbot flowcloser:dashboard
moltbot flowcloser:dashboard --production=true

# Health check
moltbot flowcloser:health

# Backup IPFS
moltbot flowcloser:backup
```

## Scripts

```bash
# Abrir no Antigravity
./scripts/flowcloser/open-antigravity.sh

# Health check
./scripts/flowcloser/check-health.sh

# Tail logs (Railway)
./scripts/flowcloser/tail-logs.sh

# Backup database
./scripts/flowcloser/backup-db.sh
```

## ADRs

- [ADR-001](../../extensions/flowcloser/ADR-001.md) - Por que independente
- [ADR-002](../../extensions/flowcloser/ADR-002.md) - Estratégia integração
- [ADR-003](../../extensions/flowcloser/ADR-003.md) - Deploy Railway

## Desenvolvimento

Ver: [development.md](./development.md)
```

---

## ✅ PLANO DE IMPLEMENTAÇÃO

### FASE 1: Estrutura (15min)

```bash
# 1. Criar pastas
cd /Users/nettomello/CODIGOS/neobot

mkdir -p extensions/flowcloser
mkdir -p extensions/flowcloser/schema
mkdir -p skills/flowcloser
mkdir -p scripts/flowcloser
mkdir -p docs/integrations/flowcloser

# 2. Criar integration.json
# (copiar conteúdo acima)

# 3. Criar ADR-001.md
# (copiar template acima)

# 4. Atualizar .gitignore
echo "extensions/flowcloser/.env" >> .gitignore
```

---

### FASE 2: Skills (30min)

```bash
# Criar skills
# - qualify.ts
# - dashboard.ts
# - health.ts
# (copiar código acima)

# Testar skills
pnpm moltbot flowcloser:health
```

---

### FASE 3: Scripts (15min)

```bash
# Criar scripts
# - open-antigravity.sh
# - check-health.sh
# (copiar código acima)

chmod +x scripts/flowcloser/*.sh

# Testar
./scripts/flowcloser/check-health.sh
```

---

### FASE 4: Docs (30min)

```bash
# Criar documentação
# - README.md
# - architecture.md
# - api-reference.md
# - development.md
# - deployment.md
# - troubleshooting.md
# - changelog.md
```

---

## 🎯 RESULTADO FINAL

```text
FlowCloser:
  📍 /CODIGOS/flowcloser-local/ (intocado)
  🚀 Railway deploy (preservado)
  🔧 Antigravity IDE
  💾 Código completo

Neobot:
  📍 /CODIGOS/neobot/
  📚 ADRs bem documentados
  🎯 Skills de orquestração
  📜 Scripts de conveniência
  🔗 Integration config
```

**Benefícios:**
- ✅ Zero risco Railway
- ✅ Desenvolvimento isolado
- ✅ Neobot = Centro de controle
- ✅ ADRs = Histórico de decisões
- ✅ Docs = Single source of truth

---

**Versão:** 2.0 (Remote Integration)
**Data:** 2026-01-30
**Status:** Proposta aprovada por Mellø ✅

========================================
         ▓▓▓ NΞØ MELLØ - 2026
========================================
