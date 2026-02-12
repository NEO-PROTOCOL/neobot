#!/bin/bash
# Health check for FlowCloser (local + production)

set -e

echo "🔍 Checking FlowCloser health..."
echo ""

# Local
echo "📍 Local (localhost:8042):"
if curl -sf http://localhost:8042/health > /dev/null 2>&1; then
  echo "✅ UP"
  curl -s http://localhost:8042/health | jq 2>/dev/null || curl -s http://localhost:8042/health
else
  echo "❌ DOWN"
fi

echo ""

# Production
echo "🌐 Production (Railway):"
PROD_URL="https://flowcloser-agent-production.up.railway.app/health"
if curl -sf "$PROD_URL" > /dev/null 2>&1; then
  echo "✅ UP"
  curl -s "$PROD_URL" | jq 2>/dev/null || curl -s "$PROD_URL"
else
  echo "❌ DOWN"
fi

echo ""
echo "✅ Health check complete"
