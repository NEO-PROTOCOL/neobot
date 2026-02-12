#!/bin/bash
# ========================================
# FlowPay Health Check
# ========================================
# Checks FlowPay Gateway health (local + production)

set -e

echo ""
echo "🔍 Checking FlowPay health..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ────────────────────────────────────────
# LOCAL HEALTH CHECK
# ────────────────────────────────────────

echo "📍 Local (localhost:4321):"

if curl -sf http://localhost:4321/health > /dev/null 2>&1; then
  echo -e "${GREEN}✅ UP${NC}"
  
  # Show health data if available
  if command -v jq &> /dev/null; then
    curl -s http://localhost:4321/health | jq
  else
    curl -s http://localhost:4321/health
  fi
else
  echo -e "${RED}❌ DOWN${NC}"
  echo "   Hint: Run 'pnpm dev' in /CODIGOS/flowpay/"
fi

echo ""

# ────────────────────────────────────────
# PRODUCTION HEALTH CHECK
# ────────────────────────────────────────

echo "🌐 Production (Railway):"

if curl -sf https://flowpay-production-10d8.up.railway.app/ > /dev/null 2>&1; then
  echo -e "${GREEN}✅ UP${NC}"
  
  # Show health data if available
  if command -v jq &> /dev/null; then
    curl -s https://flowpay-production-10d8.up.railway.app/ | jq
  else
    curl -s https://flowpay-production-10d8.up.railway.app/
  fi
else
  echo -e "${RED}❌ DOWN${NC}"
  echo "   Check: https://railway.app/dashboard"
fi

echo ""

# ────────────────────────────────────────
# WOOVI API HEALTH CHECK
# ────────────────────────────────────────

echo "💰 Woovi API:"

if curl -sf https://api.openpix.com.br/api/v1/health > /dev/null 2>&1; then
  echo -e "${GREEN}✅ UP${NC}"
else
  echo -e "${YELLOW}⚠️  Unknown${NC}"
  echo "   Check: https://status.openpix.com.br"
fi

echo ""
echo "────────────────────────────────────────"
echo "✅ Health check complete"
echo ""
