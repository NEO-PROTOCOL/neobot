<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
    FLOWCLOSER · DEVELOPMENT GUIDE
========================================
```

Complete guide for developing on
FlowCloser Agent.

────────────────────────────────────────

## Prerequisites

```text
▓▓▓ REQUIREMENTS
────────────────────────────────────────
└─ Node.js >= 18.0.0 (20.x recommended)
└─ npm >= 9.0.0
└─ Antigravity IDE
└─ Railway CLI (for deploy)
└─ Git
```

────────────────────────────────────────

## Initial Setup

**1. Open project in Antigravity:**

```bash
./scripts/flowcloser/open-antigravity.sh
```

Or directly:

```bash
open -a Antigravity \
  /Users/nettomello/CODIGOS/flowcloser-local
```

**2. Install dependencies:**

```bash
cd /Users/nettomello/CODIGOS/flowcloser-local
npm install
```

**3. Configure environment:**

```bash
cp .env.example .env
# Edit .env with your API keys
```

**4. Run in development:**

```bash
npm run dev
```

**5. Test health check:**

```bash
curl http://localhost:8042/health
```

────────────────────────────────────────

## Project Structure

```text
▓▓▓ FLOWCLOSER STRUCTURE
────────────────────────────────────────
flowcloser_adk-ts/
├─ src/
│  ├─ agents/flowcloser/
│  │  ├─ agent.ts        (520 lines)
│  │  ├─ callbacks.ts
│  │  ├─ conversions.ts
│  │  ├─ ghostwriter.ts
│  │  ├─ logger.ts
│  │  └─ tools.ts
│  ├─ config/
│  │  └─ accounts.ts
│  ├─ routes/
│  │  ├─ data-deletion.ts
│  │  └─ legal.ts
│  ├─ services/
│  │  └─ leads.ts        (403 lines)
│  └─ main.ts            (924 lines!)
├─ data/
│  ├─ flowcloser.db      SQLite
│  └─ leads.json         Leads storage
├─ dist/                 Build output
├─ docs/                 Documentation
└─ package.json
```

────────────────────────────────────────

## Development Workflow

```text
▓▓▓ TYPICAL WORKFLOW
────────────────────────────────────────
1. Open in Antigravity
2. Make changes
3. Test locally (npm run dev)
4. Run health checks
5. Test endpoints
6. Commit changes
7. Push to GitHub
8. Railway auto-deploys
```

────────────────────────────────────────

## Available Scripts

```bash
# Development
npm run dev        # Watch mode (tsx)

# Production
npm run build      # TypeScript compile
npm start          # Run compiled code

# Testing
npm run test:openai    # Test OpenAI key
npm run test:iqai      # Test IQAI connection
npm test               # (not configured yet)

# Chat
npm run chat       # Interactive chat
```

────────────────────────────────────────

## Environment Variables

**Required:**

```env
IQAI_API_KEY=your_iqai_key
OPENAI_API_KEY=your_openai_key
WEBHOOK_VERIFY_TOKEN=your_token
INSTAGRAM_APP_ID=your_app_id
INSTAGRAM_APP_SECRET=your_secret
```

**Optional (but recommended):**

```env
GOOGLE_API_KEY=your_gemini_key
LLM_MODEL=gpt-4o-mini
LLM_MODEL_FALLBACK=gemini-2.5-flash
PORT=8042
INSTAGRAM_ACCESS_TOKEN=your_token
INSTAGRAM_PAGE_ID=your_page_id
STORACHA_UCAN=your_ipfs_token
STORACHA_SPACE_DID=your_space_did
```

────────────────────────────────────────

## Testing

### Manual Testing

**Health check:**

```bash
curl http://localhost:8042/health
```

**Dashboard:**

```bash
open http://localhost:8042/dashboard
```

**List leads:**

```bash
curl http://localhost:8042/api/leads \
  | jq
```

### Automated Testing

⚠️ **Not implemented yet**

Recommended setup:

- Jest or Vitest
- Unit tests for services
- Integration tests for webhooks
- E2E tests for agent flow
- Coverage minimum: 70%

────────────────────────────────────────

## Code Quality

**Current status:**

```text
[####] TypeScript strict ........... OK
[#---] Linter (ESLint) .......... WARN
[----] Tests .................... TODO
[----] Coverage ................. TODO
```

**Recommended improvements:**

1. Add ESLint + Prettier
2. Implement test suite
3. Add pre-commit hooks
4. Configure CI/CD

────────────────────────────────────────

## Debugging

**Enable verbose logging:**

```env
NODE_ENV=development
DEBUG=flowcloser:*
```

**Railway logs:**

```bash
railway logs -f
```

**Local database:**

```bash
sqlite3 data/flowcloser.db
.tables
.schema
```

────────────────────────────────────────

## Common Issues

### Port already in use

```bash
lsof -ti:8042 | xargs kill -9
```

### Cannot find module

```bash
rm -rf node_modules package-lock.json
npm install
```

### Railway deploy failed

```bash
railway logs -f
# Check for errors
# Verify environment variables
```

────────────────────────────────────────

## Best Practices

```text
▓▓▓ CODING STANDARDS
────────────────────────────────────────
└─ TypeScript strict mode ✅
└─ Async/await (not callbacks)
└─ Error handling (try/catch)
└─ Structured logging
└─ No console.log in production
└─ Environment variables for secrets
└─ Conventional Commits
```

────────────────────────────────────────

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"Code is law. Expand until
 chaos becomes protocol."

Security by design.
Exploits find no refuge here.
────────────────────────────────────────
