<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
  NEOBOT WHATSAPP GATEWAY STATUS
========================================
```

**Data:** 2026-01-31  
**Status:** 🟢 OPERACIONAL

────────────────────────────────────────

## Gateway Core

```text
▓▓▓ SERVIÇO
────────────────────────────────────────
[####] Gateway running ............ OK
[####] WhatsApp provider .......... OK
[####] Telegram provider .......... OK
[####] Browser control ............ OK
[####] Canvas service ............. OK
[####] Heartbeat .................. OK
```

────────────────────────────────────────

## Configuração Atual

```text
▓▓▓ RUNTIME
────────────────────────────────────────
└─ PID: 32991 (moltbot-gateway)
└─ Port: 18789
└─ Model: anthropic/claude-opus-4-5
└─ Log: ~/.local/state/moltbot/
```

```text
▓▓▓ CANAIS ATIVOS
────────────────────────────────────────
└─ WhatsApp: +556283231110
   └─ Status: Listening
   └─ Modo: Personal messages
   
└─ Telegram: @FlowOFFPayBot
   └─ Status: Started
   └─ autoSelectFamily: false
```

────────────────────────────────────────

## Problema Detectado

```text
▓▓▓ ISSUE: PROMPT NÃO CARREGADO
────────────────────────────────────────
[#---] System prompt ............. WARN
[####] Gateway operacional ........ OK
[####] Canais conectados .......... OK
```

**Sintoma:**
Bot responde em inglês e não
reconhece regras de contato
do AGENTS_FLOWOFF_SALES.md

**Causa:**
Moltbot CLI não está carregando
arquivo de prompt customizado

**Impacto:**
- Pai (+5562999868438) recebe
  resposta genérica em inglês
- Deveria receber:
  "Oi pai! 🎸 Avisei o Netto
   que você chamou. Ele já
   responde! 🤘"

────────────────────────────────────────

## Arquivos de Prompt

```text
▓▓▓ LOCALIZAÇÕES
────────────────────────────────────────
└─ Source (original):
   AGENTS_FLOWOFF_SALES.md
   
└─ Tentativa 1:
   .clawd/agents/default.md
   
└─ Tentativa 2:
   prompts/default.md → symlink
   
└─ Status: Nenhum carregado ✗
```

────────────────────────────────────────

## Próximos Passos

```text
▓▓▓ ROADMAP
────────────────────────────────────────
└─ [ ] Investigar API do gateway
       para injeção de prompt
       
└─ [ ] Criar middleware NEØ para
       interceptar e adicionar
       regras de contato
       
└─ [ ] Implementar prompt loader
       nativo no NEØ Layer
       
└─ [ ] Testar com mensagem real
       do pai
```

────────────────────────────────────────

## Reconhecimento

Fundação sólida construída por
**Peter Steinberger** com Moltbot.

Gateway, canais, runtime de agente,
segurança - tudo funcionando
perfeitamente.

NEØ Protocol está expandindo essa
base com camada Web3, identidade
descentralizada, e controle total.

> "Moltbot nos deu o motor.
>  NEØ está quebrando os limites."

Continuamos evoluindo de forma
independente, implementando cada
vez mais features.

────────────────────────────────────────

## Comandos Úteis

**Reiniciar gateway:**
```bash
ps aux | grep moltbot-gateway \
  | grep -v grep | awk '{print $2}' \
  | xargs kill

cd /Users/nettomello/CODIGOS/neobot
nohup pnpm moltbot gateway \
  --port 18789 > \
  ~/.local/state/moltbot/logs/gateway.log \
  2>&1 &
```

**Ver logs:**
```bash
tail -f ~/.local/state/moltbot/logs/gateway.log
```

**Status:**
```bash
ps aux | grep moltbot | grep -v grep
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
