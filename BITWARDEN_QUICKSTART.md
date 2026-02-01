# 🚀 Bitwarden QUICK Setup - 5 Minutes

```text
╔════════════════════════════════════════╗
║  BITWARDEN: FREE FOREVER               ║
║  Better than 1Password for sure        ║
╚════════════════════════════════════════╝
```

---

## ✅ ALREADY INSTALED

```bash
✓ Bitwarden CLI 2025.12.1
✓ Bitwarden App (downloading...)
```

---

## 🚀 SETUP IN 3 STEPS

### STEP 1: Create Account (2 min)

**Option A: Via Web (Faster)**

```bash
# Open registration page
open "https://vault.bitwarden.com/#/register"
```

**Fill in:**

- Email: `mello.neoprotocol@gmail.com` (or other)
- Name: `Mellø`
- Master Password: **STRONG** (min 12 chars)
- ✅ Create Account

**Option B: Via App**

```bash
# Wait for download to finish, then:
open -a "Bitwarden"
# Click "Create Account"
```

---

### STEP 2: CLI Login (30 sec)

```bash
# Login
bw login

# It will ask:
# Email: mello.neoprotocol@gmail.com
# Master password: ******

# Then, unlock and save session:
export BW_SESSION=$(bw unlock --raw)

# Save session (persist)
echo "export BW_SESSION=$(bw unlock --raw)" >> ~/.zshrc
```

**Test:**

```bash
bw status
# Expected: "status":"unlocked"

bw list items --search test
# Expected: [] (empty, no items yet)
```

---

### STEP 3: Migrate Secrets (2 min)

**Automatic Script:**

```bash
# Create migration script
cat > scripts/migrate-to-bitwarden.sh << 'EOF'
#!/bin/bash
set -e

echo "Migrating .env → Bitwarden..."

# Check session
if ! bw status | grep -q "unlocked"; then
    export BW_SESSION=$(bw unlock --raw)
fi

# Read .env and create items
while IFS='=' read -r key value; do
    [[ $key =~ ^#.*$ ]] && continue
    [[ -z $key ]] && continue
    
    value=$(echo "$value" | tr -d '"' | tr -d "'")
    
    echo "Creating: $key"
    bw create item \
        --session "$BW_SESSION" \
        --name "$key" \
        --notes "$value" \
        --type 2 \
        2>/dev/null || echo "  ⚠️  Already exists"
done < .env

bw sync --session "$BW_SESSION"
echo "✅ Migration complete!"
EOF

chmod +x scripts/migrate-to-bitwarden.sh

# Execute
./scripts/migrate-to-bitwarden.sh
```

---

## 🎯 DAILY USE

### Load Script (always use):

```bash
# Create script
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

**Use:**

```bash
source scripts/load-secrets-bitwarden.sh
pnpm moltbot gateway
```

---

## 📋 Quick Checklist

```text
[ ] Create Bitwarden account (web or app)
[ ] CLI Login (bw login)
[ ] Unlock (export BW_SESSION=...)
[ ] Migrate secrets (./scripts/migrate-to-bitwarden.sh)
[ ] Test load (source scripts/load-secrets-bitwarden.sh)
[ ] Verify vars (env | grep ANTHROPIC)
[ ] Test gateway (pnpm moltbot gateway)
[ ] If OK: delete .env (mv .env .env.backup)
```

---

## 🆘 Problems?

### Error: "session key is invalid"

```bash
# Re-unlock
export BW_SESSION=$(bw unlock --raw)
```

### Error: "not found"

```bash
# List items
bw list items --session "$BW_SESSION"

# Verify exact name
bw list items --search "ANTHROPIC" --session "$BW_SESSION"
```

### Error: "You are not logged in"

```bash
bw login
export BW_SESSION=$(bw unlock --raw)
```

---

## 💰 1Password Refund

If you want to request a refund from Apple:

```bash
# Open purchase page
open "https://reportaproblem.apple.com"

# Or via App Store
# App Store → Account → Purchase History
# Find 1Password → Report a Problem
# Reason: "Doesn't work as expected"
```

---

## ✅ Done!

**After setup:**

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

"Free > Paid when both work."
────────────────────────────────────────
