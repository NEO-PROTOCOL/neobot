#!/bin/bash
# ========================================
# FlowPay Webhook Tester
# ========================================
# Tests Woovi webhook locally

set -e

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo ""
echo "🧪 Testing FlowPay webhook..."
echo ""

# ────────────────────────────────────────
# CONFIGURATION
# ────────────────────────────────────────

# Default to local
BASE_URL=${1:-"http://localhost:4321"}
WEBHOOK_URL="$BASE_URL/api/webhooks/pix"

# Test charge ID
CHARGE_ID="test-$(date +%s)"

echo "Configuration:"
echo "  Base URL: $BASE_URL"
echo "  Webhook: $WEBHOOK_URL"
echo "  Charge ID: $CHARGE_ID"
echo ""

# ────────────────────────────────────────
# TEST PAYLOAD
# ────────────────────────────────────────

PAYLOAD=$(cat <<EOF
{
  "event": "CHARGE_COMPLETED",
  "charge": {
    "correlationID": "$CHARGE_ID",
    "value": 9990,
    "status": "COMPLETED",
    "paidAt": "$(date -u +%Y-%m-%dT%H:%M:%S.000Z)",
    "customer": {
      "taxID": {
        "taxID": "12345678900"
      }
    }
  }
}
EOF
)

echo "Payload:"
echo "$PAYLOAD" | jq '.' 2>/dev/null || echo "$PAYLOAD"
echo ""

# ────────────────────────────────────────
# SEND WEBHOOK
# ────────────────────────────────────────

echo "Sending webhook..."
echo ""

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "x-woovi-signature: test-signature" \
  -d "$PAYLOAD")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

# ────────────────────────────────────────
# CHECK RESPONSE
# ────────────────────────────────────────

echo "Response:"
echo "  HTTP Code: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
  echo -e "${GREEN}✅ Webhook accepted${NC}"
  echo ""
  echo "Body:"
  echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
  echo ""
  
  # Check if unlock was triggered
  echo "────────────────────────────────────────"
  echo ""
  echo "Next steps:"
  echo "  1. Check Neobot logs for unlock trigger"
  echo "  2. Verify UNLOCK_RECEIPT created:"
  echo "     ls data/flowpay/receipts/"
  echo "  3. Check Ledger entry:"
  echo "     cat data/ledger/*.jsonl | grep '$CHARGE_ID'"
  echo ""
  
elif [ "$HTTP_CODE" = "401" ]; then
  echo -e "${RED}❌ Unauthorized (signature invalid)${NC}"
  echo ""
  echo "Hint: Signature validation may be enabled"
  echo "      Check WOOVI_WEBHOOK_SECRET in .env"
  echo ""
  
elif [ "$HTTP_CODE" = "404" ]; then
  echo -e "${RED}❌ Not Found (endpoint missing)${NC}"
  echo ""
  echo "Hint: Is FlowPay running?"
  echo "      Run: ./scripts/flowpay/run-local.sh"
  echo ""
  
else
  echo -e "${RED}❌ Webhook failed${NC}"
  echo ""
  echo "Body:"
  echo "$BODY"
  echo ""
fi

# ────────────────────────────────────────
# USAGE EXAMPLES
# ────────────────────────────────────────

echo "────────────────────────────────────────"
echo ""
echo "Usage examples:"
echo ""
echo "  # Test local"
echo "  ./scripts/flowpay/test-webhook.sh"
echo ""
echo "  # Test production"
echo "  ./scripts/flowpay/test-webhook.sh https://flowpaypix.netlify.app"
echo ""
echo "  # Test ngrok tunnel"
echo "  ./scripts/flowpay/test-webhook.sh https://abc123.ngrok.io"
echo ""
