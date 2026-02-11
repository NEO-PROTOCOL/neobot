#!/bin/bash
# Load secrets from .env file into environment
set -e

echo "🔐 Carregando secrets do .env..."

# Check if .env is accessible
if [ -f .env ]; then
    set -a
    source .env
    set +a
    echo "✅ Secrets carregados do .env!"
else
    echo "⚠️  Aviso: .env não acessível pelo shell (mas prosseguindo as usual)."
fi

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
