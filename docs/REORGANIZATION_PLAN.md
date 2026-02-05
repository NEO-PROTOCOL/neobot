# NEOBOT - PLANO DE REORGANIZAÇÃO DE DOCUMENTAÇÃO
> **Data:** 2026-02-05  
> **Objetivo:** Eliminar confusão de identidades e organizar docs por nó/contexto

---

## 🎯 PROBLEMAS IDENTIFICADOS

### 1. Confusão de Identidade (Neobot vs FlowCloser vs Neo-Agent-Full)
- Docs misturam "atendimento" entre diferentes projetos
- Referências antigas a `flowcloser-agent` (deprecated)
- Falta clareza sobre qual projeto faz o quê

### 2. Arquivos na Raiz do Repo
- Vários `.md` importantes na raiz (dificulta navegação)
- Mistura de contextos (ASI1, WhatsApp, Vendas, Arquitetura)

### 3. Docs Sem Data/Roadmap Desorganizado
- `NEXT_STEPS_V2.md` sem datas
- Sensação de falta de progresso

### 4. Duplicação de Segurança
- `SECURITY.md` vs `SECURITY_AUDIT_30JAN2026.md`

---

## 📋 AÇÕES CORRETIVAS

### FASE 1: Mover Arquivos da Raiz para Estrutura Organizada

#### A) Arquitetura & Core (→ `docs/core/`)
- ✅ `ARCHITECTURE_NEO_PROTOCOL.md` → JÁ ESTÁ em `docs/core/`
- ✅ `SETUP.md` → JÁ ESTÁ em `docs/core/`
- ✅ `NEXT_STEPS_V2.md` → JÁ ESTÁ em `docs/core/`
- ⚠️ `FEATURES.md` → Renomear para `docs/core/NEOBOT_FEATURES.md` (clarificar que é do Neobot Architect)
- ⚠️ `DECISION_POINT_30JAN2026.md` → Mover para `docs/core/` e atualizar fase atual

#### B) ASI1 (→ `docs/asi1/`)
- ⚠️ `ASI1AI_SETUP_COMPLETE.md` → `docs/asi1/SETUP_COMPLETE.md`
- 📝 Criar `docs/asi1/README.md` explicando que ASI1 é o modelo local, NÃO OpenAI

#### C) WhatsApp/MIO (→ `docs/mio-whatsapp/`)
- ⚠️ `BLOCKLIST_FAMILIA.md` → `docs/mio-whatsapp/BLOCKLIST_FAMILIA.md`
- ⚠️ `CONTACT_RULES_SUMMARY.md` → `docs/mio-whatsapp/CONTACT_RULES.md`
- ⚠️ `OFERTAS_E_LINKS_VENDAS_WHATSAPP.md` → `docs/mio-whatsapp/OFERTAS_VENDAS.md`
- ⚠️ `WHATSAPP_BLOCKLIST_GUIDE.md` → `docs/mio-whatsapp/BLOCKLIST_GUIDE.md`

#### D) Identidades (→ `docs/mio/`)
- ⚠️ `NEO_IDENTITIES_GENERATED.md` → `docs/mio/IDENTITIES_GENERATED.md`

#### E) FlowOFF (→ `docs/nodes/flowoff/`)
- ⚠️ `FLOWOFF_ECOSYSTEM_MAP.md` → `docs/nodes/flowoff/ECOSYSTEM_MAP.md`
- ⚠️ `FLOWOFF_SALES_SETUP.md` → `docs/nodes/flowoff/SALES_SETUP.md`

#### F) Guias & Tutoriais (→ `docs/guides/`)
- ⚠️ `GUIA_COMPLETO_NEOBOT.md` → Renomear para `docs/guides/NEOBOT_ARCHITECT_GUIDE.md` (clarificar identidade)

#### G) Técnico/Troubleshooting (→ `docs/technical/`)
- ⚠️ `NODE_VERSION_FIX.md` → `docs/technical/NODE_VERSION_FIX.md`
- ⚠️ `UPSTREAM_MIGRATION_OPENCLAW.md` → `docs/technical/OPENCLAW_MIGRATION.md`

#### H) Histórico/Legado (→ `docs/history/`)
- ⚠️ `DOCS_BEFORE_AFTER.md` → `docs/history/DOCS_BEFORE_AFTER.md` (marcar como LEGADO)
- ⚠️ `NOTION_INTEGRATION_SUMMARY.md` → `docs/history/NOTION_INTEGRATION_LEGACY.md` (contém paths antigos)

#### I) Segurança (→ `docs/security/`)
- ⚠️ `SECURITY.md` → Verificar se é obrigatório do OpenClaw/Moltbot
  - Se SIM: Manter na raiz (GitHub padrão)
  - Se NÃO: Mover para `docs/security/SECURITY_OVERVIEW.md`
- ⚠️ `SECURITY_AUDIT_30JAN2026.md` → `docs/security/AUDIT_2026-01-30.md`
- 📝 Criar `docs/security/README.md` unificando referências

#### J) Assets (→ `docs/assets/`)
- ⚠️ `README-header.png` → `docs/assets/readme-header.png`
- 📝 Atualizar `README.md` para apontar para novo caminho

---

## 📁 ESTRUTURA FINAL PROPOSTA

```
neobot/
├── README.md (atualizado com links corretos)
├── SECURITY.md (se obrigatório GitHub)
├── docs/
│   ├── PROJECT_IDENTITY_MAP.md ✅ (JÁ EXISTE)
│   ├── REORGANIZATION_PLAN.md (este arquivo)
│   │
│   ├── core/
│   │   ├── ARCHITECTURE_NEO_PROTOCOL.md ✅
│   │   ├── NEOBOT_FEATURES.md (renomeado)
│   │   ├── DECISION_POINT.md (atualizado com fase atual)
│   │   ├── NEXT_STEPS_V2.md (com datas!)
│   │   └── SETUP.md ✅
│   │
│   ├── asi1/
│   │   ├── README.md (novo - explica ASI1 ≠ OpenAI)
│   │   └── SETUP_COMPLETE.md
│   │
│   ├── mio/
│   │   └── IDENTITIES_GENERATED.md
│   │
│   ├── mio-whatsapp/
│   │   ├── BLOCKLIST_FAMILIA.md
│   │   ├── BLOCKLIST_GUIDE.md
│   │   ├── CONTACT_RULES.md
│   │   └── OFERTAS_VENDAS.md
│   │
│   ├── nodes/
│   │   ├── flowoff/
│   │   │   ├── ECOSYSTEM_MAP.md
│   │   │   └── SALES_SETUP.md
│   │   ├── flowcloser/ (futuro)
│   │   └── nexus/ (futuro)
│   │
│   ├── guides/
│   │   └── NEOBOT_ARCHITECT_GUIDE.md
│   │
│   ├── technical/
│   │   ├── NODE_VERSION_FIX.md
│   │   └── OPENCLAW_MIGRATION.md
│   │
│   ├── security/
│   │   ├── README.md (unifica referências)
│   │   ├── SECURITY_OVERVIEW.md
│   │   └── AUDIT_2026-01-30.md
│   │
│   ├── history/
│   │   ├── DOCS_BEFORE_AFTER.md (LEGADO)
│   │   └── NOTION_INTEGRATION_LEGACY.md
│   │
│   └── assets/
│       └── readme-header.png
```

---

## 🔧 CORREÇÕES ESPECÍFICAS

### 1. ASI1 ≠ OpenAI
**Problema:** IAs confundem ASI1 (modelo local) com OpenAI  
**Solução:**
- Criar `docs/asi1/README.md` com aviso claro:
  ```markdown
  # ASI1 - Modelo Local (NÃO OpenAI)
  
  ASI1 é um modelo de IA LOCAL rodando via Ollama.
  NÃO é OpenAI. NÃO usa API externa.
  ```

### 2. Neobot vs FlowCloser vs Neo-Agent-Full
**Problema:** Confusão sobre quem faz atendimento  
**Solução:**
- Atualizar `GUIA_COMPLETO_NEOBOT.md` → `NEOBOT_ARCHITECT_GUIDE.md`
- Adicionar seção clara:
  ```markdown
  ## Identidades do Ecossistema
  
  - **Neobot (este repo):** Dev Tool, Arquitetura, Coding
  - **Neo-Agent-Full:** Atendimento WhatsApp Completo (Web3 + AI)
  - **FlowCloser:** Notificador Simples (Webhook → WhatsApp)
  
  Veja: docs/PROJECT_IDENTITY_MAP.md
  ```

### 3. NEXT_STEPS_V2.md Sem Datas
**Problema:** Roadmap sem timeline  
**Solução:**
- Adicionar datas estimadas
- Marcar fase atual (Fase 2? Fase 3?)
- Adicionar checkboxes de progresso

### 4. README-header.png
**Problema:** Não sabemos se é usado  
**Solução:**
- Verificar se `README.md` usa a imagem
- Se SIM: Mover para `docs/assets/` e atualizar path
- Se NÃO: Arquivar em `docs/assets/_unused/`

### 5. SECURITY.md Duplicado
**Problema:** Dois docs de segurança  
**Solução:**
- Verificar se `SECURITY.md` é obrigatório do GitHub (padrão)
- Se SIM: Manter na raiz, mover audit para `docs/security/`
- Se NÃO: Unificar em `docs/security/`

---

## ✅ CHECKLIST DE EXECUÇÃO

### Fase 1: Backup
- [ ] Criar branch `docs-reorganization`
- [ ] Commit atual como checkpoint

### Fase 2: Mover Arquivos
- [ ] Criar estrutura de pastas
- [ ] Mover arquivos conforme plano
- [ ] Atualizar links internos

### Fase 3: Atualizar Conteúdo
- [ ] Criar `docs/asi1/README.md`
- [ ] Renomear `FEATURES.md` → `NEOBOT_FEATURES.md`
- [ ] Atualizar `DECISION_POINT_30JAN2026.md` com fase atual
- [ ] Adicionar datas em `NEXT_STEPS_V2.md`
- [ ] Unificar segurança em `docs/security/README.md`

### Fase 4: Validação
- [ ] Verificar todos os links internos
- [ ] Atualizar `README.md` principal
- [ ] Testar navegação da documentação

### Fase 5: Commit & Push
- [ ] Commit com mensagem clara
- [ ] Push para `docs-reorganization`
- [ ] Merge para `main` após revisão

---

## 🚨 REGRAS IMPORTANTES

1. **NÃO deletar nada** - Apenas mover e renomear
2. **Manter histórico Git** - Usar `git mv` para preservar history
3. **Atualizar links** - Buscar e substituir paths antigos
4. **Marcar LEGADO** - Arquivos antigos devem ter aviso no topo

---

**Status:** Plano Criado  
**Próximo:** Executar Fase 1 (Backup)
