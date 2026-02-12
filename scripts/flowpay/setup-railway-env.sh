#!/bin/bash

# FlowPay Railway Environment Setup
# Configura variáveis de ambiente no Railway

set -e

echo "🚀 FlowPay Railway Environment Setup"
echo "======================================"
echo ""

# Check if railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo "❌ Railway CLI não encontrado!"
    echo ""
    echo "Instale com:"
    echo "  npm install -g @railway/cli"
    echo ""
    echo "Ou configure manualmente no dashboard:"
    echo "  https://railway.app/project/YOUR_PROJECT_ID/settings"
    exit 1
fi

# Check if logged in
echo "Verificando login Railway..."
if ! railway whoami &> /dev/null; then
    echo "❌ Não logado no Railway!"
    echo ""
    echo "Faça login com:"
    echo "  railway login"
    exit 1
fi

echo "✅ Railway CLI configurado"
echo ""

# Load .env variables
if [ ! -f .env ]; then
    echo "❌ Arquivo .env não encontrado!"
    echo "Execute este script do diretório do Neobot"
    exit 1
fi

source .env

echo "📋 Configurando variáveis no Railway..."
echo ""

# Set variables
echo "Setting WOOVI_API_KEY..."
railway variables --set WOOVI_API_KEY="$WOOVI_API_KEY"

echo "Setting WOOVI_WEBHOOK_SECRET..."
railway variables --set WOOVI_WEBHOOK_SECRET="$WOOVI_WEBHOOK_SECRET"

echo "Setting JWT_SECRET (using FLOWPAY_JWT_SECRET)..."
railway variables --set JWT_SECRET="$FLOWPAY_JWT_SECRET"

echo ""
echo "✅ Variáveis configuradas com sucesso!"
echo ""
echo "⏳ Railway irá fazer re-deploy automático em ~2 minutos"
echo ""
echo "Verifique o status em:"
echo "  railway status"
echo ""
echo "Ou acesse o dashboard:"
echo "  railway open"
