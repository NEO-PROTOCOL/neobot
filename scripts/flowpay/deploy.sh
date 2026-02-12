#!/bin/bash
# ========================================
# FlowPay Deploy Script
# ========================================
# Deploys FlowPay to Netlify

set -e

FLOWPAY_PATH="/Users/nettomello/CODIGOS/flowpay"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo "🚀 Deploying FlowPay to Netlify..."
echo ""

# ────────────────────────────────────────
# CHECK IF FLOWPAY EXISTS
# ────────────────────────────────────────

if [ ! -d "$FLOWPAY_PATH" ]; then
  echo -e "${RED}❌ FlowPay not found at: $FLOWPAY_PATH${NC}"
  exit 1
fi

cd "$FLOWPAY_PATH"

# ────────────────────────────────────────
# CHECK GIT STATUS
# ────────────────────────────────────────

echo "Checking Git status..."
echo ""

if [[ -n $(git status -s) ]]; then
  echo -e "${YELLOW}⚠️  You have uncommitted changes:${NC}"
  echo ""
  git status -s
  echo ""
  echo "Commit changes before deploying? (y/n)"
  read -r response
  
  if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    echo "Commit message:"
    read -r commit_message
    
    git add .
    git commit -m "$commit_message"
    echo -e "${GREEN}✅ Changes committed${NC}"
  else
    echo -e "${YELLOW}⚠️  Deploying with uncommitted changes${NC}"
  fi
fi

echo ""

# ────────────────────────────────────────
# PUSH TO GITHUB
# ────────────────────────────────────────

echo "Pushing to GitHub..."
echo ""

CURRENT_BRANCH=$(git branch --show-current)

git push origin "$CURRENT_BRANCH"

echo -e "${GREEN}✅ Pushed to GitHub${NC}"
echo ""

# ────────────────────────────────────────
# NETLIFY AUTO-DEPLOY
# ────────────────────────────────────────

echo "────────────────────────────────────────"
echo ""
echo "🎉 Deploy initiated!"
echo ""
echo "Netlify will automatically deploy from GitHub."
echo ""
echo "Monitor deploy:"
echo "  Dashboard: https://app.netlify.com/sites/flowpaypix/deploys"
echo "  CLI: netlify logs --stream"
echo ""
echo "Production URL (in ~2 min):"
echo "  https://flowpaypix.netlify.app"
echo ""

# ────────────────────────────────────────
# OPTIONAL: WAIT FOR DEPLOY
# ────────────────────────────────────────

echo "Wait for deploy to complete? (y/n)"
read -r response

if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
  echo ""
  echo "Waiting for deploy..."
  echo "(This may take 2-3 minutes)"
  echo ""
  
  # Check every 10 seconds for up to 5 minutes
  MAX_ATTEMPTS=30
  ATTEMPT=0
  
  while [ $ATTEMPT -lt $MAX_ATTEMPTS ]; do
    if curl -sf https://flowpaypix.netlify.app/health > /dev/null 2>&1; then
      echo ""
      echo -e "${GREEN}✅ Deploy complete!${NC}"
      echo ""
      echo "Production is live:"
      echo "  https://flowpaypix.netlify.app"
      echo ""
      
      # Health check
      curl -s https://flowpaypix.netlify.app/health | jq '.' 2>/dev/null || echo "Health OK"
      echo ""
      
      break
    fi
    
    ATTEMPT=$((ATTEMPT + 1))
    echo "Attempt $ATTEMPT/$MAX_ATTEMPTS... (waiting 10s)"
    sleep 10
  done
  
  if [ $ATTEMPT -eq $MAX_ATTEMPTS ]; then
    echo ""
    echo -e "${YELLOW}⚠️  Deploy taking longer than expected${NC}"
    echo ""
    echo "Check dashboard:"
    echo "  https://app.netlify.com/sites/flowpaypix/deploys"
    echo ""
  fi
else
  echo ""
  echo "Deploy in progress. Check dashboard for status."
  echo ""
fi

echo "────────────────────────────────────────"
echo "✅ Deploy script complete"
echo ""
