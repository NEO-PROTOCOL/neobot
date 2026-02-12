<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
        FLOWPAY · DEVELOPMENT
========================================
```

How to develop, test, and deploy FlowPay
Gateway locally and to production.

────────────────────────────────────────

## Prerequisites

```bash
# Required
- Node.js 20+
- pnpm (or npm)
- Cursor IDE
- Woovi API account
- Web3Auth account (optional)

# Optional
- ngrok (for webhook testing)
- Netlify CLI
```

────────────────────────────────────────

## Local Setup

### 1. Clone Repository

```bash
cd /Users/nettomello/CODIGOS
git clone https://github.com/neomello/flowpay
cd flowpay
```

### 2. Install Dependencies

```bash
pnpm install
# or
npm install
```

### 3. Configure Environment

```bash
# Copy .env.example
cp .env.example .env

# Edit .env
# Add your Woovi API key
# Add Web3Auth client ID
# Add JWT secret
```

**`.env` structure:**

```bash
# Woovi/OpenPix
WOOVI_API_KEY=your_woovi_api_key_here
WOOVI_WEBHOOK_SECRET=your_webhook_secret_here

# Web3Auth
WEB3AUTH_CLIENT_ID=your_web3auth_client_id

# JWT
JWT_SECRET=your_super_secret_jwt_key_here

# QuickNode RPC (optional)
QUICKNODE_RPC_URL=https://your-quicknode-endpoint.com

# Environment
NODE_ENV=development
```

### 4. Run Development Server

```bash
pnpm dev
# or
npm run dev

# Opens at: http://localhost:4321
```

────────────────────────────────────────

## Project Structure

```text
flowpay/ (208 files)
├── src/
│   ├── pages/
│   │   ├── index.astro          # Homepage
│   │   ├── checkout.astro       # Checkout
│   │   ├── products/            # Product pages
│   │   │   ├── smart-factory.astro
│   │   │   ├── wod.astro
│   │   │   └── fluxx.astro
│   │   └── access/              # Protected areas
│   │       └── [token].astro    # Token-gated access
│   │
│   ├── components/
│   │   ├── PaymentForm.astro
│   │   ├── QRCode.astro
│   │   └── Web3AuthButton.astro
│   │
│   ├── layouts/
│   │   └── Layout.astro
│   │
│   └── lib/
│       ├── woovi.ts             # Woovi API client
│       ├── web3auth.ts          # Web3Auth client
│       └── jwt.ts               # JWT utilities
│
├── netlify/functions/           # Serverless functions
│   ├── pix-webhook.mjs          # Woovi webhook
│   └── unlock-trigger.mjs       # Neobot trigger
│
├── public/                      # Static assets
│
├── astro.config.mjs             # Astro config
├── netlify.toml                 # Netlify config
└── package.json
```

────────────────────────────────────────

## Development Workflow

### Standard Workflow

```text
▓▓▓ DAILY DEVELOPMENT
────────────────────────────────────────

1. Start dev server
   └─ pnpm dev

2. Make changes in src/
   └─ Hot reload active

3. Test locally
   └─ Browser: http://localhost:4321
   └─ Test checkout flow
   └─ Test API endpoints

4. Commit to Git
   └─ git add .
   └─ git commit -m "feat: add feature"

5. Push to GitHub
   └─ git push origin main

6. Netlify auto-deploys
   └─ Live in ~2 minutes
```

────────────────────────────────────────

## Testing

### Unit Tests (TODO)

```bash
# Install Vitest
pnpm add -D vitest @vitest/ui

# Run tests
pnpm test

# Coverage
pnpm test:coverage
```

### Manual Testing

```bash
# 1. Start FlowPay
cd /Users/nettomello/CODIGOS/flowpay
pnpm dev

# 2. Test buy endpoint
curl -X POST http://localhost:4321/api/charges/create \
  -H "Content-Type: application/json" \
  -d '{
    "amount_brl": 0.01,
    "product_ref": "test",
    "customer_ref": "00000000000"
  }'

# 3. Copy charge_id from response

# 4. Test status endpoint
curl http://localhost:4321/api/charges/status?charge_id=CHARGE_ID

# 5. Test via Neobot skills (from neobot repo)
cd /Users/nettomello/CODIGOS/neobot
moltbot flowpay:buy --amount_brl 0.01 --product_ref "test"
moltbot flowpay:status --charge_id "CHARGE_ID"
moltbot flowpay:unlock --charge_id "CHARGE_ID"
```

### Webhook Testing (ngrok)

```bash
# 1. Install ngrok
brew install ngrok

# 2. Expose local port
ngrok http 4321

# 3. Copy ngrok URL (e.g., https://abc123.ngrok.io)

# 4. Configure Woovi webhook
# Dashboard → Webhooks → Add new
# URL: https://abc123.ngrok.io/api/webhooks/pix

# 5. Make real PIX payment (R$0.01)
# Watch webhook arrive in terminal

# 6. Check ngrok web interface
# http://127.0.0.1:4040
```

────────────────────────────────────────

## Building for Production

### Build Command

```bash
# Build Astro app
pnpm build

# Output: dist/
# Netlify serves from dist/
```

### Production Environment

```bash
# Set in Netlify dashboard:
# Environment Variables:
WOOVI_API_KEY=prod_key_here
WOOVI_WEBHOOK_SECRET=prod_secret
JWT_SECRET=prod_jwt_secret
WEB3AUTH_CLIENT_ID=prod_web3auth_id
NODE_ENV=production
```

────────────────────────────────────────

## Deployment

### Netlify Auto-Deploy

```text
▓▓▓ AUTOMATIC DEPLOYMENT
────────────────────────────────────────

1. Push to main branch
   └─ git push origin main

2. Netlify detects push
   └─ Webhook triggers build

3. Build runs
   └─ pnpm install && pnpm build

4. Deploy to production
   └─ https://flowpaypix.netlify.app

5. Live in ~2 minutes ✅
```

### Manual Deploy (Netlify CLI)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Link to site
netlify link

# Deploy preview
netlify deploy

# Deploy to production
netlify deploy --prod
```

────────────────────────────────────────

## Debugging

### Logs

```bash
# Netlify logs (CLI)
netlify logs

# Netlify logs (Dashboard)
# https://app.netlify.com/sites/flowpaypix/logs

# Local dev logs
# Appear in terminal where pnpm dev is running
```

### Debug Mode

```bash
# Enable debug logging
export DEBUG=flowpay:*

# Run dev server
pnpm dev

# Logs will be verbose
```

### Common Issues

```text
▓▓▓ TROUBLESHOOTING
────────────────────────────────────────

Issue: Port 4321 already in use
  └─ Fix: killall node
  └─ Or: Change port in astro.config.mjs

Issue: Woovi API error 401
  └─ Fix: Check WOOVI_API_KEY in .env
  └─ Fix: Regenerate key in Woovi dashboard

Issue: Webhook not firing
  └─ Fix: Check ngrok URL
  └─ Fix: Verify Woovi webhook config
  └─ Fix: Check signature validation

Issue: JWT validation fails
  └─ Fix: Check JWT_SECRET matches
  └─ Fix: Check token expiration
  └─ Fix: Regenerate token

Issue: Build fails on Netlify
  └─ Fix: Check build logs
  └─ Fix: Verify package.json scripts
  └─ Fix: Check Node version (20+)
```

────────────────────────────────────────

## Code Style

### Formatting

```bash
# Install Prettier
pnpm add -D prettier

# Format code
pnpm format

# Check formatting
pnpm format:check
```

### Linting

```bash
# Install ESLint
pnpm add -D eslint @typescript-eslint/parser

# Lint code
pnpm lint

# Fix linting issues
pnpm lint:fix
```

────────────────────────────────────────

## Git Workflow

### Branch Strategy

```text
main        Production branch
  └─ feature/  Feature branches
  └─ fix/      Bug fixes
  └─ docs/     Documentation
```

### Commit Convention

```bash
# Use Conventional Commits
feat: Add PIX checkout page
fix: Resolve webhook signature validation
docs: Update API reference
chore: Update dependencies
test: Add Woovi API tests
```

────────────────────────────────────────

## Performance

### Optimization

```bash
# Analyze bundle
pnpm build
pnpm astro build --analyze

# Lighthouse audit
lighthouse https://flowpaypix.netlify.app

# WebPageTest
# https://www.webpagetest.org
```

### Targets

```text
▓▓▓ PERFORMANCE TARGETS
────────────────────────────────────────
Lighthouse Score:   90+
First Contentful:   < 1.0s
Time to Interactive: < 2.0s
Total Bundle Size:  < 500 KB
```

────────────────────────────────────────

## Security

### Best Practices

```text
▓▓▓ SECURITY CHECKLIST
────────────────────────────────────────
✅ Never commit .env files
✅ Use environment variables
✅ Validate webhook signatures
✅ Use HTTPS only
✅ Sanitize user inputs
✅ Rate limit API endpoints
✅ JWT expiration (90 days)
✅ CORS configured properly
```

────────────────────────────────────────

## References

- Astro Docs: https://docs.astro.build
- Woovi API: https://developers.woovi.com
- Web3Auth: https://web3auth.io/docs
- Netlify: https://docs.netlify.com

────────────────────────────────────────

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"Ship fast. Iterate faster."

Development is a journey.
────────────────────────────────────────
