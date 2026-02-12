#!/bin/bash

# FlowPay Integration Test
# Testa se a integração FlowPay está funcionando

set -e

echo "🧪 FlowPay Integration Test"
echo "============================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Load .env
if [ -f .env ]; then
    source .env
fi

# Check local environment
echo "1️⃣  Verificando variáveis locais..."
echo ""

check_var() {
    local var_name=$1
    local var_value=${!var_name}
    
    if [ -z "$var_value" ]; then
        echo -e "${RED}❌ $var_name${NC} - NÃO CONFIGURADA"
        return 1
    else
        echo -e "${GREEN}✅ $var_name${NC} - OK (${#var_value} chars)"
        return 0
    fi
}

# Check TOKEN_SECRET (padrão do projeto original FlowPay)
check_token_secret() {
    if [ ! -z "$TOKEN_SECRET" ]; then
        echo -e "${GREEN}✅ TOKEN_SECRET${NC} - OK (${#TOKEN_SECRET} chars)"
        return 0
    elif [ ! -z "$FLOWPAY_JWT_SECRET" ]; then
        echo -e "${YELLOW}⚠️  FLOWPAY_JWT_SECRET${NC} - OK (legacy, recomenda-se TOKEN_SECRET)"
        return 0
    else
        echo -e "${RED}❌ TOKEN_SECRET ou FLOWPAY_JWT_SECRET${NC} - NÃO CONFIGURADA"
        return 1
    fi
}

errors=0

check_var "FLOWPAY_API_URL" || ((errors++))
check_var "FLOWPAY_API_KEY" || ((errors++))
check_token_secret || ((errors++))
check_var "FLOWPAY_SIGNATURE_SECRET" || ((errors++))
check_var "WOOVI_API_KEY" || ((errors++))
check_var "WOOVI_WEBHOOK_SECRET" || ((errors++))

echo ""

if [ $errors -gt 0 ]; then
    echo -e "${RED}❌ $errors variável(is) faltando!${NC}"
    echo ""
    echo "Configure em .env conforme docs/integrations/flowpay/ENV_VARIABLES_GUIDE.md"
    exit 1
fi

echo -e "${GREEN}✅ Todas as variáveis locais configuradas!${NC}"
echo ""

# Test Railway service
echo "2️⃣  Testando FlowPay Railway Service..."
echo ""

RAILWAY_URL="${FLOWPAY_API_URL:-https://flowpay-production-10d8.up.railway.app}"

echo "URL: $RAILWAY_URL"
echo ""

# Health check
echo "Testing service availability..."
health_response=$(curl -s -w "\n%{http_code}" "$RAILWAY_URL/" 2>/dev/null || echo "000")
http_code=$(echo "$health_response" | tail -n 1)
body=$(echo "$health_response" | head -n 1)

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ Health check OK${NC}"
    echo "Response: $body"
else
    echo -e "${RED}❌ Health check FAILED (HTTP $http_code)${NC}"
    echo "Response: $body"
    echo ""
    echo "Possíveis causas:"
    echo "  - Railway service está down"
    echo "  - URL incorreta"
    echo "  - Timeout de rede"
    exit 1
fi

echo ""

# Test create-charge endpoint
echo "3️⃣  Testando endpoint de criação de cobrança..."
echo ""

test_charge_payload='{
  "wallet": "0x0000000000000000000000000000000000000000",
  "valor": 1.00,
  "moeda": "BRL",
  "id_transacao": "test-'$(date +%s)'",
  "product_id": "integration-test"
}'

echo "Payload:"
echo "$test_charge_payload" | jq . 2>/dev/null || echo "$test_charge_payload"
echo ""

charge_response=$(curl -s -w "\n%{http_code}" -X POST \
  "$RAILWAY_URL/api/create-charge" \
  -H "Content-Type: application/json" \
  -d "$test_charge_payload" 2>/dev/null || echo '{"error":"curl failed"}\n000')

http_code=$(echo "$charge_response" | tail -n 1)
body=$(echo "$charge_response" | sed '$d')

if [ "$http_code" = "200" ]; then
    echo -e "${GREEN}✅ Create charge OK${NC}"
    echo ""
    echo "Response:"
    echo "$body" | jq . 2>/dev/null || echo "$body"
    
    # Check if success=true
    success=$(echo "$body" | jq -r '.success' 2>/dev/null || echo "unknown")
    if [ "$success" = "true" ]; then
        echo ""
        echo -e "${GREEN}🎉 Cobrança PIX criada com sucesso!${NC}"
        
        # Extract QR code
        qr_code=$(echo "$body" | jq -r '.pix_data.qr_code // .qr_code_url // empty' 2>/dev/null)
        if [ -n "$qr_code" ]; then
            echo ""
            echo "QR Code: $qr_code"
        fi
    else
        error_msg=$(echo "$body" | jq -r '.error // empty' 2>/dev/null)
        echo ""
        echo -e "${YELLOW}⚠️  API retornou success=false${NC}"
        if [ -n "$error_msg" ]; then
            echo "Erro: $error_msg"
        fi
    fi
else
    echo -e "${RED}❌ Create charge FAILED (HTTP $http_code)${NC}"
    echo ""
    echo "Response:"
    echo "$body" | jq . 2>/dev/null || echo "$body"
    echo ""
    
    # Check for common errors
    if echo "$body" | grep -q "WOOVI_API_KEY"; then
        echo -e "${YELLOW}💡 Dica: Configure WOOVI_API_KEY no Railway${NC}"
    elif echo "$body" | grep -q "unauthorized\|401"; then
        echo -e "${YELLOW}💡 Dica: Verifique WOOVI_API_KEY no Railway${NC}"
    fi
fi

echo ""
echo "============================"
echo "✅ Teste completo!"
echo ""
echo "Próximos passos:"
echo "  1. Se health OK mas create-charge falhou:"
echo "     → Configure WOOVI_API_KEY no Railway"
echo "  2. Se tudo OK:"
echo "     → Teste via Neobot agent tool"
echo "  3. Documentação:"
echo "     → docs/integrations/flowpay/ENV_VARIABLES_GUIDE.md"
