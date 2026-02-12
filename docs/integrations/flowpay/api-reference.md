<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 MD041-->

```text
========================================
       FLOWPAY · API REFERENCE
========================================
```

Complete API documentation for FlowPay
Gateway endpoints and Neobot skills.

────────────────────────────────────────

## Base URLs

```text
▓▓▓ ENVIRONMENTS
────────────────────────────────────────
Local:      http://localhost:4321
Production: https://flowpaypix.netlify.app
Neobot:     http://localhost:8080 (or deployed)
```

────────────────────────────────────────

## FlowPay Endpoints

### POST /api/charges/create

Create a PIX charge.

**Request:**

```json
{
  "amount_brl": 99.90,
  "product_ref": "smart-factory-basic",
  "customer_ref": "12345678900",
  "customer_email": "customer@example.com"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "charge": {
    "charge_id": "abc123def456",
    "correlation_id": "abc123def456",
    "amount_brl": 99.90,
    "qr_code": "data:image/png;base64,iVBORw0KGgo...",
    "pix_copy_paste": "00020126580014br.gov.bcb.pix...",
    "expires_at": "2026-01-30T15:30:00.000Z",
    "status": "pending"
  }
}
```

**Response (400 Bad Request):**

```json
{
  "error": "Invalid amount",
  "message": "amount_brl must be > 0.01"
}
```

**Response (500 Internal Error):**

```json
{
  "error": "Woovi API error",
  "message": "Failed to create charge"
}
```

────────────────────────────────────────

### GET /api/charges/status

Check payment status.

**Query Params:**

- `charge_id` (required): Charge ID

**Example:**

```bash
GET /api/charges/status?charge_id=abc123def456
```

**Response (200 OK):**

```json
{
  "success": true,
  "charge_id": "abc123def456",
  "status": "completed",
  "paid_at": "2026-01-30T14:35:00.000Z",
  "amount_brl": 99.90
}
```

**Possible statuses:**

- `pending`: Awaiting payment
- `completed`: Payment confirmed
- `expired`: Charge expired (15min timeout)
- `cancelled`: Manually cancelled

────────────────────────────────────────

### POST /api/webhooks/pix

Woovi webhook (internal, signature-protected).

**Headers:**

- `x-woovi-signature`: HMAC signature

**Request Body:**

```json
{
  "event": "CHARGE_COMPLETED",
  "charge": {
    "correlationID": "abc123def456",
    "value": 9990,
    "status": "COMPLETED",
    "paidAt": "2026-01-30T14:35:00.000Z",
    "customer": {
      "taxID": {
        "taxID": "12345678900"
      }
    }
  }
}
```

**Response (200 OK):**

```json
{
  "success": true
}
```

**Side Effects:**

- Triggers Neobot `flowpay:unlock` skill
- Generates UNLOCK_RECEIPT
- Sends customer notification

────────────────────────────────────────

### POST /api/access/unlock

Unlock access (called by Neobot).

**Request:**

```json
{
  "charge_id": "abc123def456",
  "amount_brl": 99.90,
  "product_ref": "smart-factory-basic",
  "customer_ref": "12345678900"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "receipt_id": "550e8400-e29b-41d4-a716-446655440000",
  "unlock_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_at": "2026-04-30T14:30:00.000Z"
}
```

────────────────────────────────────────

## Neobot Skills

### flowpay:buy

Create PIX charge.

**CLI Usage:**

```bash
moltbot flowpay:buy \
  --amount_brl 99.90 \
  --product_ref "smart-factory-basic" \
  --customer_ref "12345678900"
```

**Skill Response:**

```json
{
  "success": true,
  "charge_id": "abc123def456",
  "qr_code": "data:image/png;base64,...",
  "pix_copy_paste": "00020126580014br.gov.bcb.pix...",
  "expires_at": "2026-01-30T15:30:00.000Z"
}
```

**Ledger Entry:**

```json
{
  "action": "create_pix_charge",
  "actor": "user",
  "channel": "cli",
  "details": {
    "charge_id": "abc123def456",
    "amount_brl": 99.90,
    "product_ref": "smart-factory-basic"
  },
  "timestamp": "2026-01-30T14:30:00.000Z"
}
```

────────────────────────────────────────

### flowpay:status

Check payment status.

**CLI Usage:**

```bash
moltbot flowpay:status \
  --charge_id "abc123def456"
```

**Skill Response:**

```json
{
  "success": true,
  "charge_id": "abc123def456",
  "status": "completed",
  "paid_at": "2026-01-30T14:35:00.000Z"
}
```

**Ledger Entry:**

```json
{
  "action": "check_payment_status",
  "actor": "user",
  "channel": "cli",
  "details": {
    "charge_id": "abc123def456",
    "status": "completed"
  },
  "timestamp": "2026-01-30T14:36:00.000Z"
}
```

────────────────────────────────────────

### flowpay:unlock

Generate UNLOCK_RECEIPT (webhook-triggered).

**CLI Usage (manual trigger):**

```bash
moltbot flowpay:unlock \
  --charge_id "abc123def456"
```

**Skill Response:**

```json
{
  "success": true,
  "receipt_id": "550e8400-e29b-41d4-a716-446655440000",
  "unlock_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "product_ref": "smart-factory-basic",
  "customer_ref": "12345678900",
  "expires_at": "2026-04-30T14:30:00.000Z",
  "file": "data/flowpay/receipts/550e8400-e29b-41d4-a716-446655440000.json"
}
```

**UNLOCK_RECEIPT File:**

Saved to: `data/flowpay/receipts/{receipt_id}.json`

```json
{
  "receipt_id": "550e8400-e29b-41d4-a716-446655440000",
  "charge_id": "abc123def456",
  "amount_brl": 99.90,
  "product_ref": "smart-factory-basic",
  "customer_ref": "12345678900",
  "unlock_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_materialization": {
    "chain": "base",
    "contract": null,
    "token_id": null,
    "tx_hash": null,
    "status": "pending"
  },
  "created_at": "2026-01-30T14:35:00.000Z",
  "expires_at": "2026-04-30T14:35:00.000Z"
}
```

**Ledger Entry:**

```json
{
  "action": "unlock_access",
  "actor": "webhook",
  "channel": "woovi",
  "details": {
    "receipt_id": "550e8400-e29b-41d4-a716-446655440000",
    "charge_id": "abc123def456",
    "product_ref": "smart-factory-basic"
  },
  "timestamp": "2026-01-30T14:35:00.000Z"
}
```

────────────────────────────────────────

## Authentication

### JWT Token

**Structure:**

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "receipt_id": "550e8400-e29b-41d4-a716-446655440000",
    "charge_id": "abc123def456",
    "product_ref": "smart-factory-basic",
    "customer_ref": "12345678900",
    "amount_brl": 99.90,
    "iat": 1706630400,
    "exp": 1709222400
  }
}
```

**Validation:**

```typescript
import jwt from 'jsonwebtoken';

function validateToken(token: string) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { valid: true, payload: decoded };
  } catch (error) {
    return { valid: false, error: error.message };
  }
}
```

────────────────────────────────────────

## Error Codes

```text
▓▓▓ HTTP STATUS CODES
────────────────────────────────────────
200  OK - Request successful
400  Bad Request - Invalid params
401  Unauthorized - Missing/invalid token
403  Forbidden - Wrong product access
404  Not Found - Resource not found
500  Internal Error - Server error
503  Service Unavailable - Woovi down
```

────────────────────────────────────────

## Rate Limits

```text
▓▓▓ NETLIFY LIMITS
────────────────────────────────────────
Functions: 125,000 requests/month
Bandwidth: 100 GB/month
Build minutes: 300 min/month

Rate limit per IP:
  └─ /api/charges/create: 10 req/min
  └─ /api/charges/status: 30 req/min
  └─ /api/webhooks/pix: Unlimited (trusted)
```

────────────────────────────────────────

## Testing

### Local Testing

```bash
# Start FlowPay
cd /Users/nettomello/CODIGOS/flowpay
npm run dev

# Test buy (from Neobot)
moltbot flowpay:buy \
  --amount_brl 0.01 \
  --product_ref "test" \
  --customer_ref "00000000000"

# Copy charge_id from output

# Check status
moltbot flowpay:status --charge_id "CHARGE_ID"

# Manually trigger unlock (simulate webhook)
moltbot flowpay:unlock --charge_id "CHARGE_ID"
```

### Webhook Testing (ngrok)

```bash
# Expose local FlowPay
ngrok http 4321

# Copy ngrok URL
# Configure in Woovi dashboard:
# Webhook URL: https://abc123.ngrok.io/api/webhooks/pix

# Make real PIX payment (R$0.01)
# Watch webhook arrive in ngrok console
```

────────────────────────────────────────

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"API first. UX follows."

Documentation is code.
────────────────────────────────────────
