#!/bin/bash
# Load secrets from .env file into environment
set -e

echo "🔐 Carregando secrets do .env..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Arquivo .env não encontrado!"
    echo "Crie um arquivo .env na raiz do projeto com as variáveis necessárias."
    exit 1
fi

# Load .env file
set -a
source .env
set +a

# Count loaded secrets
LOADED=0
[ -n "$NOTION_API_KEY" ] && LOADED=$((LOADED + 1))
[ -n "$LINEAR_API_KEY" ] && LOADED=$((LOADED + 1))
[ -n "$ANTHROPIC_API_KEY" ] && LOADED=$((LOADED + 1))
[ -n "$TELEGRAM_BOT_TOKEN" ] && LOADED=$((LOADED + 1))

echo "✅ $LOADED secrets carregados do .env!"
echo ""
echo "Verificação rápida:"
[ -n "$NOTION_API_KEY" ] && echo "  ✓ NOTION_API_KEY: [LOADED]" || echo "  ✗ NOTION_API_KEY: [MISSING]"
[ -n "$LINEAR_API_KEY" ] && echo "  ✓ LINEAR_API_KEY: [LOADED]" || echo "  ✗ LINEAR_API_KEY: [MISSING]"
[ -n "$ANTHROPIC_API_KEY" ] && echo "  ✓ ANTHROPIC_API_KEY: [LOADED]" || echo "  ✗ ANTHROPIC_API_KEY: [MISSING]"
[ -n "$TELEGRAM_BOT_TOKEN" ] && echo "  ✓ TELEGRAM_BOT_TOKEN: [LOADED]" || echo "  ✗ TELEGRAM_BOT_TOKEN: [MISSING]"
echo ""
echo "✅ Pronto para usar!"
