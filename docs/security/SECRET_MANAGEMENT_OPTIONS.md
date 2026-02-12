# 🔐 Secret Management Options

## TL;DR: Use Bitwarden (gratuito e melhor).

```text
╔════════════════════════════════════════╗
║  RECOMENDAÇÃO: BITWARDEN               ║
║  - Open Source                         ║
║  - Gratuito                            ║
║  - CLI incluído                        ║
║  - Self-hosted option                  ║
║  - Funciona out of the box             ║
╚════════════════════════════════════════╝
```

---

## 💰 Comparação de Preços

### Opções PAGAS:

```text
1Password
├─ Individual: $2.99/mês ($36/ano)
├─ Família: $4.99/mês (5 pessoas)
├─ Teams: $7.99/user/mês
└─ Features: CLI, SSH agent, secrets automation

LastPass
├─ Premium: $3/mês
├─ Família: $4/mês (6 pessoas)
└─ Features: Unlimited devices, dark web monitoring

Dashlane
├─ Premium: $4.99/mês
├─ Família: $7.49/mês (10 pessoas)
└─ Features: VPN incluído, dark web monitoring
```

### Opções GRATUITAS:

```text
Bitwarden (⭐ RECOMENDADO)
├─ Free: Unlimited devices, sync
├─ Premium: $10/ANO (não mês!)
├─ Self-hosted: Gratuito
├─ Features: CLI, secrets manager
└─ Open Source: ✅

KeePassXC
├─ Completamente gratuito
├─ Local only (sem cloud)
├─ Open Source
└─ Portátil

pass (Unix Password Manager)
├─ Completamente gratuito
├─ CLI-first, git-backed
├─ GPG encryption
└─ Open Source

Doppler
├─ Free: até 5 usuários
├─ Secrets management
├─ API-first
└─ CI/CD integration
```

---

## 🎯 Recomendação por Caso de Uso

### Para Desenvolvimento Individual:

**Escolha: Bitwarden Free**

```bash
# Instalação
brew install bitwarden-cli

# Login
bw login

# Usar em scripts
export ANTHROPIC_API_KEY=$(bw get password anthropic-key)
```

**Por quê:**
- ✅ Gratuito forever
- ✅ CLI incluído
- ✅ Sync entre devices
- ✅ Browser extension
- ✅ Open source

### Para Team/Company:

**Escolha: Doppler ou Bitwarden Teams**

```bash
# Doppler (Free até 5 users)
npm install -g @dopplerhq/cli
doppler setup
doppler run -- node app.js

# Bitwarden Teams ($1/user/mês)
# Shared collections, audit logs
```

**Por quê:**
- ✅ Compartilhamento seguro
- ✅ Audit logs
- ✅ Role-based access
- ✅ API tokens

### Para Self-Hosted/Privacy Paranoid:

**Escolha: Vaultwarden (Bitwarden self-hosted)**

```bash
# Docker Compose
docker run -d --name vaultwarden \
  -v /vw-data/:/data/ \
  -p 80:80 \
  vaultwarden/server:latest
```

**Por quê:**
- ✅ Completamente seu
- ✅ Zero custo (só infra)
- ✅ Compatível com Bitwarden clients
- ✅ No third-party access

### Para Projetos Open Source:

**Escolha: pass + GitHub Secrets**

```bash
# pass (local)
brew install pass
pass init "your-gpg-key"
pass insert anthropic/api-key

# GitHub Secrets (CI/CD)
gh secret set ANTHROPIC_API_KEY
```

**Por quê:**
- ✅ Gratuito
- ✅ Git-backed (auditável)
- ✅ GPG encryption
- ✅ GitHub Actions native

---

## 📋 Feature Comparison

```text
Feature                 1Password  Bitwarden  KeePass  pass  Doppler
─────────────────────────────────────────────────────────────────────
Price                   Paid       Free       Free     Free  Free*
Sync                    ✅         ✅         Manual   Git   ✅
CLI                     ✅         ✅         ❌       ✅    ✅
Browser Extension       ✅         ✅         ✅       ❌    ❌
Mobile Apps             ✅         ✅         ✅       ❌    ✅
Secrets Management      ✅         ✅         ❌       ❌    ✅
CI/CD Integration       ✅         ❌         ❌       ✅    ✅
Self-Hosted Option      ❌         ✅         N/A      N/A   ❌
Open Source             ❌         ✅         ✅       ✅    ❌
Team Sharing            ✅         ✅**       ❌       Git   ✅
Audit Logs              ✅         ✅**       ❌       Git   ✅
2FA/MFA                 ✅         ✅         ✅       GPG   ✅
SSH Agent               ✅         ❌         ❌       ❌    ❌

* Doppler free até 5 usuários
** Bitwarden team sharing é pago ($1/user/mês)
```

---

## 🚀 Setup Rápido: Bitwarden CLI

### 1. Instalação:

```bash
# macOS
brew install bitwarden-cli

# Linux
snap install bw

# npm (universal)
npm install -g @bitwarden/cli
```

### 2. Login e Setup:

```bash
# Login
bw login

# Unlock vault (retorna session key)
export BW_SESSION=$(bw unlock --raw)

# Verificar
bw status
```

### 3. Armazenar Secrets:

```bash
# Criar item
bw create item '{
  "type": 1,
  "name": "Anthropic API Key",
  "notes": "Claude AI production key",
  "login": {
    "username": "neobot",
    "password": "sk-ant-api03-..."
  }
}'

# Criar secure note
bw create item '{
  "type": 2,
  "name": "NEO Protocol Keys",
  "notes": "NEO_CORE_PRIVATE_KEY=0x..."
}'
```

### 4. Recuperar Secrets:

```bash
# Get specific item
bw get item "Anthropic API Key"

# Get password only
bw get password "Anthropic API Key"

# Get notes (for multi-line)
bw get notes "NEO Protocol Keys"

# Use in scripts
export ANTHROPIC_API_KEY=$(bw get password "Anthropic API Key")
```

### 5. Integração com .env:

```bash
# Script: load-secrets.sh
#!/bin/bash
export BW_SESSION=$(bw unlock --raw)

export ANTHROPIC_API_KEY=$(bw get password "Anthropic API Key")
export TELEGRAM_BOT_TOKEN=$(bw get password "Telegram Bot")
export ASI1AI_API_KEY=$(bw get password "ASI1 API Key")

# Load NEO keys
eval $(bw get notes "NEO Protocol Keys")

echo "✅ Secrets loaded from Bitwarden"
```

```bash
# Uso
source load-secrets.sh
pnpm moltbot gateway
```

---

## 🔧 Integração com NeoBot

### Opção 1: Script Wrapper

```bash
# scripts/run-with-secrets.sh
#!/bin/bash
set -e

if [ -z "$BW_SESSION" ]; then
    echo "Unlock Bitwarden vault first:"
    echo "export BW_SESSION=\$(bw unlock --raw)"
    exit 1
fi

# Load secrets
export ANTHROPIC_API_KEY=$(bw get password "NeoBot Anthropic")
export TELEGRAM_BOT_TOKEN=$(bw get password "NeoBot Telegram")
export ASI1AI_API_KEY=$(bw get password "NeoBot ASI1")

# Load NEO keys
eval $(bw get notes "NeoBot NEO Keys")

# Run command
exec "$@"
```

**Uso:**
```bash
./scripts/run-with-secrets.sh pnpm moltbot gateway
```

### Opção 2: Doppler (mais enterprise)

```bash
# Setup inicial
doppler setup

# Adicionar secrets
doppler secrets set ANTHROPIC_API_KEY
doppler secrets set TELEGRAM_BOT_TOKEN

# Run com secrets injetados automaticamente
doppler run -- pnpm moltbot gateway
```

### Opção 3: Railway (production)

```bash
# Railway já tem secrets management nativo
railway variables set ANTHROPIC_API_KEY=...
railway variables set TELEGRAM_BOT_TOKEN=...

# Deploy
railway up
```

---

## 🛡️ Boas Práticas

### 1. Nunca commite secrets

```bash
# ✅ Bom
.env
.env.local
secrets/

# ❌ Ruim
.env.example  # OK se for placeholder
credentials.json  # ❌ Nunca!
```

### 2. Rotação periódica

```bash
# A cada 90 dias
- Rotacione API keys
- Atualize no vault
- Teste antes de invalidar antigas
```

### 3. Princípio do menor privilégio

```bash
# Cada ambiente com suas próprias keys
Development → dev-api-key
Staging → staging-api-key
Production → prod-api-key
```

### 4. Audit logging

```bash
# Bitwarden Premium: Event logs
# Doppler: Audit trail automático
# pass: Git commit history
```

### 5. 2FA/MFA sempre

```bash
# Bitwarden: TOTP, YubiKey, Duo
# 1Password: TOTP, U2F
# Doppler: SAML SSO
```

---

## 🆘 Troubleshooting

### Bitwarden CLI não sincroniza:

```bash
bw sync
bw unlock --check
```

### Session expira muito rápido:

```bash
# No .zshrc ou .bashrc
export BW_SESSION=$(bw unlock --raw --nointeraction)
```

### Preciso compartilhar com team:

```bash
# Upgrade para Organizations
# Ou use Doppler (free 5 users)
```

### Self-hosted Vaultwarden:

```bash
# Docker Compose completo
version: '3'
services:
  vaultwarden:
    image: vaultwarden/server:latest
    container_name: vaultwarden
    restart: always
    environment:
      WEBSOCKET_ENABLED: "true"
      SIGNUPS_ALLOWED: "false"
    volumes:
      - ./vw-data:/data
    ports:
      - "8080:80"
```

---

## 📊 Custo Anual Comparison

```text
Solução              Custo/Ano    Features
────────────────────────────────────────────
Bitwarden Free       $0           Tudo que precisa
Bitwarden Premium    $10          TOTP, reports
KeePassXC            $0           Local only
pass                 $0           CLI + Git
Doppler              $0*          5 users max

1Password            $36          Mais polido
LastPass             $36          Similar
Dashlane             $60          VPN incluído

*Doppler free tem limite de 5 usuários
```

**Economia com Bitwarden:**
- vs 1Password: $36/ano
- vs LastPass: $36/ano
- vs Dashlane: $60/ano

---

## ✅ Decisão Final

### Para NeoBot (Você):

```text
╔════════════════════════════════════════╗
║  RECOMENDAÇÃO: BITWARDEN CLI           ║
║                                        ║
║  Razões:                               ║
║  ✅ Gratuito forever                   ║
║  ✅ CLI-friendly (dev workflow)        ║
║  ✅ Open source (trustworthy)          ║
║  ✅ Sync entre devices                 ║
║  ✅ Self-host option (futuro)          ║
║                                        ║
║  Setup: 10 minutos                     ║
║  Custo: $0/mês                         ║
╚════════════════════════════════════════╝
```

### Próximos Passos:

```bash
# 1. Instalar Bitwarden CLI
brew install bitwarden-cli

# 2. Criar conta (app ou web)
open https://vault.bitwarden.com

# 3. Login no CLI
bw login

# 4. Migrar secrets do .env
# (manual, um por um)

# 5. Criar script load-secrets.sh
# (automação)

# 6. Deletar .env (manter .env.example)
rm .env

# 7. Adicionar ao README
# Como outros devs devem setup
```

---

## 🔗 Links Úteis

### Bitwarden:
- Website: https://bitwarden.com
- CLI Docs: https://bitwarden.com/help/cli/
- Self-host: https://github.com/dani-garcia/vaultwarden

### Alternativas:
- Doppler: https://doppler.com
- pass: https://www.passwordstore.org
- KeePassXC: https://keepassxc.org

### Railway (Production):
- Secrets: https://docs.railway.app/develop/variables
- Best Practices: https://docs.railway.app/deploy/deployments

---

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"Free is better than paid when both work."
────────────────────────────────────────
