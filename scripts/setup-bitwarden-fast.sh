#!/bin/bash
# Setup Bitwarden RÁPIDO - Sem perder tempo
set -e

echo "🔐 Bitwarden Setup RÁPIDO"
echo "========================="
echo ""

# Check CLI
if ! command -v bw &> /dev/null; then
    echo "❌ CLI não instalado. Instalando..."
    brew install bitwarden-cli
fi

echo "✅ Bitwarden CLI $(bw --version)"
echo ""

# Check if logged in
if bw status | grep -q '"status":"unlocked"'; then
    echo "✅ Já está logado e desbloqueado!"
    bw sync
    echo "✅ Vault sincronizado"
    exit 0
fi

if bw status | grep -q '"status":"locked"'; then
    echo "🔓 Vault trancado. Desbloqueando..."
    echo "Digite sua master password:"
    BW_SESSION=$(bw unlock --raw)
    export BW_SESSION
    echo "export BW_SESSION=\"$BW_SESSION\"" > ~/.bitwarden-session
    echo "✅ Desbloqueado! Session salva em ~/.bitwarden-session"
    exit 0
fi

# Not logged in
echo "📝 Primeira vez no Bitwarden CLI"
echo ""
echo "OPÇÃO 1: JÁ TEM CONTA"
echo "  bw login"
echo ""
echo "OPÇÃO 2: CRIAR CONTA AGORA"
echo "  1. Abra: https://vault.bitwarden.com/#/register"
echo "  2. Email: mello.neoprotocol@gmail.com (ou outro)"
echo "  3. Master Password: [FORTE - min 12 chars]"
echo "  4. Depois: bw login"
echo ""
echo "OPÇÃO 3: CRIAR VIA APP"
echo "  1. Abra app Bitwarden"
echo "  2. Create Account"
echo "  3. Depois: bw login no terminal"
