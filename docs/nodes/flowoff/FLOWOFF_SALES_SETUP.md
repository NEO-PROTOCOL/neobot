# 🚀 FlowOFF Sales Bot - Setup Completo

```text
╔════════════════════════════════════════╗
║  NEØ FLOWCLOSER → MÁQUINA DE VENDAS    ║
║  LLM qualifica + fecha vendas          ║
╚════════════════════════════════════════╝
```

---

## ✅ O QUE FOI CONFIGURADO

### 1. WhatsApp Modo OPEN

**Antes:** `dmPolicy: "pairing"` (bloqueava todos)  
**Agora:** `dmPolicy: "open"` (aceita todos!)

**Arquivo:** `~/.clawdbot/moltbot.json`

```json
"channels": {
  "whatsapp": {
    "dmPolicy": "open",  ← MUDOU AQUI
    "allowFrom": ["+5562983231110"],
    "groupPolicy": "allowlist"
  }
}
```

**Resultado:** Qualquer pessoa pode te chamar no WhatsApp e será atendida pelo LLM automaticamente.

---

### 2. System Prompt de Vendas (v1.1 Blindado)

**Criado:** `AGENTS_FLOWOFF_SALES.md`

**Contém:**

- ✅ Sistema de 2 camadas (Oferta Pública vs Real)
- ✅ 4 produtos FlowOFF (START, SALES, SYSTEMS, LEDGER)
- ✅ Roteiro operacional em 5 etapas
- ✅ Gatilhos para enviar pitch do Canva
- ✅ Scripts prontos de resposta
- ✅ Tom consultivo e premium
- ✅ FAQ oficial com respostas padronizadas
- ✅ Sistema de tags CRM avançado
- ✅ Sequência obrigatória pós-link
- ✅ Fechamento temporal ('hoje ou amanhã?')
- ✅ Anti-spam/rate limit (1 link por lead)

---

## 🎯 Como Funciona (Fluxo Completo)

```text
Lead manda "oi" no WhatsApp
        ↓
LLM responde e qualifica
(nome, empresa, dor, prazo)
        ↓
Detecta gatilho
(pediu portfólio/valor)
        ↓
Envia pitch do Canva
com pergunta estratégica
        ↓
Lead responde qual produto
        ↓
LLM coleta:
- Prazo desejado
- Faixa de investimento
        ↓
OPÇÃO A: Fecha venda direto
OPÇÃO B: Escalona pro NODE NEØ
```

---

## 📦 Produtos & Ofertas (2 Camadas)

### CAMADA 1: Oferta Pública (Pitch Canva)

**Para:** Leads frios, curiosos, quem quer "site"

- **Start:** R$ 1.500 (site simples)
- **Profissional:** R$ 2.500 (site intermediário)
- **Premium:** R$ 4.000 (site completo)

### CAMADA 2: Oferta Real (Sistema FlowOFF)

**Para:** Quem roda tráfego, precisa automação/CRM/sistemas

**1) FlowOFF START (MVP)**

- Landing + WhatsApp OS + Tracking
- Prazo: 7-10 dias
- Faixa: R$ 2k-5k

**2) FlowOFF SALES (Money Maker)**

- CRM + Automação + Pipeline
- Prazo: 10-15 dias
- Faixa: R$ 5k-12k

**3) FlowOFF SYSTEMS (Core)**
- WebApp / Sistema interno completo
- Prazo: 15-30 dias
- Faixa: R$ 12k-30k

**4) FlowOFF LEDGER (Diferencial)**
- Estado auditável / Plataforma
- Prazo: 30-60 dias
- Faixa: R$ 30k+

**REGRA CRÍTICA:** Se lead perguntar "quanto custa site?", usar oferta pública. Se pedir "automação/CRM/sistema", usar oferta real.

---

## 💬 Quando Enviar Pitch do Canva

O LLM envia o link APENAS quando detectar:

**✅ Pedido direto:**
- "Tem portfólio?"
- "Me manda valores"
- "Como funciona?"

**✅ Intenção clara:**
- Falou prazo
- Falou orçamento  
- Falou dor ("não converto", "site velho")

**✅ Desconfiança:**
- "Quem são vocês?"
- "Tem exemplos?"

**✅ Conversa em loop:**
- 2+ mensagens sem avanço

**❌ NÃO envia se:**
- Primeiro "oi"
- Sem nome + objetivo + prazo

---

## 🔗 Link do Pitch

```
https://www.canva.com/design/DAG4sWWGiv8/1nwHM_YaS4YSzlXP-OlS9Q/view?utm_content=DAG4sWWGiv8&utm_campaign=designshare&utm_medium=link2&utm_source=uniquelinks&utlId=he9bddfa69c
```

**Conteúdo (7 páginas):**
1. Capa
2. Dor ("Sua empresa não aparece online?")
3. Processo (briefing → design → dev → lançamento)
4. FAQ (prazos, hospedagem, suporte)
5. Pacotes Start/Profissional/Premium + valores
6. Garantias
7. CTA (contato + neoflowoff.agency)

---

## 📝 Scripts Prontos (LLM usa automaticamente)

### Script 1: Portfolio
```
Perfeito. Vou te mandar um pitch rápido pra você entender como funciona nossa entrega (processo + opções).

[LINK CANVA]

Me diz: seu objetivo é aparecer no Google e passar credibilidade ou converter tráfego em leads?
```

### Script 2: Preço
```
Ótima pergunta. O valor depende do escopo, então pra evitar chute eu vou te mandar as opções com faixa de investimento e o processo.

[LINK CANVA]

Agora me diga: você quer Start (rápido), Profissional, ou já pensa em WebApp/Sistema?
```

### Script 3: Fechamento
```
Você conseguiu abrir o material?
Qual opção parece mais perto do que você quer: Start, Profissional, ou Premium/WebApp?

[Lead responde]

Perfeito. Pra te passar o valor final certinho: qual prazo ideal e qual faixa de investimento você quer manter?
```

---

## 🏷️ Sistema de Tags (CRM Avançado)

O LLM registra automaticamente:

**PRODUTO_PUBLICO:**
- `START_SITE` / `PROFISSIONAL_SITE` / `PREMIUM_SITE`

**PRODUTO_REAL:**
- `START` / `SALES` / `SYSTEMS` / `LEDGER`

**PRAZO:**
- `URGENTE(7d)` / `MEDIO(15d)` / `LONGO(30d+)`

**BUDGET:**
- `LOW(<2k)` / `MID(2-5k)` / `HIGH(5-15k)` / `ULTRA(15k+)`

**STATUS:**
- `NOVO` / `QUALIFICANDO` / `PROPOSTA` / `AGENDADO` / `FECHADO` / `PERDIDO`

**DOR:**
- `VISIBILIDADE` / `CONVERSAO` / `ESCALA` / `OPERACAO` / `PLATAFORMA`

---

## 🚀 Próximos Passos (Setup Final)

### 1. Reiniciar Gateway

Para aplicar a mudança de `dmPolicy`:

```bash
# Parar gateway atual (se rodando)
pkill -f "moltbot gateway"

# Carregar secrets
export BW_SESSION="sua-session-key"
source scripts/load-secrets-bitwarden.sh

# Iniciar gateway com novo config
CLAWDBOT_GATEWAY_TOKEN=neobot pnpm moltbot gateway --port 18789
```

### 2. Testar com Número Real

Peça alguém (ou use outro número seu) para mandar:

```
"Oi, quero um site"
```

**Esperado:**
- ✅ LLM responde (não bloqueia)
- ✅ Qualifica o lead
- ✅ Envia pitch no momento certo

### 3. Monitorar Conversas

```bash
# Ver logs do gateway
tail -f ~/.clawdbot/logs/gateway.log

# Ou usar TUI
pnpm moltbot tui
```

---

## 🔧 Ajustes Finos (Quando Rodar)

### Se LLM for muito "vendedor":
→ Editar `AGENTS_FLOWOFF_SALES.md` e suavizar tom

### Se não qualificar bem:
→ Adicionar mais perguntas no system prompt

### Se enviar pitch cedo demais:
→ Aumentar requisitos dos gatilhos

### Se leads escap

am:
→ Adicionar follow-up automático em 24h

---

## 💰 Meta de Conversão

**Objetivo (primeiros 30 dias):**
- 100 leads entrarem
- 40 pitch enviados (40%)
- 15 orçamentos solicitados (15%)
- 5 vendas fechadas (5%)

**Revenue esperado:**
- 5 vendas × R$ 3.000 (média) = **R$ 15.000**

---

## 🎭 Tom de Voz (Lembre o LLM)

**✅ USE:**
- "Sistema de conversão"
- "Infraestrutura de growth"
- "Pipeline automatizado"
- "Operação escalável"

**❌ EVITE:**
- "Site lindo"
- "Design maravilhoso"
- "Experiência única"

**Posicionamento:** Growth engineering, não agência de design.

---

## 📊 Métricas para Acompanhar

```text
┌─────────────────────────────────────┐
│  KPIs de Vendas                     │
├─────────────────────────────────────┤
│ • Leads recebidos / dia             │
│ • Taxa de resposta (%)              │
│ • Pitch enviado (%)                 │
│ • Orçamento solicitado (%)          │
│ • Venda fechada (%)                 │
│ • Ticket médio (R$)                 │
│ • CAC (custo de aquisição)          │
│ • LTV / CAC ratio                   │
└─────────────────────────────────────┘
```

---

## 🆘 Troubleshooting

### Problema: Leads ainda recebem pairing

**Causa:** Gateway não reiniciou com novo config  
**Solução:** Restart gateway (passo 1 acima)

### Problema: LLM não qualifica bem

**Causa:** System prompt genérico  
**Solução:** Apontar para `AGENTS_FLOWOFF_SALES.md`

### Problema: Muito spam

**Causa:** `dmPolicy: "open"` aceita todos  
**Solução:** Adicionar filtro de primeira mensagem (antipam)

---

## ✅ Checklist Final

```text
[ ] dmPolicy mudado para "open"
[ ] AGENTS_FLOWOFF_SALES.md criado
[ ] Gateway reiniciado
[ ] Testado com número real
[ ] LLM respondendo e qualificando
[ ] Pitch sendo enviado corretamente
[ ] Tags sendo registradas
[ ] Métricas sendo coletadas
[ ] Tráfego pago pode começar! 🚀
```

---

## 🎯 Quando Começar Tráfego Pago

**Só comece quando:**
1. ✅ Testar com 5+ leads manuais
2. ✅ Confirmar que LLM qualifica bem
3. ✅ Confirmar que pitch é enviado no momento certo
4. ✅ Ter pelo menos 1 venda fechada manualmente

**Depois:**
- Começar com R$ 50/dia
- Monitorar de perto primeiros 7 dias
- Ajustar script conforme feedback
- Escalar para R$ 200/dia quando estabilizar

---

## 🚀 PRONTO PARA RODAR!

```text
╔════════════════════════════════════════╗
║  SISTEMA CONFIGURADO                   ║
║  FALTA: Reiniciar gateway + testar     ║
║  DEPOIS: Tráfego pago pode começar     ║
╚════════════════════════════════════════╝
```

**Agora é só:**
1. Restart gateway
2. Testar com lead real
3. Ajustar se necessário
4. LIGAR TRÁFEGO PAGO 💰

---

▓▓▓ NΞØ MELLØ  
Core Architect · NEØ Protocol  
neoflowoff.agency

"Tráfego → Sistema → Receita. Sem estética. Só resultado."
