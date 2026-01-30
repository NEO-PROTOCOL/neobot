#!/bin/bash
# Start Moltbot Gateway with Bitwarden secrets loaded

set -e

echo "🚀 Starting Moltbot Gateway with Bitwarden secrets..."

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 22 > /dev/null 2>&1

# Check Bitwarden session
if [ -z "$BW_SESSION" ]; then
    echo "❌ BW_SESSION not set. Run: export BW_SESSION=\$(bw unlock --raw)"
    exit 1
fi

echo "🔐 Loading secrets from Bitwarden..."

# Function to get secret
get_secret() {
    local key=$1
    bw get item "$key" --session "$BW_SESSION" 2>/dev/null | jq -r '.notes // empty'
}

# Load main API keys (essenciais para gateway)
export ASI1AI_API_KEY=$(get_secret "ASI1AI_API_KEY")              # Primary (ASI1.AI)
export ANTHROPIC_API_KEY=$(get_secret "ANTHROPIC_API_KEY")        # Fallback
export TELEGRAM_BOT_TOKEN=$(get_secret "TELEGRAM_BOT_TOKEN")
export TELEGRAM_CHAT_ID=$(get_secret "TELEGRAM_CHAT_ID")

# Load NEO Protocol keys (se precisar)
# export NEO_CORE_PRIVATE_KEY=$(get_secret "NEO_CORE_PRIVATE_KEY")
# export NEO_GATEWAY_PRIVATE_KEY=$(get_secret "NEO_GATEWAY_PRIVATE_KEY")

# Verify critical keys
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "❌ ANTHROPIC_API_KEY not loaded!"
    exit 1
fi

if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo "❌ TELEGRAM_BOT_TOKEN not loaded!"
    exit 1
fi

echo "✅ Secrets loaded successfully"
echo "   ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY:0:15}..."
echo "   TELEGRAM_BOT_TOKEN: ${TELEGRAM_BOT_TOKEN:0:15}..."

# Start gateway
echo ""
echo "🦞 Starting Moltbot Gateway..."
export CLAWDBOT_GATEWAY_TOKEN=neobot
exec pnpm moltbot gateway --port 18789
