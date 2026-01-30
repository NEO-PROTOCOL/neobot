#!/bin/bash
# Setup 1Password CLI integration
# Run this once to configure 1Password CLI

set -e

echo "🔐 1Password CLI Setup"
echo "====================="
echo ""

# Check if CLI is installed
if ! command -v op &> /dev/null; then
    echo "❌ 1Password CLI not found. Installing..."
    brew install 1password-cli
    echo "✅ CLI installed!"
    echo ""
fi

echo "Current CLI version:"
op --version
echo ""

# Check if already signed in
if op account list &> /dev/null && [ -n "$(op account list)" ]; then
    echo "✅ Already have accounts configured:"
    op account list
    echo ""
    echo "Testing connection..."
    if op whoami &> /dev/null; then
        echo "✅ Connected and authenticated!"
        op whoami
        exit 0
    else
        echo "⚠️  Account exists but not signed in."
        echo "Attempting to sign in..."
        op signin
        exit 0
    fi
fi

# No accounts configured
echo "⚠️  No 1Password accounts configured."
echo ""
echo "📱 IMPORTANTE: Abra o app 1Password primeiro!"
echo ""
echo "Para conectar o CLI com o App 1Password:"
echo ""
echo "1️⃣  Abra o app 1Password"
echo "2️⃣  Vá para: Settings (⌘,)"
echo "3️⃣  Clique na aba 'Developer'"
echo "4️⃣  ✅ Marque 'Connect with 1Password CLI'"
echo "5️⃣  ✅ Marque 'Use Touch ID' (opcional mas recomendado)"
echo ""
echo "Depois de fazer isso, o CLI conectará automaticamente!"
echo ""
echo "Teste com: op account list"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Alternativa: Sign in manualmente"
echo "Se preferir não usar app integration:"
echo ""
echo "  op account add"
echo ""
echo "E siga os prompts interativos."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
