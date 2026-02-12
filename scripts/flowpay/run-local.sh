#!/bin/bash
# ========================================
# FlowPay Local Development Server
# ========================================
# Runs FlowPay in development mode

set -e

FLOWPAY_PATH="/Users/nettomello/CODIGOS/flowpay"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo ""
echo "🚀 Starting FlowPay local dev server..."
echo ""

# ────────────────────────────────────────
# CHECK IF FLOWPAY EXISTS
# ────────────────────────────────────────

if [ ! -d "$FLOWPAY_PATH" ]; then
  echo -e "${RED}❌ FlowPay not found at: $FLOWPAY_PATH${NC}"
  echo ""
  echo "Expected location:"
  echo "  /Users/nettomello/CODIGOS/flowpay"
  echo ""
  exit 1
fi

# ────────────────────────────────────────
# CHECK IF PORT 4321 IS AVAILABLE
# ────────────────────────────────────────

if lsof -Pi :4321 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo -e "${YELLOW}⚠️  Port 4321 already in use${NC}"
  echo ""
  echo "Kill existing process? (y/n)"
  read -r response
  
  if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "Killing process on port 4321..."
    lsof -ti:4321 | xargs kill -9
    echo "✅ Process killed"
    sleep 1
  else
    echo "❌ Aborted"
    exit 1
  fi
fi

# ────────────────────────────────────────
# CHECK .env FILE
# ────────────────────────────────────────

if [ ! -f "$FLOWPAY_PATH/.env" ]; then
  echo -e "${YELLOW}⚠️  No .env file found${NC}"
  echo ""
  echo "Creating from .env.example..."
  
  if [ -f "$FLOWPAY_PATH/.env.example" ]; then
    cp "$FLOWPAY_PATH/.env.example" "$FLOWPAY_PATH/.env"
    echo "✅ .env created"
    echo ""
    echo -e "${YELLOW}IMPORTANT: Edit .env and add your API keys!${NC}"
    echo ""
  else
    echo -e "${RED}❌ No .env.example found${NC}"
    exit 1
  fi
fi

# ────────────────────────────────────────
# START DEV SERVER
# ────────────────────────────────────────

cd "$FLOWPAY_PATH"

echo -e "${GREEN}✅ Starting FlowPay...${NC}"
echo ""
echo "Location: $FLOWPAY_PATH"
echo "Port: 4321"
echo "URL: http://localhost:4321"
echo ""
echo "────────────────────────────────────────"
echo ""

# Run dev server
pnpm dev

# Note: This blocks until Ctrl+C
# Server logs will appear below
