# 🤖 NeoBot - Guia Completo de Execução

**Última atualização:** 29/01/2026 02:51  
**Versão:** 2026.1.26

---

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Canais de Comunicação](#-canais-de-comunicação)
   - [WhatsApp (Baileys)](#-whatsapp-baileys)
   - [Telegram (grammY)](#-telegram-grammy)
   - [iMessage](#-imessage)
3. [Agente Autônomo Pi](#-agente-autônomo-pi)
4. [Apps Nativos](#-apps-nativos)
5. [Configuração Completa](#-configuração-completa)
6. [Casos de Uso Práticos](#-casos-de-uso-práticos)

---

## 🎯 Visão Geral

O **NeoBot** (fork do Moltbot/Clawdbot) é uma plataforma industrial de automação multi-canal com capacidades de:

### Arquitetura Central

```
┌─────────────────────────────────────────────────────────────┐
│                      NEOBOT GATEWAY                         │
│                  ws://127.0.0.1:18789                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────┐ │
│  │   Channels   │◄────►│  Pi Agent    │◄────►│  Tools   │ │
│  │              │      │   (RPC)      │      │          │ │
│  │ • WhatsApp   │      │              │      │ • Browser│ │
│  │ • Telegram   │      │ • Anthropic  │      │ • Canvas │ │
│  │ • iMessage   │      │ • OpenAI     │      │ • Nodes  │ │
│  │ • Slack      │      │ • Bedrock    │      │ • Cron   │ │
│  │ • Discord    │      │              │      │          │ │
│  └──────────────┘      └──────────────┘      └──────────┘ │
│                                                             │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────┐ │
│  │  Sessions    │      │   Sandbox    │      │  Skills  │ │
│  │              │      │              │      │          │ │
│  │ • Isolation  │      │ • Docker     │      │ • Bundled│ │
│  │ • Routing    │      │ • Security   │      │ • Custom │ │
│  └──────────────┘      └──────────────┘      └──────────┘ │
└─────────────────────────────────────────────────────────────┘
```

---

## 📱 Canais de Comunicação

### 🟢 WhatsApp (Baileys)

O NeoBot usa a biblioteca **Baileys** para conectar-se ao WhatsApp via protocolo WebSocket nativo.

#### Como Funciona

```typescript
// Localização: src/whatsapp/
// Arquivos principais:
// - normalize.ts: Normalização de números de telefone
// - normalize.test.ts: Testes de normalização
```

#### Configuração

**1. Arquivo `.env`:**
```bash
# WhatsApp não precisa de token - usa QR Code
WHATSAPP_ENABLED=true
```

**2. Arquivo `~/.neobot/neobot.json`:**
```json
{
  "channels": {
    "whatsapp": {
      "enabled": true,
      "allowFrom": [
        "+5511999999999",  // Números específicos
        "@domain.com"      // Domínios permitidos
      ],
      "groups": {
        "*": {
          "requireMention": true  // Requer @menção em grupos
        }
      }
    }
  }
}
```

#### Iniciar WhatsApp

```bash
# 1. Fazer login (primeira vez)
pnpm neobot channels login

# Isso irá:
# - Gerar um QR Code no terminal
# - Você escaneia com WhatsApp > Dispositivos Conectados
# - Credenciais salvas em ~/.neobot/credentials/
```

#### Estrutura de Credenciais

```
~/.neobot/credentials/
└── whatsapp/
    ├── creds.json          # Credenciais de autenticação
    ├── session-data/       # Dados da sessão
    └── auth-info/          # Informações de auth
```

#### Recursos Disponíveis

✅ **Mensagens de Texto**
- Envio e recebimento
- Formatação markdown
- Emojis

✅ **Mídia**
- Imagens (PNG, JPG, WebP)
- Vídeos (MP4)
- Áudio (OGG, MP3)
- Documentos (PDF, DOCX, etc.)

✅ **Grupos**
- Detecção automática
- Filtro por menção
- Permissões por grupo

✅ **Recursos Avançados**
- Reações (❤️, 👍, etc.)
- Status de leitura
- Indicador de digitação
- Localização

#### Segurança

```json
{
  "channels": {
    "whatsapp": {
      "dmPolicy": "pairing",  // Requer aprovação para novos contatos
      "allowFrom": ["*"],     // Ou lista específica
      "groups": {
        "120363XXXXX@g.us": {  // ID específico do grupo
          "requireMention": true,
          "allowFrom": ["admin@example.com"]
        }
      }
    }
  }
}
```

#### Comandos Úteis

```bash
# Verificar status da conexão
pnpm neobot channels status whatsapp

# Desconectar
pnpm neobot channels logout whatsapp

# Reconectar
pnpm neobot channels login whatsapp
```

---

### 🔵 Telegram (grammY)

O NeoBot usa **grammY** (framework moderno para Telegram Bot API) com suporte a:
- Long polling
- Webhooks
- Throttling automático
- Inline keyboards
- Comandos nativos

#### Como Funciona

```typescript
// Localização: src/telegram/
// Arquivos principais:
// - bot.ts: Criação e configuração do bot
// - bot-handlers.ts: Handlers de mensagens (25KB+)
// - bot-message-context.ts: Contexto de mensagens (24KB+)
// - send.ts: Envio de mensagens (26KB+)
// - webhook.ts: Suporte a webhooks
```

#### Configuração

**1. Criar Bot no Telegram:**
```bash
# 1. Abra o Telegram e procure por @BotFather
# 2. Envie /newbot
# 3. Escolha um nome: "Meu NeoBot"
# 4. Escolha um username: "meu_neobot" (deve terminar em "bot")
# 5. Copie o token: 123456789:ABCdefGHIjklMNOpqrsTUVwxyz
```

**2. Arquivo `.env`:**
```bash
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=[CHAT_ID]  # Seu chat ID pessoal
```

**3. Arquivo `~/.neobot/neobot.json`:**
```json
{
  "channels": {
    "telegram": {
      "enabled": true,
      "botToken": "${TELEGRAM_BOT_TOKEN}",  // Ou direto aqui
      "allowFrom": [
        "[CHAT_ID]",        // Chat IDs numéricos
        "@username",         // Usernames com @
        "tg:username"        // Formato alternativo
      ],
      "groups": {
        "*": {
          "requireMention": true
        },
        "-1001234567890": {  // ID específico do grupo
          "requireMention": false,
          "allowFrom": ["@admin"]
        }
      },
      "webhookUrl": null,    // Ou "https://seu-dominio.com/webhook"
      "commands": {
        "native": true,      // Comandos /status, /new, etc.
        "text": true         // Comandos de texto
      }
    }
  }
}
```

#### Descobrir seu Chat ID

```bash
# Método 1: Script dedicado
pnpm tsx skills/telegram/scripts/get-chat-id.ts

# Isso irá:
# 1. Iniciar um listener
# 2. Pedir para você enviar /start para o bot
# 3. Mostrar seu Chat ID

# Método 2: Via API
curl https://api.telegram.org/bot<SEU_TOKEN>/getUpdates
```

#### Recursos Disponíveis

✅ **Mensagens**
- Texto com Markdown/HTML
- Formatação rica
- Inline keyboards
- Reply keyboards

✅ **Mídia**
- Fotos (até 10MB)
- Vídeos (até 50MB)
- Documentos (até 2GB)
- Áudio/Voice
- Stickers

✅ **Grupos e Canais**
- Grupos públicos/privados
- Supergrupos
- Canais (broadcast)
- Topics/Threads

✅ **Recursos Avançados**
- Inline queries
- Callback queries (botões)
- Edição de mensagens
- Reações
- Polls

#### Comandos Nativos

O NeoBot implementa comandos nativos do Telegram:

```typescript
// Comandos disponíveis:
/status    // Status da sessão (modelo, tokens, custo)
/new       // Reset da sessão
/reset     // Alias para /new
/compact   // Compactar contexto (summary)
/think     // Ajustar nível de pensamento (off|low|medium|high)
/verbose   // Ativar/desativar modo verbose
/usage     // Mostrar uso de tokens (off|tokens|full)
/restart   // Reiniciar gateway (owner apenas)
/activation // Modo de ativação em grupos (mention|always)
```

#### Throttling e Rate Limits

```typescript
// O NeoBot usa @grammyjs/transformer-throttler
// Limites automáticos:
// - 30 mensagens/segundo (global)
// - 1 mensagem/segundo (por chat)
// - Retry automático com backoff
```

#### Webhooks vs Long Polling

**Long Polling (Padrão):**
```json
{
  "channels": {
    "telegram": {
      "webhookUrl": null  // Long polling ativo
    }
  }
}
```

**Webhooks (Produção):**
```json
{
  "channels": {
    "telegram": {
      "webhookUrl": "https://seu-dominio.com/telegram/webhook"
    }
  }
}
```

#### Inline Buttons

```typescript
// O NeoBot suporta inline keyboards automaticamente
// Exemplo de resposta com botões:
{
  "text": "Escolha uma opção:",
  "inlineKeyboard": [
    [{ "text": "Opção 1", "callback_data": "opt1" }],
    [{ "text": "Opção 2", "callback_data": "opt2" }]
  ]
}
```

---

### 💬 iMessage

O NeoBot integra-se ao iMessage via **macOS Messages.app** usando AppleScript.

#### Como Funciona

```typescript
// Localização: src/imessage/
// Arquivos principais:
// - client.ts: Cliente iMessage (6KB)
// - monitor.ts: Monitoramento de mensagens
// - send.ts: Envio de mensagens (4.5KB)
// - targets.ts: Resolução de destinatários (6.7KB)
// - probe.ts: Verificação de disponibilidade
```

#### Requisitos

⚠️ **IMPORTANTE:**
- **Apenas macOS** (Messages.app)
- **iMessage ativo** (conta Apple ID logada)
- **Permissões de Acessibilidade** (System Settings > Privacy & Security > Accessibility)

#### Configuração

**1. Arquivo `~/.neobot/neobot.json`:**
```json
{
  "channels": {
    "imessage": {
      "enabled": true,
      "allowFrom": [
        "+5511999999999",     // Números de telefone
        "email@icloud.com"    // Emails Apple ID
      ],
      "groups": {
        "*": {
          "requireMention": false  // iMessage não tem menções
        }
      }
    }
  }
}
```

**2. Conceder Permissões:**
```bash
# 1. System Settings > Privacy & Security > Accessibility
# 2. Adicionar "Terminal" ou "NeoBot.app"
# 3. Ativar o toggle
```

#### Recursos Disponíveis

✅ **Mensagens de Texto**
- Envio e recebimento
- Emojis
- Reações (❤️, 👍, etc.)

✅ **Grupos**
- Detecção automática
- Múltiplos participantes

⚠️ **Limitações:**
- ❌ Sem suporte a mídia (fotos/vídeos)
- ❌ Sem indicador de digitação
- ❌ Sem status de leitura
- ❌ Apenas texto simples

#### Monitoramento

```typescript
// O NeoBot monitora mensagens via polling
// Intervalo padrão: 2 segundos
// Configurável via:
{
  "channels": {
    "imessage": {
      "pollInterval": 2000  // ms
    }
  }
}
```

#### Comandos Úteis

```bash
# Verificar se iMessage está disponível
pnpm neobot channels probe imessage

# Enviar mensagem de teste
pnpm neobot message send --channel imessage --to "+5511999999999" --message "Teste"
```

---

## 🤖 Agente Autônomo Pi

O **Pi Agent** é o cérebro do NeoBot - um runtime de IA autônomo baseado no framework **pi-mono** da Mario Zechner.

### Arquitetura do Agente

```
┌─────────────────────────────────────────────────────────────┐
│                      PI AGENT RUNTIME                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────┐ │
│  │   Session    │◄────►│   Context    │◄────►│  Memory  │ │
│  │  Management  │      │   Window     │      │  Search  │ │
│  └──────────────┘      └──────────────┘      └──────────┘ │
│         │                     │                     │       │
│         ▼                     ▼                     ▼       │
│  ┌──────────────┐      ┌──────────────┐      ┌──────────┐ │
│  │  Tool Call   │      │   Streaming  │      │ Failover │ │
│  │  Execution   │      │   Response   │      │  Logic   │ │
│  └──────────────┘      └──────────────┘      └──────────┘ │
│         │                     │                     │       │
│         ▼                     ▼                     ▼       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              PROVIDER ADAPTERS                       │  │
│  │  • Anthropic (Claude)  • OpenAI  • Bedrock          │  │
│  │  • Google (Gemini)     • Ollama  • GitHub Copilot   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Componentes Principais

#### 1. **Session Management** (`src/agents/`)

Gerencia sessões isoladas por canal/usuário:

```typescript
// Estrutura de uma sessão:
{
  "sessionId": "whatsapp:+5511999999999",
  "agentId": "main",
  "model": "anthropic/claude-opus-4-5",
  "thinkingLevel": "medium",
  "verboseLevel": false,
  "history": [...],  // Histórico de mensagens
  "context": {...},  // Contexto atual
  "metadata": {...}  // Metadados
}
```

**Tipos de Sessão:**
- **main**: Sessão principal (DM com você)
- **group**: Sessões de grupo
- **channel**: Sessões por canal

**Isolamento:**
```json
{
  "agents": {
    "defaults": {
      "workspace": "~/clawd",
      "sandbox": {
        "mode": "non-main",  // Sandbox para não-main
        "allowlist": ["bash", "read", "write", "edit"],
        "denylist": ["browser", "canvas", "gateway"]
      }
    }
  }
}
```

#### 2. **Context Window Guard** (`context-window-guard.ts`)

Gerencia o limite de tokens do contexto:

```typescript
// Limites por modelo:
{
  "claude-opus-4-5": 200000,    // 200K tokens
  "gpt-4-turbo": 128000,        // 128K tokens
  "gemini-pro": 1000000         // 1M tokens
}

// Estratégias de compactação:
// 1. Resumo automático (compaction)
// 2. Remoção de mensagens antigas
// 3. Truncamento de tool results
```

#### 3. **Tool Execution** (`pi-tools.ts`)

Sistema de ferramentas disponíveis para o agente:

**Ferramentas Core:**
```typescript
// Bash/Terminal
bash_exec()           // Executar comandos
bash_process_send()   // Enviar input para processo

// Arquivos
read_file()           // Ler arquivo
write_file()          // Escrever arquivo
edit_file()           // Editar arquivo
list_dir()            // Listar diretório

// Sessões
sessions_list()       // Listar sessões ativas
sessions_send()       // Enviar mensagem para outra sessão
sessions_history()    // Ver histórico de sessão
sessions_spawn()      // Criar sub-agente

// Browser
browser_navigate()    // Navegar para URL
browser_click()       // Clicar em elemento
browser_type()        // Digitar texto
browser_screenshot()  // Capturar screenshot

// Canvas (macOS/iOS)
canvas_push()         // Enviar UI para canvas
canvas_eval()         // Executar código no canvas
canvas_snapshot()     // Capturar snapshot

// Nodes (dispositivos)
node_invoke()         // Invocar ação em node
camera_snap()         // Tirar foto
screen_record()       // Gravar tela
location_get()        // Obter localização

// Cron
cron_add()            // Adicionar tarefa agendada
cron_list()           // Listar tarefas
cron_remove()         // Remover tarefa

// Discord/Slack (se habilitados)
discord_send()        // Enviar mensagem Discord
slack_send()          // Enviar mensagem Slack
```

**Políticas de Ferramentas:**
```json
{
  "agents": {
    "defaults": {
      "tools": {
        "allowlist": ["*"],  // Todas permitidas
        "denylist": [],      // Nenhuma negada
        "sandbox": {
          "allowlist": ["bash", "read", "write"],
          "denylist": ["browser", "gateway"]
        }
      }
    }
  }
}
```

#### 4. **Streaming Response** (`pi-embedded-subscribe.ts`)

Sistema de streaming de respostas em tempo real:

```typescript
// Tipos de eventos:
{
  "text:start": {},              // Início de texto
  "text:delta": { delta: "..." }, // Incremento de texto
  "text:end": { text: "..." },   // Texto completo
  
  "tool:start": { name: "..." }, // Início de tool call
  "tool:end": { result: {...} }, // Resultado de tool
  
  "thinking:start": {},          // Início de pensamento
  "thinking:delta": {},          // Pensamento incremental
  "thinking:end": {},            // Fim de pensamento
  
  "error": { error: "..." }      // Erro
}
```

**Chunking Inteligente:**
```typescript
// O NeoBot divide respostas longas automaticamente:
// - Telegram: 4096 caracteres
// - WhatsApp: 65536 caracteres
// - iMessage: Sem limite (mas recomendado < 10K)

// Preserva:
// - Code blocks (```...```)
// - Parágrafos
// - Listas
```

#### 5. **Model Failover** (`model-fallback.ts`)

Sistema de fallback automático entre modelos:

```typescript
// Ordem de fallback (exemplo):
[
  "anthropic/claude-opus-4-5",     // Primário
  "anthropic/claude-sonnet-4",     // Fallback 1
  "openai/gpt-4-turbo",            // Fallback 2
  "openai/gpt-4"                   // Fallback 3
]

// Razões de fallback:
// - Context overflow (contexto muito grande)
// - Rate limit (limite de taxa)
// - Auth error (erro de autenticação)
// - Billing error (erro de cobrança)
// - Network error (erro de rede)
```

#### 6. **Memory Search** (`memory-search.ts`)

Sistema de busca semântica em memória:

```typescript
// Usa sqlite-vec para embeddings
// Permite buscar mensagens antigas por similaridade
// Útil para contexto de longo prazo

// Exemplo:
memory_search("Como fazer deploy?")
// Retorna mensagens antigas relacionadas a deploy
```

### Configuração do Agente

**Arquivo `~/.neobot/neobot.json`:**
```json
{
  "agent": {
    "model": "anthropic/claude-opus-4-5",
    "thinkingLevel": "medium",
    "verboseLevel": false,
    "maxTokens": 4096,
    "temperature": 1.0
  },
  "agents": {
    "defaults": {
      "workspace": "~/clawd",
      "model": "anthropic/claude-opus-4-5",
      "thinkingLevel": "medium",
      "sandbox": {
        "mode": "non-main",
        "allowlist": ["bash", "read", "write", "edit"],
        "denylist": ["browser", "canvas", "gateway"]
      },
      "tools": {
        "allowlist": ["*"],
        "denylist": []
      },
      "historyLimit": 50,
      "compactionThreshold": 0.8
    }
  }
}
```

### Modelos Suportados

#### Anthropic (Claude)
```json
{
  "models": {
    "anthropic": {
      "apiKey": "${ANTHROPIC_API_KEY}",
      "models": [
        "claude-opus-4-5",      // 200K context, mais poderoso
        "claude-sonnet-4",      // 200K context, balanceado
        "claude-haiku-4",       // 200K context, mais rápido
        "claude-3-5-sonnet"     // Legacy
      ]
    }
  }
}
```

#### OpenAI
```json
{
  "models": {
    "openai": {
      "apiKey": "${OPENAI_API_KEY}",
      "models": [
        "gpt-4-turbo",          // 128K context
        "gpt-4",                // 8K context
        "gpt-3.5-turbo"         // 16K context
      ]
    }
  }
}
```

#### Google (Gemini)
```json
{
  "models": {
    "google": {
      "apiKey": "${GOOGLE_API_KEY}",
      "models": [
        "gemini-pro",           // 1M context
        "gemini-ultra",         // 1M context
        "gemini-flash"          // 1M context, mais rápido
      ]
    }
  }
}
```

#### Ollama (Local)
```json
{
  "models": {
    "ollama": {
      "baseUrl": "http://localhost:11434",
      "models": [
        "llama2",
        "mistral",
        "codellama"
      ]
    }
  }
}
```

### Skills System

O NeoBot suporta **skills** - módulos de funcionalidade estendida:

```
~/clawd/skills/
├── weather/
│   ├── SKILL.md          # Documentação da skill
│   ├── weather.ts        # Implementação
│   └── package.json      # Dependências
├── github/
│   ├── SKILL.md
│   ├── github.ts
│   └── package.json
└── custom-skill/
    ├── SKILL.md
    └── script.sh
```

**Formato SKILL.md:**
```markdown
---
name: weather
description: Get weather information
---

# Weather Skill

## Commands

- `weather <city>` - Get current weather
- `forecast <city>` - Get 5-day forecast

## Usage

```bash
pnpm neobot run weather "São Paulo"
```
```

---

## 🖥️ Apps Nativos

O NeoBot possui apps nativos para macOS, iOS e Android que funcionam como **nodes** remotos.

### Arquitetura de Nodes

```
┌─────────────────────────────────────────────────────────────┐
│                      GATEWAY (Central)                      │
│                  ws://127.0.0.1:18789                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
    ┌────────┐    ┌────────┐    ┌────────┐
    │ macOS  │    │  iOS   │    │Android │
    │  Node  │    │  Node  │    │  Node  │
    └────────┘    └────────┘    └────────┘
         │             │             │
         ▼             ▼             ▼
    ┌────────┐    ┌────────┐    ┌────────┐
    │ Camera │    │ Canvas │    │ Screen │
    │ Screen │    │Location│    │ Camera │
    │ Notify │    │ Camera │    │Location│
    └────────┘    └────────┘    └────────┘
```

### macOS App

**Localização:** `apps/macos/`

#### Recursos

✅ **Menu Bar Control**
- Status do Gateway
- Quick actions
- Logs em tempo real

✅ **Voice Wake**
- Ativação por voz ("Hey NeoBot")
- Push-to-talk (PTT)
- Integração com ElevenLabs TTS

✅ **Talk Mode**
- Conversação contínua
- Overlay flutuante
- Transcrição em tempo real

✅ **Canvas Host**
- Renderização de UI gerada por IA
- A2UI (Agent-to-UI) protocol
- Interação em tempo real

✅ **System Actions**
```typescript
// Disponíveis via node.invoke:
system.run()          // Executar comando local
system.notify()       // Notificação do sistema
camera.snap()         // Tirar foto (webcam)
screen.record()       // Gravar tela
location.get()        // Obter localização (via IP)
```

#### Build e Execução

```bash
# Desenvolvimento (rápido, sem assinatura)
scripts/restart-mac.sh --no-sign

# Com assinatura (TCC permissions persistem)
scripts/restart-mac.sh --sign

# Packaging para distribuição
scripts/package-mac-app.sh

# Resultado: dist/Moltbot.app
```

#### Permissões macOS

O app requer permissões TCC (Transparency, Consent, and Control):

```
System Settings > Privacy & Security:
├── Accessibility       ✅ (Controle do sistema)
├── Screen Recording    ✅ (Captura de tela)
├── Camera              ✅ (Webcam)
├── Microphone          ✅ (Voice Wake)
└── Automation          ✅ (AppleScript)
```

**⚠️ IMPORTANTE:** Permissões só persistem com **code signing** adequado!

#### Assinatura de Código

```bash
# Identidades disponíveis (ordem de preferência):
# 1. Developer ID Application
# 2. Apple Distribution
# 3. Apple Development
# 4. Ad-hoc (não persiste TCC)

# Verificar identidades disponíveis
security find-identity -v -p codesigning

# Assinar com identidade específica
SIGN_IDENTITY="Developer ID Application: Seu Nome (TEAMID)" \
  scripts/package-mac-app.sh

# Ad-hoc (dev apenas, TCC não persiste)
ALLOW_ADHOC_SIGNING=1 scripts/package-mac-app.sh
```

### iOS App

**Localização:** `apps/ios/`

#### Recursos

✅ **Canvas**
- Renderização de UI
- Interação touch
- Gestos

✅ **Camera**
- Foto frontal/traseira
- Flash
- HDR

✅ **Screen Recording**
- Captura de tela
- Vídeo

✅ **Location**
- GPS preciso
- Geocoding

✅ **Voice Wake**
- Ativação por voz
- Siri Shortcuts

#### Build e Execução

```bash
# Gerar projeto Xcode
cd apps/ios
xcodegen generate
open Moltbot.xcodeproj

# Build via CLI
pnpm ios:build

# Run no simulador
pnpm ios:run

# Ou especificar dispositivo
IOS_DEST="platform=iOS Simulator,name=iPhone 15 Pro" pnpm ios:run
```

#### Pairing com Gateway

```bash
# 1. Gateway deve estar rodando
pnpm neobot gateway --port 18789

# 2. No iOS app:
# - Abrir Settings
# - Tap "Pair with Gateway"
# - Escanear QR Code ou inserir código

# 3. Verificar pairing
pnpm neobot nodes list
```

### Android App

**Localização:** `apps/android/`

#### Recursos

✅ **Canvas**
- Jetpack Compose UI
- Material Design 3

✅ **Camera**
- CameraX API
- Foto/Vídeo

✅ **Screen Recording**
- MediaProjection API

✅ **Location**
- FusedLocationProvider
- Background location

#### Build e Execução

```bash
# Build APK
cd apps/android
./gradlew :app:assembleDebug

# Instalar no dispositivo
./gradlew :app:installDebug

# Ou via pnpm
pnpm android:assemble
pnpm android:install
pnpm android:run
```

### Node Protocol

Todos os nodes se comunicam via **WebSocket** com o Gateway:

```typescript
// Registro de node
{
  "type": "node.register",
  "nodeId": "iphone-15-pro",
  "capabilities": [
    "camera.snap",
    "camera.record",
    "screen.record",
    "location.get",
    "canvas.render"
  ],
  "metadata": {
    "platform": "ios",
    "version": "17.2",
    "model": "iPhone 15 Pro"
  }
}

// Invocação de ação
{
  "type": "node.invoke",
  "nodeId": "iphone-15-pro",
  "action": "camera.snap",
  "params": {
    "camera": "front",
    "flash": false
  }
}

// Resposta
{
  "type": "node.result",
  "nodeId": "iphone-15-pro",
  "action": "camera.snap",
  "result": {
    "success": true,
    "imageUrl": "data:image/jpeg;base64,..."
  }
}
```

---

## ⚙️ Configuração Completa

### Estrutura de Arquivos

```
~/.neobot/
├── neobot.json           # Configuração principal
├── credentials/          # Credenciais de canais
│   ├── whatsapp/
│   ├── telegram/
│   └── slack/
├── sessions/             # Sessões ativas
│   ├── main.json
│   └── whatsapp:+5511999999999.json
├── ledger/               # Auditoria de eventos
│   └── events.jsonl
└── workspace/            # Workspace do agente
    └── skills/
```

### Exemplo Completo de Configuração

```json
{
  "gateway": {
    "port": 18789,
    "bind": "loopback",
    "auth": {
      "mode": "none"
    },
    "tailscale": {
      "mode": "off"
    }
  },
  "agent": {
    "model": "anthropic/claude-opus-4-5",
    "thinkingLevel": "medium",
    "verboseLevel": false
  },
  "agents": {
    "defaults": {
      "workspace": "~/clawd",
      "model": "anthropic/claude-opus-4-5",
      "sandbox": {
        "mode": "non-main",
        "allowlist": ["bash", "read", "write", "edit", "sessions_list", "sessions_send"],
        "denylist": ["browser", "canvas", "gateway"]
      }
    }
  },
  "channels": {
    "whatsapp": {
      "enabled": true,
      "allowFrom": ["*"],
      "dmPolicy": "pairing"
    },
    "telegram": {
      "enabled": true,
      "botToken": "${TELEGRAM_BOT_TOKEN}",
      "allowFrom": ["@seu_username"],
      "groups": {
        "*": {
          "requireMention": true
        }
      }
    },
    "imessage": {
      "enabled": true,
      "allowFrom": ["+5511999999999"]
    }
  },
  "models": {
    "anthropic": {
      "apiKey": "${ANTHROPIC_API_KEY}"
    },
    "openai": {
      "apiKey": "${OPENAI_API_KEY}"
    }
  },
  "browser": {
    "enabled": true,
    "color": "#FF4500"
  },
  "cron": {
    "enabled": true
  }
}
```

---

## 🎯 Casos de Uso Práticos

### 1. Assistente Pessoal Multi-Canal

```bash
# Configurar para responder em todos os canais
# WhatsApp, Telegram e iMessage simultaneamente

# 1. Iniciar Gateway
pnpm neobot gateway --port 18789

# 2. Em outro terminal, monitorar logs
tail -f ~/.neobot/ledger/events.jsonl

# 3. Enviar mensagem de qualquer canal
# O agente responderá no mesmo canal
```

### 2. Automação de Tarefas

```typescript
// Criar skill personalizada
// ~/clawd/skills/backup/SKILL.md

---
name: backup
description: Automated backup system
---

# Backup Skill

Executa backup automático de arquivos importantes.

## Usage

```bash
pnpm neobot run backup
```

// ~/clawd/skills/backup/backup.sh
#!/bin/bash
tar -czf ~/backups/backup-$(date +%Y%m%d).tar.gz ~/Documents
```

### 3. Monitoramento de Servidor

```json
// Adicionar cron job para monitoramento
{
  "cron": {
    "enabled": true,
    "jobs": [
      {
        "name": "health-check",
        "schedule": "*/5 * * * *",  // A cada 5 minutos
        "action": "pnpm neobot health --full",
        "notifyOn": "error",
        "notifyChannel": "telegram"
      }
    ]
  }
}
```

### 4. Análise de Documentos

```bash
# Via WhatsApp/Telegram:
# 1. Enviar PDF/imagem
# 2. Agente analisa automaticamente
# 3. Responde com resumo/insights

# Configurar:
{
  "media": {
    "maxSizeMb": 50,
    "allowedTypes": ["image/*", "application/pdf", "text/*"]
  }
}
```

### 5. Controle Remoto de Dispositivos

```bash
# Do Telegram, controlar iPhone:
# "Tire uma foto com a câmera frontal"

# Agente executa:
# 1. Identifica node iOS
# 2. Invoca camera.snap
# 3. Retorna imagem no Telegram
```

---

## 📚 Referências

- **Documentação Oficial:** https://docs.molt.bot
- **GitHub:** https://github.com/neobot/neobot
- **Pi-Mono Framework:** https://github.com/badlogic/pi-mono
- **Baileys (WhatsApp):** https://github.com/WhiskeySockets/Baileys
- **grammY (Telegram):** https://grammy.dev

---

**Última atualização:** 29/01/2026 02:51  
**Versão do NeoBot:** 2026.1.26  
**Protocolo:** NΞØ 🛰️
