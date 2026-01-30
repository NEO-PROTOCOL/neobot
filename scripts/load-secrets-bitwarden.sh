#!/bin/bash
# Load secrets from Bitwarden into environment
set -e

# Check session
if [ -z "$BW_SESSION" ]; then
    echo "🔓 Desbloqueando Bitwarden..."
    export BW_SESSION=$(bw unlock --raw)
    
    if [ -z "$BW_SESSION" ]; then
        echo "❌ Falha ao desbloquear"
        exit 1
    fi
    
    echo "✅ Desbloqueado!"
fi

# Verify status
if ! bw status --session "$BW_SESSION" | grep -q "unlocked"; then
    echo "❌ Vault não está desbloqueado"
    echo "Execute: export BW_SESSION=\$(bw unlock --raw)"
    exit 1
fi

echo "🔐 Carregando secrets do Bitwarden..."

# Function to get secret
get_secret() {
    local key=$1
    bw get item "$key" --session "$BW_SESSION" 2>/dev/null | jq -r '.notes // empty'
}

# Load main API keys
export ANTHROPIC_API_KEY=$(get_secret "ANTHROPIC_API_KEY")
export TELEGRAM_BOT_TOKEN=$(get_secret "TELEGRAM_BOT_TOKEN")
export TELEGRAM_CHAT_ID=$(get_secret "TELEGRAM_CHAT_ID")

# Load NEO Protocol keys
export NEO_CORE_PRIVATE_KEY=$(get_secret "NEO_CORE_PRIVATE_KEY")
export NEO_GATEWAY_PRIVATE_KEY=$(get_secret "NEO_GATEWAY_PRIVATE_KEY")
export NEO_SKILLS_PRIVATE_KEY=$(get_secret "NEO_SKILLS_PRIVATE_KEY")
export NEO_FACTORY_PRIVATE_KEY=$(get_secret "NEO_FACTORY_PRIVATE_KEY")
export NEO_FLOWPAY_PRIVATE_KEY=$(get_secret "NEO_FLOWPAY_PRIVATE_KEY")
export NEO_ASI1_PRIVATE_KEY=$(get_secret "NEO_ASI1_PRIVATE_KEY")
export NEO_TELEGRAM_PRIVATE_KEY=$(get_secret "NEO_TELEGRAM_PRIVATE_KEY")
export NEO_WHATSAPP_PRIVATE_KEY=$(get_secret "NEO_WHATSAPP_PRIVATE_KEY")
export NEO_IPFS_PRIVATE_KEY=$(get_secret "NEO_IPFS_PRIVATE_KEY")

# Count loaded secrets
LOADED=0
[ -n "$ANTHROPIC_API_KEY" ] && LOADED=$((LOADED + 1))
[ -n "$TELEGRAM_BOT_TOKEN" ] && LOADED=$((LOADED + 1))
[ -n "$ASI1AI_API_KEY" ] && LOADED=$((LOADED + 1))
[ -n "$NEO_CORE_PRIVATE_KEY" ] && LOADED=$((LOADED + 1))

echo "✅ $LOADED secrets carregados!"
echo ""
echo "Verificação rápida:"
echo "  ANTHROPIC_API_KEY: ${ANTHROPIC_API_KEY:0:20}..."
echo "  TELEGRAM_BOT_TOKEN: ${TELEGRAM_BOT_TOKEN:0:20}..."
echo "  NEO_CORE_PRIVATE_KEY: ${NEO_CORE_PRIVATE_KEY:0:20}..."
echo ""
echo "✅ Pronto para usar!"
