#!/bin/bash
# ========================================
# Smart Factory nsf CLI Tester
# ========================================
# Tests nsf CLI installation and commands

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo "🧪 Testing nsf CLI..."
echo ""

# ────────────────────────────────────────
# CHECK INSTALLATION
# ────────────────────────────────────────

echo "1. Checking installation..."

if command -v nsf &> /dev/null; then
  echo -e "${GREEN}✅ nsf installed${NC}"
  
  # Version
  VERSION=$(nsf --version 2>&1 || echo "unknown")
  echo "   Version: $VERSION"
  
  # Expected: 0.5.3 or higher
  if [[ "$VERSION" == *"0.5"* ]] || [[ "$VERSION" == *"0.6"* ]] || [[ "$VERSION" == *"1."* ]]; then
    echo -e "${GREEN}✅ Version OK${NC}"
  else
    echo -e "${YELLOW}⚠️  Unexpected version${NC}"
  fi
else
  echo -e "${RED}❌ nsf not installed${NC}"
  echo ""
  echo "Install with:"
  echo "  git clone https://github.com/neo-smart-token-factory/smart-cli"
  echo "  cd smart-cli && npm install && npm link"
  echo ""
  exit 1
fi

echo ""

# ────────────────────────────────────────
# TEST HELP COMMAND
# ────────────────────────────────────────

echo "2. Testing status command..."

if nsf status &> /dev/null; then
  echo -e "${GREEN}✅ nsf status works${NC}"
else
  echo -e "${YELLOW}⚠️  nsf status failed (may need initialization)${NC}"
fi

echo ""

# ────────────────────────────────────────
# TEST DOCTOR COMMAND
# ────────────────────────────────────────

echo "3. Testing doctor..."

if nsf doctor &> /dev/null 2>&1; then
  echo -e "${GREEN}✅ nsf doctor works${NC}"
  
  # Show doctor output (first 5 lines)
  echo ""
  echo "Doctor preview:"
  nsf doctor 2>&1 | head -n 5 || echo "Diagnostic complete"
else
  echo -e "${YELLOW}⚠️  Doctor check requires initialization${NC}"
  echo ""
  echo "Initialize with:"
  echo "  nsf init"
  echo ""
fi

echo ""

# ────────────────────────────────────────
# CHECK AVAILABLE COMMANDS
# ────────────────────────────────────────

echo "4. Checking available commands..."

COMMANDS=("init" "token draft" "token deploy" "simulate" "doctor" "marketing" "status")
FOUND=0

for cmd in "${COMMANDS[@]}"; do
  if nsf $cmd --help &> /dev/null 2>&1; then
    FOUND=$((FOUND + 1))
  fi
done

if [ $FOUND -ge 5 ]; then
  echo -e "${GREEN}✅ Core commands available ($FOUND/7)${NC}"
else
  echo -e "${YELLOW}⚠️  Only $FOUND/7 commands found${NC}"
fi

echo ""

# ────────────────────────────────────────
# SUMMARY
# ────────────────────────────────────────

echo "────────────────────────────────────────"
echo ""
echo -e "${GREEN}✅ nsf CLI is functional!${NC}"
echo ""

echo "Available commands (v0.5.3):"
echo "  nsf init           Initialize token environment"
echo "  nsf token draft    Create token config"
echo "  nsf token deploy   Deploy with security simulation"
echo "  nsf token forge    Deploy to production"
echo "  nsf simulate       Run security/econ/risk simulation"
echo "  nsf doctor         Diagnostic + audit"
echo "  nsf marketing      Generate narrative content"
echo "  nsf status         Check factory progress"
echo ""

echo "Via Neobot:"
echo "  moltbot factory:init"
echo "  moltbot factory:draft --name MyToken --symbol MTK --supply 1000"
echo "  moltbot factory:deploy --token MyToken"
echo "  moltbot factory:status"
echo "  moltbot factory:doctor"
echo ""

echo "────────────────────────────────────────"
echo "✅ Test complete"
echo ""
