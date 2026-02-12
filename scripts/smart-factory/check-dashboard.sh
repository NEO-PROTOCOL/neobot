#!/bin/bash
# ========================================
# Smart Factory Dashboard Health Check
# ========================================
# Checks all 3 Vercel deployments

set -e

echo ""
echo "🔍 Checking Smart Factory dashboards..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ────────────────────────────────────────
# DASHBOARD (MAIN UI)
# ────────────────────────────────────────

echo "📊 Dashboard (smart-ui):"

if curl -sf https://smart-ui-delta.vercel.app > /dev/null 2>&1; then
  echo -e "${GREEN}✅ UP${NC}"
  echo "   URL: https://smart-ui-delta.vercel.app"
else
  echo -e "${RED}❌ DOWN${NC}"
  echo "   Check: https://vercel.com/neo-smart-factory/smart-ui"
fi

echo ""

# ────────────────────────────────────────
# LANDING PAGE
# ────────────────────────────────────────

echo "🌐 Landing Page:"

if curl -sf https://landing-jet-seven.vercel.app > /dev/null 2>&1; then
  echo -e "${GREEN}✅ UP${NC}"
  echo "   URL: https://landing-jet-seven.vercel.app"
else
  echo -e "${RED}❌ DOWN${NC}"
  echo "   Check: https://vercel.com/neo-smart-factory/smart-ui-landing"
fi

echo ""

# ────────────────────────────────────────
# MOBILE APP (TELEGRAM)
# ────────────────────────────────────────

echo "📱 Mobile App (Telegram):"

if curl -sf https://nuxt-app-vert.vercel.app > /dev/null 2>&1; then
  echo -e "${GREEN}✅ UP${NC}"
  echo "   URL: https://nuxt-app-vert.vercel.app"
else
  echo -e "${RED}❌ DOWN${NC}"
  echo "   Check: https://vercel.com/neo-smart-factory/smart-ui-mobile"
fi

echo ""

# ────────────────────────────────────────
# VERCEL STATUS
# ────────────────────────────────────────

echo "☁️  Vercel Status:"

if curl -sf https://www.vercel-status.com > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Operational${NC}"
else
  echo -e "${YELLOW}⚠️  Check: https://www.vercel-status.com${NC}"
fi

echo ""

# ────────────────────────────────────────
# BLOCKCHAIN RPCS
# ────────────────────────────────────────

echo "⛓️  Blockchain RPCs:"

# Base RPC
if curl -sf https://mainnet.base.org > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Base RPC UP${NC}"
else
  echo -e "${RED}❌ Base RPC DOWN${NC}"
fi

# Polygon RPC
if curl -sf https://polygon-rpc.com > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Polygon RPC UP${NC}"
else
  echo -e "${RED}❌ Polygon RPC DOWN${NC}"
fi

echo ""
echo "────────────────────────────────────────"
echo "✅ Health check complete"
echo ""
echo "Open dashboard:"
echo "  open https://smart-ui-delta.vercel.app"
echo ""
