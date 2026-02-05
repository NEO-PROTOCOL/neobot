<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
      NODE VERSION FIX · NEOBOT
========================================
```

Neobot requires Node >= 22.0.0
Current: Node 20.19.6

────────────────────────────────────────

## 🔧 SOLUTION OPTIONS

### Option A: Upgrade Node (Recommended)

**Using nvm (already installed):**

```bash
# Install Node 22
nvm install 22

# Use Node 22 globally
nvm use 22

# Set as default
nvm alias default 22

# Verify
node -v
# Should show: v22.x.x
```

**Then test skills:**

```bash
cd /Users/nettomello/CODIGOS/neobot
pnpm moltbot flowcloser:health
```

────────────────────────────────────────

### Option B: Use Node 22 per-project

**Set Node 22 only for Neobot:**

```bash
cd /Users/nettomello/CODIGOS/neobot

# Use Node 22 for this session
nvm use 22

# Create .nvmrc to auto-switch
echo "22" > .nvmrc

# Now nvm will auto-use Node 22
# when you cd into neobot/
```

**Test:**

```bash
# Leave and re-enter directory
cd ..
cd neobot

# Node should auto-switch to 22
node -v
```

────────────────────────────────────────

### Option C: Test with scripts (workaround)

**Skills won't work via CLI, but scripts
will:**

```bash
# Health check (works!)
./scripts/flowcloser/check-health.sh

# Open Antigravity
./scripts/flowcloser/open-antigravity.sh
```

**Skills require Node 22+ to work via
`moltbot` CLI.**

────────────────────────────────────────

## ⚡ QUICK FIX (30 seconds)

```bash
# Install and use Node 22
nvm install 22 && nvm use 22

# Test
cd /Users/nettomello/CODIGOS/neobot
pnpm moltbot flowcloser:health
```

Expected output:

```json
{
  "success": true,
  "overall": "healthy",
  "local": {
    "environment": "local",
    "status": "down"
  },
  "production": {
    "environment": "production",
    "status": "up",
    "responseTime": "150ms"
  }
}
```

────────────────────────────────────────

## 🔍 WHY NODE 22?

Neobot uses features from Node 22:

- Native TypeScript support
- Performance improvements
- Modern ECMAScript features
- Better module resolution

────────────────────────────────────────

## 📊 CURRENT STATE

```text
[####] FlowCloser integration .... OK
[####] Skills created ............. OK
[####] Scripts work ............... OK
[####] Docs complete .............. OK
[#---] CLI skills .............. BLOCKED
       (needs Node 22+)
```

────────────────────────────────────────

## ✅ AFTER FIXING

```bash
# Install Node 22
nvm install 22 && nvm use 22

# Reinstall dependencies
cd /Users/nettomello/CODIGOS/neobot
pnpm install

# Test all skills
pnpm moltbot flowcloser:health
pnpm moltbot flowcloser:dashboard
pnpm moltbot flowcloser:qualify --leadId=test
```

────────────────────────────────────────

## 🚨 IMPORTANT

**FlowCloser (Antigravity) uses Node 20:**
- FlowCloser: Node 20.x ✅
- Neobot: Node 22.x ✅

**Use nvm to switch:**

```bash
# When working on FlowCloser
cd /CODIGOS/flowcloser-local
nvm use 20

# When working on Neobot
cd /CODIGOS/neobot
nvm use 22
```

**Or create .nvmrc in each project.**

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
