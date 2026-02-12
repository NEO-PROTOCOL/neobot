<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
        FLOWPAY · ARCHITECTURE
========================================
```

Complete architectural overview of
FlowPay Gateway integration.

────────────────────────────────────────

## System Overview

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ░ EXTERNAL SERVICES
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ░ Woovi/OpenPix (PIX API)
┃ ░ Web3Auth (Wallet service)
┃ ░ QuickNode RPC (Blockchain)
┃ ░ Base Network (L2)
┃ ░ Polygon Network
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           │
           ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ░ FLOWPAY GATEWAY
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ░ Astro framework (208 files)
┃ ░ API routes (charges, webhooks)
┃ ░ Authentication (JWT + Web3Auth)
┃ ░ Payment orchestration
┃ ░ Access unlock logic
┃ ░ Netlify Functions (serverless)
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
           │
           ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ░ NEOBOT
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ░ Skills (buy, status, unlock)
┃ ░ UNLOCK_RECEIPT generator
┃ ░ Webhook handlers
┃ ░ Ledger audit
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## Payment Flow (Model B)

```text
▓▓▓ PIX PAYMENT → ACCESS UNLOCK
────────────────────────────────────────

1. Customer clicks "Buy Product"
   └─ Product page (Smart Factory, WOD, FLUXX)

2. Neobot Skill: flowpay:buy
   └─ POST /api/charges/create
   └─ Body: {
        amount_brl: 99.90,
        product_ref: "smart-factory-basic",
        customer_ref: "12345678900"
      }
   └─ Calls Woovi API
   └─ Returns: {
        charge_id: "abc123",
        qr_code: "data:image/png...",
        pix_copy_paste: "000201..."
      }

3. Customer scans QR code
   └─ Bank app opens
   └─ Customer confirms PIX
   └─ Bank processes payment

4. Woovi confirms payment
   └─ POST /api/webhooks/pix
   └─ Body: {
        event: "CHARGE_COMPLETED",
        charge: {
          correlationID: "abc123",
          value: 9990,
          status: "COMPLETED"
        }
      }

5. Webhook triggers unlock
   └─ Calls Neobot: flowpay:unlock
   └─ POST /neobot/api/unlock
   └─ Body: { charge_id: "abc123" }

6. Neobot generates UNLOCK_RECEIPT
   └─ Creates JWT token (unlock_token)
   └─ Saves to: data/flowpay/receipts/{receipt_id}.json
   └─ Returns: {
        receipt_id: "uuid",
        unlock_token: "eyJhbGc...",
        product_ref: "smart-factory-basic",
        expires_at: "ISO"
      }

7. Customer receives access
   └─ Email/SMS with unlock_token
   └─ Clicks link to product
   └─ Middleware validates token
   └─ Access granted ✅

8. Token materialized (background)
   └─ On-chain record (Base/Polygon)
   └─ Invisible to customer
   └─ Proof of purchase
```

────────────────────────────────────────

## Components

### Astro Application (208 files)

```text
▓▓▓ /Users/nettomello/CODIGOS/flowpay/
────────────────────────────────────────
src/
├── pages/
│   ├── index.astro          # Homepage
│   ├── checkout.astro       # Checkout page
│   ├── products/            # Product pages
│   │   ├── smart-factory.astro
│   │   ├── wod.astro
│   │   └── fluxx.astro
│   └── access/              # Access areas
│       ├── [token].astro    # Token-gated access
│       └── dashboard.astro  # User dashboard
│
├── components/
│   ├── PaymentForm.astro    # PIX payment UI
│   ├── QRCode.astro         # QR display
│   └── Web3AuthButton.astro # Wallet connect
│
└── api/                     # API routes (Astro)
    ├── charges/
    │   ├── create.ts        # POST - Create charge
    │   └── status.ts        # GET - Check status
    │
    ├── webhooks/
    │   └── pix.ts           # POST - Woovi webhook
    │
    └── access/
        └── unlock.ts        # POST - Unlock access

netlify/functions/           # Netlify Functions
├── pix-webhook.mjs          # Webhook handler
└── unlock-trigger.mjs       # Calls Neobot
```

────────────────────────────────────────

## Data Flow Diagrams

### Buy Flow

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Customer
┗━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         │ Clicks "Buy"
         ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ FlowPay: POST /api/charges/create
┗━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         │ Calls Woovi API
         ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Woovi: Creates charge
┗━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         │ Returns QR code + PIX string
         ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ FlowPay: Displays QR code
┗━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         │ Customer scans
         ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Customer's Bank: Confirms payment
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Unlock Flow

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Woovi: PIX confirmed
┗━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         │ POST /api/webhooks/pix
         ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ FlowPay: Webhook handler
┗━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         │ Validates signature
         │ Extracts charge_id
         ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Neobot: flowpay:unlock skill
┗━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         │ Generates JWT (unlock_token)
         │ Saves UNLOCK_RECEIPT
         │ Records in Ledger
         ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Customer: Receives email/SMS
┗━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         │ Clicks access link
         ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Product: Middleware validates token
┗━━━━━━━━┳━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
         │ jwt.verify(unlock_token)
         ↓
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ Product: Access granted ✅
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

────────────────────────────────────────

## Authentication System

### JWT Token Structure

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "receipt_id": "uuid",
    "charge_id": "abc123",
    "product_ref": "smart-factory-basic",
    "customer_ref": "12345678900",
    "amount_brl": 99.90,
    "iat": 1706630400,
    "exp": 1709222400
  },
  "signature": "..."
}
```

### Middleware Example

```typescript
// Product auth middleware
export async function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      error: 'No token provided' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if product matches
    if (decoded.product_ref !== req.params.product) {
      return res.status(403).json({ 
        error: 'Wrong product' 
      });
    }
    
    // Check expiration
    if (Date.now() > decoded.exp * 1000) {
      return res.status(401).json({ 
        error: 'Token expired' 
      });
    }
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      error: 'Invalid token' 
    });
  }
}
```

────────────────────────────────────────

## Database Schema

### UNLOCK_RECEIPT

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
    "contract": "0x6D539f66fAb95b06da7Def414a...",
    "token_id": 123,
    "tx_hash": "0x1234567890abcdef...",
    "status": "pending"
  },
  "created_at": "2026-01-30T14:30:00.000Z",
  "expires_at": "2026-04-30T14:30:00.000Z"
}
```

────────────────────────────────────────

## Security

```text
▓▓▓ SECURITY MEASURES
────────────────────────────────────────
└─ Webhook signature validation (Woovi)
└─ JWT token expiration (90 days)
└─ HTTPS only (Netlify TLS)
└─ Environment variables for secrets
└─ No secrets in code
└─ Rate limiting (Netlify)
└─ CORS configured
└─ Input validation (Zod schemas)
```

────────────────────────────────────────

## Deployment

```text
▓▓▓ NETLIFY CONFIGURATION
────────────────────────────────────────
└─ Builder: Astro SSR
└─ Runtime: Node.js 20
└─ Build: npm install && npm run build
└─ Functions: netlify/functions/
└─ Region: us-east-1
└─ Auto-deploy: On push to main
└─ Environment: WOOVI_API_KEY, JWT_SECRET
```

────────────────────────────────────────

## Monitoring

```text
▓▓▓ CURRENT STATE
────────────────────────────────────────
[####] Health endpoint ............. OK
[####] Netlify logs ................ OK
[####] Woovi dashboard ............. OK
[#---] APM/Tracing .............. TODO
[#---] Metrics ................... TODO
[----] Alerting ................. TODO
```

────────────────────────────────────────

## Performance

```text
▓▓▓ TARGET BENCHMARKS
────────────────────────────────────────
└─ Buy API: <500ms
└─ Status API: <200ms
└─ Webhook processing: <1s
└─ Unlock generation: <300ms
└─ Page load: <1s
└─ Uptime: 99.9%
```

────────────────────────────────────────

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"PIX in, access out.
 Simple as that."

Revenue first. Always.
────────────────────────────────────────
