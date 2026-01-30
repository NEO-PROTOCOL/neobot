# 🚀 Bitwarden Setup RÁPIDO - 5 Minutos

```text
╔════════════════════════════════════════╗
║  BITWARDEN: GRATUITO FOREVER           ║
║  Melhor que 1Password mesmo            ║
╚════════════════════════════════════════╝
```

---

## ✅ JÁ INSTALADO

```bash
✓ Bitwarden CLI 2025.12.1
✓ Bitwarden App (baixando...)
```

---

## 🚀 SETUP EM 3 PASSOS

### PASSO 1: Criar Conta (2 min)

**Opção A: Via Web (Mais rápido)**

```bash
# Abrir página de registro
open "https://vault.bitwarden.com/#/register"
```

**Preencher:**

- Email: `mello.neoprotocol@gmail.com` (ou outro)
- Name: `Mellø`
- Master Password: **FORTE** (min 12 chars)
- ✅ Create Account

**Opção B: Via App**

```bash
# Esperar download terminar, depois:
open -a "Bitwarden"
# Click "Create Account"
```

---

### PASSO 2: Login no CLI (30 seg)

```bash
# Login
bw login

# Vai pedir:
# Email: mello.neoprotocol@gmail.com
# Master password: ******

# Depois, desbloquear e salvar session:
export BW_SESSION=$(bw unlock --raw)

# Salvar session (persist)
echo "export BW_SESSION=$(bw unlock --raw)" >> ~/.zshrc
```

**Teste:**

```bash
bw status
# Esperado: "status":"unlocked"

bw list items --search test
# Esperado: [] (vazio, ainda não tem items)
```

---

### PASSO 3: Migrar Secrets (2 min)

**Script automático:**

```bash
# Criar script de migração
cat > scripts/migrate-to-bitwarden.sh << 'EOF'
#!/bin/bash
set -e

echo "Migrando .env → Bitwarden..."

# Check session
if ! bw status | grep -q "unlocked"; then
    export BW_SESSION=$(bw unlock --raw)
fi

# Read .env and create items
while IFS='=' read -r key value; do
    [[ $key =~ ^#.*$ ]] && continue
    [[ -z $key ]] && continue
    
    value=$(echo "$value" | tr -d '"' | tr -d "'")
    
    echo "Criando: $key"
    bw create item \
        --session "$BW_SESSION" \
        --name "$key" \
        --notes "$value" \
        --type 2 \
        2>/dev/null || echo "  ⚠️  Já existe"
done < .env

bw sync --session "$BW_SESSION"
echo "✅ Migração completa!"
EOF

chmod +x scripts/migrate-to-bitwarden.sh

# Executar
./scripts/migrate-to-bitwarden.sh
```

---

## 🎯 USO DIÁRIO

### Script de Load (usar sempre):

```bash
# Criar script
cat > scripts/load-secrets-bitwarden.sh << 'EOF'
#!/bin/bash
set -e

# Unlock if needed
if ! bw status | grep -q "unlocked"; then
    export BW_SESSION=$(bw unlock --raw)
fi

# Load secrets
export ANTHROPIC_API_KEY=$(bw get notes "ANTHROPIC_API_KEY" --session "$BW_SESSION")
export TELEGRAM_BOT_TOKEN=$(bw get notes "TELEGRAM_BOT_TOKEN" --session "$BW_SESSION")
export ASI1AI_API_KEY=$(bw get notes "ASI1AI_API_KEY" --session "$BW_SESSION")

# Load NEO keys
export NEO_CORE_PRIVATE_KEY=$(bw get notes "NEO_CORE_PRIVATE_KEY" --session "$BW_SESSION")
export NEO_GATEWAY_PRIVATE_KEY=$(bw get notes "NEO_GATEWAY_PRIVATE_KEY" --session "$BW_SESSION")
export NEO_SKILLS_PRIVATE_KEY=$(bw get notes "NEO_SKILLS_PRIVATE_KEY" --session "$BW_SESSION")
export NEO_FACTORY_PRIVATE_KEY=$(bw get notes "NEO_FACTORY_PRIVATE_KEY" --session "$BW_SESSION")
export NEO_FLOWPAY_PRIVATE_KEY=$(bw get notes "NEO_FLOWPAY_PRIVATE_KEY" --session "$BW_SESSION")
export NEO_ASI1_PRIVATE_KEY=$(bw get notes "NEO_ASI1_PRIVATE_KEY" --session "$BW_SESSION")
export NEO_TELEGRAM_PRIVATE_KEY=$(bw get notes "NEO_TELEGRAM_PRIVATE_KEY" --session "$BW_SESSION")
export NEO_WHATSAPP_PRIVATE_KEY=$(bw get notes "NEO_WHATSAPP_PRIVATE_KEY" --session "$BW_SESSION")
export NEO_IPFS_PRIVATE_KEY=$(bw get notes "NEO_IPFS_PRIVATE_KEY" --session "$BW_SESSION")

echo "✅ Secrets loaded!"
EOF

chmod +x scripts/load-secrets-bitwarden.sh
```

**Usar:**

```bash
source scripts/load-secrets-bitwarden.sh
pnpm moltbot gateway
```

---

## 📋 Checklist Rápido

```text
[ ] Criar conta Bitwarden (web ou app)
[ ] Login no CLI (bw login)
[ ] Desbloquear (export BW_SESSION=...)
[ ] Migrar secrets (./scripts/migrate-to-bitwarden.sh)
[ ] Testar load (source scripts/load-secrets-bitwarden.sh)
[ ] Verificar vars (env | grep ANTHROPIC)
[ ] Testar gateway (pnpm moltbot gateway)
[ ] Se OK: deletar .env (mv .env .env.backup)
```

---

## 🆘 Problemas?

### Erro: "session key is invalid"

```bash
# Re-unlock
export BW_SESSION=$(bw unlock --raw)
```

### Erro: "not found"

```bash
# Listar items
bw list items --session "$BW_SESSION"

# Verificar nome exato
bw list items --search "ANTHROPIC" --session "$BW_SESSION"
```

### Erro: "You are not logged in"

```bash
bw login
export BW_SESSION=$(bw unlock --raw)
```

---

## 💰 1Password Reembolso

Se quiser pedir reembolso da Apple:

```bash
# Abrir página de compras
open "https://reportaproblem.apple.com"

# Ou via App Store
# App Store → Account → Purchase History
# Encontre 1Password → Report a Problem
# Motivo: "Doesn't work as expected"
```

---

## ✅ Pronto!

**Depois de setup:**

1. Delete .env:
   ```bash
   rm .env
   # Keep .env.example
   ```

2. Update package.json:
   ```json
   {
     "scripts": {
       "gateway": "source scripts/load-secrets-bitwarden.sh && moltbot gateway"
     }
   }
   ```

3. Commit scripts:
   ```bash
   git add scripts/migrate-to-bitwarden.sh
   git add scripts/load-secrets-bitwarden.sh
   git commit -m "feat: add Bitwarden integration"
   ```

**DONE! 🎉**

---

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol

"Gratuito > Pago quando ambos funcionam."
────────────────────────────────────────
