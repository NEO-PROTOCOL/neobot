# ⚖️ AUDIT: evolution-api vs FlowCloser

**Data:** 29 Janeiro 2026  
**Node Arquiteto:** Mellø

---

## 📊 Comparativo Técnico

| Aspecto | evolution-api | FlowCloser (Railway) |
|---------|---------------|----------------------|
| **Versão** | v2.3.7 | Unknown |
| **Stack** | TS, Express, Baileys, Prisma | Unknown (Evolution-based?) |
| **Arquivos** | 105 arquivos (86 TS) | Unknown |
| **Foco** | WhatsApp API REST completa | External Services Bridge |
| **Integrações** | Chatwoot, Typebot, N8N, OpenAI, Dify, EvoAI, Flowise | Unknown |
| **Deploy** | Local (precisa deploy) | Railway (ATIVO) |
| **Status** | 🟢 Completo (GitHub oficial) | 🟢 Produção |
| **Repo** | https://github.com/EvolutionAPI/evolution-api | Unknown |

---

## 🔍 Análise evolution-api

### Stack Completo

- **Core:** Baileys 7.0.0-rc.9 (WhatsApp multi-device)
- **Framework:** Express 4.21.2 + TypeScript 5.7.2
- **Database:** Prisma 7.2.0 (Postgres/Redis)
- **Cache:** Redis 4.7.0 + node-cache
- **Auth:** JWT + guards
- **Validation:** class-validator + jsonschema
- **Monitoring:** Sentry 10.12.0
- **WebSocket:** socket.io 4.8.1
- **Storage:** Redis/Prisma/Files
- **Media:** ffmpeg, sharp, jimp
- **Proxy:** SOCKS + HTTPS proxy agent

### Funcionalidades

✅ WhatsApp multi-device (QR Code + pairing)  
✅ REST API completa (send/receive messages)  
✅ Webhook handler  
✅ Redis cache  
✅ Prisma database  
✅ Multiple instances  
✅ Chatbot integrations (8 plataformas)  
✅ Template manager  
✅ Settings manager  
✅ Proxy support  
✅ Group management  
✅ Label management  
✅ Business profile  
✅ Socket.IO events  
✅ Swagger docs  
✅ Manager UI (dist/index.html)  

### Integrações Chatbot

1. **Chatwoot** ✅
2. **Typebot** ✅
3. **N8N** ✅
4. **OpenAI** ✅
5. **Dify** ✅
6. **EvoAI** ✅
7. **Flowise** ✅
8. **EvolutionBot** ✅

### Estrutura src/

```
src/
├── api/
│   ├── controllers/ (instance, sendMessage, chat, group, label)
│   ├── services/ (auth, monitor, cache, channel, proxy, settings, template)
│   ├── guards/ (auth, instance)
│   ├── routes/ (9 routers)
│   ├── integrations/
│   │   ├── chatbot/ (8 platforms)
│   │   ├── channel/ (whatsapp Baileys + Meta Business)
│   │   └── event/ (webhooks)
│   ├── repository/
│   └── provider/
├── cache/ (Redis + Local)
├── config/ (env, logger, event)
├── utils/ (15+ helpers)
├── validate/ (8 schemas)
└── main.ts
```

---

## 🎯 FlowCloser (Railway)

### Conhecimento Atual

- **URL:** flowcloser-agent-production.up.railway.app
- **Deploy:** Railway (Ativo)
- **ID Projeto:** 95ed3bcd-2e20-4477-b50c-43cd9ec04c41
- **Service:** 78c16321-326e-4f02-a808-65da3344a989
- **Environment:** 6f1a6dd0-9760-4ad8-9cb3-f690d2575408
- **Função:** External Services Bridge (não WhatsApp direto)

### Incertezas

- ❓ Codebase (local não encontrado)
- ❓ Stack exata
- ❓ Funcionalidades específicas
- ❓ Se usa Evolution API como base
- ❓ Integrações implementadas

---

## 💡 Recomendações

### Cenário 1: FlowCloser é Evolution API customizado
**Ação:** Manter separados
- evolution-api local para desenvolvimento/testes
- FlowCloser Railway para external services produção
- Neobot Baileys para WhatsApp nativo integrado

### Cenário 2: FlowCloser é outro projeto
**Ação:** Avaliar migração
- Se FlowCloser não usa Baileys → Migrar para evolution-api
- Se FlowCloser tem funcionalidades únicas → Manter ambos
- Documentar diferenças

### Cenário 3: Redundância total
**Ação:** Consolidar
- Escolher 1 como fonte única (evolution-api recomendado)
- Migrar configurações do FlowCloser
- Desativar duplicidade

---

## 🚀 Integração com Neobot

### Opção A: Usar evolution-api Local
**Vantagens:**
- Controle total do código
- Todas as 8 integrações chatbot
- Prisma database
- Swagger docs
- Manager UI

**Desvantagens:**
- Precisa deploy próprio
- Manutenção

**Ação:**
1. Deploy evolution-api em Railway/Fly.io
2. Conectar Neobot skills
3. Usar como WhatsApp service externo

### Opção B: Usar Baileys Direto (Atual Neobot)
**Vantagens:**
- Neobot já tem Baileys integrado
- Zero dependência externa
- Controle total

**Desvantagens:**
- Sem UI manager
- Menos integrações prontas

**Ação:**
1. Expandir `src/channels/whatsapp.ts` do Neobot
2. Adicionar features de evolution-api (webhook, cache, etc)
3. Manter tudo no Neobot

### Opção C: Híbrido (RECOMENDADO)
**Stack:**
- **Neobot Baileys:** WhatsApp nativo (personal use)
- **evolution-api:** Múltiplas instâncias (scaling)
- **FlowCloser Railway:** External services bridge

**Separação:**
- Neobot: +5562983231110 (seu número pessoal)
- evolution-api: Instâncias de clientes/serviços
- FlowCloser: Conectores externos (se necessário)

---

## 📋 Decisão Estratégica

### ✅ APROVAR: Manter Ambos (Híbrido)

**Configuração Final:**
```
NEØ Protocol WhatsApp Stack:
├── Neobot (Baileys nativo)
│   └── +5562983231110 (Mellø pessoal)
├── evolution-api (local/deploy)
│   └── Multi-instances (clientes)
└── FlowCloser (Railway)
    └── External services (se diferente)
```

**Roadmap:**
1. ✅ Ativar Neobot WhatsApp (+5562983231110)
2. ⏳ Auditar FlowCloser (entender stack)
3. ⏳ Decidir: consolidar ou separar
4. ⏳ Deploy evolution-api se necessário

---

## 🔴 Ação Imediata

**Próxima tarefa:** Auditar FlowCloser Railway
- Acessar Railway logs
- Identificar stack
- Mapear funcionalidades
- Comparar com evolution-api
- Decidir redundância

---

**Status:** ✅ Análise evolution-api completa  
**Pendente:** 🟡 Auditoria FlowCloser Railway

---
