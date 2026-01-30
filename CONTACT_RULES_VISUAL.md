# 📱 Regras de Contatos - Guia Visual Rápido

```text
╔══════════════════════════════════════════════════════════════╗
║                    NEØ FlowCloser v1.1                       ║
║              Sistema de Contatos Inteligente                 ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 👨‍👩‍👧 FAMÍLIA (Apenas Saudação)

```text
┌─────────────────────────────────────┐
│  +5562985739994  Melissa (filha)   │
│  +5562995576493  Vó Maria          │
│  +5562998128179  Méllany (filha)   │
└─────────────────────────────────────┘

BOT: "Oi! 👋"
```

---

## 🎸 PAI (Rock & Roll)

```text
┌─────────────────────────────────────┐
│  +5562999868438  Pai (Rock)        │
└─────────────────────────────────────┘

BOT: "Oi pai! 🎸 Avisei o Netto que você chamou.
      Ele já responde! 🤘"

TELEGRAM: "🎸 Seu pai te chamou no WhatsApp!"
```

---

## 💕 JULIA (Esposa - Timeout)

```text
┌─────────────────────────────────────┐
│  +5562992668717  Julia (esposa)    │
└─────────────────────────────────────┘

AGUARDA: 2-5 minutos

SE TIMEOUT:
BOT: "Oi Julia! 💕 O Netto está ocupado.
      Posso anotar um recado?"

TELEGRAM: "💕 Julia te chamou: [recado]"
```

---

## 🔧 RODOLPHO (Cliente GLT)

```text
┌─────────────────────────────────────┐
│  +5548991638753  Rodolpho (GLT)    │
│  Projeto: SaaS                      │
│  Entrega: Amanhã (front-end)       │
└─────────────────────────────────────┘

BOT: "Oi Rodolpho! Sou o assistente do Netto.
      Ele está finalizando o preview do seu SaaS.
      Posso anotar algo urgente?"

TELEGRAM: "🔧 Rodolpho (GLT) te chamou: [msg]"
```

---

## 🎨 BRUNO (Cliente PUNK)

```text
┌─────────────────────────────────────┐
│  +5562981912169  Bruno Sizo        │
│  Projeto: Site PUNK | BLVCK        │
│  Local: Eldorado, Goiânia          │
│  Entrega: Hoje (preview)           │
└─────────────────────────────────────┘

BOT: "Oi Bruno! Sou o assistente do Netto.
      Ele está finalizando o preview do site
      PUNK | BLVCK. Posso anotar algo?"

TELEGRAM: "🎨 Bruno Sizo (PUNK) te chamou: [msg]"
```

---

## 💰 OUTROS (FlowCloser Vendas)

```text
┌─────────────────────────────────────┐
│  Qualquer outro número              │
└─────────────────────────────────────┘

BOT: "Oi! 👋 Sou o assistente da NEØ FlowOFF.
      Como posso ajudar sua empresa a escalar
      com tráfego pago?"

ATIVA: FlowCloser v1.1 Blindado
       - Qualificação
       - Pitch
       - CRM Tags
```

---

## 🎯 FLUXO DE DECISÃO

```text
MENSAGEM RECEBIDA
        ↓
   [Verificar número]
        ↓
   ┌────┴────┬────────┬────────┬─────────┬────────┐
   │         │        │        │         │        │
FAMÍLIA    PAI    JULIA   RODOLPHO  BRUNO  OUTROS
   │         │        │        │         │        │
"Oi!👋"  🎸+TG  Timeout  🔧+TG    🎨+TG   VENDAS
```

---

## 📊 EXEMPLOS PRÁTICOS

### Teste 1: Melissa te chama
```
IN:  "Oi pai!"
OUT: "Oi! 👋"
```

### Teste 2: Pai te chama
```
IN:  "E aí filho, tudo bem?"
OUT: "Oi pai! 🎸 Avisei o Netto que você chamou.
      Ele já responde! 🤘"
TG:  "🎸 Seu pai te chamou no WhatsApp!"
```

### Teste 3: Julia te chama (sem resposta)
```
T+0min: "Oi amor, onde você está?"
T+3min: [timeout ativa]
OUT:    "Oi Julia! 💕 O Netto está ocupado.
         Posso anotar um recado?"
Julia:  "Diz pra ele ligar"
TG:     "💕 Julia te chamou: Diz pra ele ligar"
```

### Teste 4: Rodolpho (cliente)
```
IN:  "Preview ficou pronto?"
OUT: "Oi Rodolpho! Sou o assistente do Netto.
      Ele está finalizando o preview do seu SaaS.
      Posso anotar algo urgente?"
TG:  "🔧 Rodolpho (GLT) te chamou: Preview ficou pronto?"
```

### Teste 5: Lead novo (tráfego)
```
IN:  "Vi seu anúncio sobre tráfego pago"
OUT: "Oi! 👋 Sou o assistente da NEØ FlowOFF.
      Como posso ajudar sua empresa a escalar
      com tráfego pago?"
[FlowCloser v1.1 ativa]
```

---

## ✅ STATUS ATUAL

```text
[✓] AGENTS_FLOWOFF_SALES.md → Regras no topo
[✓] BLOCKLIST_FAMILIA.md     → Lista atualizada
[✓] CONTACT_RULES_SUMMARY.md → Documentação completa
[✓] Gateway reiniciado       → Regras ativas
[✓] Git pushed               → Backup seguro
```

---

## 🚀 PRONTO PARA TESTAR!

**Pode receber WhatsApp de qualquer pessoa agora!**

O bot vai:
1. ✅ Identificar quem está chamando
2. ✅ Aplicar regra correta automaticamente
3. ✅ Notificar você no Telegram (se necessário)
4. ✅ Manter histórico completo

---

**Sistema 100% operacional! 🎉**
