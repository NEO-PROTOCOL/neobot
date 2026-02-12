<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
     FLOWCLOSER · TROUBLESHOOTING
========================================
```

Common issues and solutions for
FlowCloser Agent.

────────────────────────────────────────

## Quick Diagnostics

```bash
# Run health check
./scripts/flowcloser/check-health.sh

# Check if process is running
ps aux | grep flowcloser

# Check Railway logs
railway logs -f

# Test local endpoint
curl http://localhost:8042/health
```

────────────────────────────────────────

## Common Issues

### 1. Port Already in Use

**Symptoms:**

```text
Error: listen EADDRINUSE: address
already in use :::8042
```

**Solution:**

```bash
# Find process using port
lsof -ti:8042

# Kill process
lsof -ti:8042 | xargs kill -9

# Or use different port
PORT=8043 npm run dev
```

────────────────────────────────────────

### 2. Cannot Find Module

**Symptoms:**

```text
Error: Cannot find module 'express'
```

**Solution:**

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Verify installation
ls node_modules/ | grep express
```

────────────────────────────────────────

### 3. Railway Deploy Failed

**Symptoms:**

- Deploy shows "failed" status
- Application not responding

**Diagnosis:**

```bash
# Check Railway logs
railway logs -f

# Look for common errors:
# - Missing environment variables
# - Build errors
# - Runtime crashes
```

**Solutions:**

```bash
# Verify environment variables
railway variables

# Trigger manual rebuild
railway up --detach

# Check service status
railway status
```

────────────────────────────────────────

### 4. OpenAI API Errors

**Symptoms:**

```text
Error: OpenAI API rate limit exceeded
Error: Invalid API key
```

**Solutions:**

```bash
# Verify API key
echo $OPENAI_API_KEY

# Test key manually
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Check quota
# Visit: platform.openai.com/usage

# Fallback should activate automatically
# Check logs for "Falling back to Gemini"
```

────────────────────────────────────────

### 5. Instagram Webhook Not Working

**Symptoms:**

- Messages not reaching agent
- Webhook verification fails

**Diagnosis:**

```bash
# Check webhook token
echo $WEBHOOK_VERIFY_TOKEN

# Test webhook endpoint
curl "http://localhost:8042/api/webhooks/instagram?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=test"
```

**Solutions:**

1. **Verify token matches Meta config**
2. **Check HTTPS (Railway provides TLS)**
3. **Verify Instagram app permissions**
4. **Check webhook subscriptions:**
   - messages
   - messaging_postbacks
5. **Test with Meta's webhook tester**

────────────────────────────────────────

### 6. Database Locked

**Symptoms:**

```text
Error: SQLITE_BUSY: database is locked
```

**Solutions:**

```bash
# Stop all FlowCloser processes
pkill -f flowcloser

# Check for zombie processes
ps aux | grep node

# Delete lock file (if safe)
rm -f data/flowcloser.db-wal
rm -f data/flowcloser.db-shm

# Restart
npm run dev
```

────────────────────────────────────────

### 7. Memory Leak / High CPU

**Symptoms:**

- Agent becomes slow over time
- High memory usage
- CPU at 100%

**Diagnosis:**

```bash
# Check memory usage
top -pid $(pgrep -f flowcloser)

# Node.js memory profile
node --max-old-space-size=2048 dist/main.js

# Railway metrics
# Visit Railway dashboard
```

**Solutions:**

1. **Restart agent** (temporary)
2. **Add memory limits** in Railway
3. **Profile with clinic.js:**

```bash
npm install -g clinic
clinic doctor -- node dist/main.js
```

4. **Check for event listener leaks**
5. **Verify webhook cleanup**

────────────────────────────────────────

### 8. Gemini Fallback Not Working

**Symptoms:**

- OpenAI fails
- Gemini doesn't activate
- Both LLMs failing

**Solutions:**

```bash
# Verify Gemini key
echo $GOOGLE_API_KEY

# Test Gemini API
curl "https://generativelanguage.googleapis.com/v1/models?key=$GOOGLE_API_KEY"

# Check fallback logic in logs
railway logs -f | grep -i "fallback"

# Ensure LLM_MODEL_FALLBACK is set
echo $LLM_MODEL_FALLBACK
# Should be: gemini-2.5-flash
```

────────────────────────────────────────

### 9. IPFS Backup Failing

**Symptoms:**

```text
Error: Storacha upload failed
```

**Solutions:**

```bash
# Verify IPFS credentials
echo $STORACHA_UCAN
echo $STORACHA_SPACE_DID

# Check network connectivity
curl -I https://api.storacha.network

# Test upload manually
# (use Storacha CLI)

# Disable IPFS backup temporarily
# (leads still save to JSON/SQLite)
```

────────────────────────────────────────

### 10. Dashboard Not Loading

**Symptoms:**

- Blank page
- 404 error
- CSS not loading

**Solutions:**

```bash
# Verify server is running
curl http://localhost:8042/health

# Check dashboard endpoint
curl http://localhost:8042/dashboard

# Verify public assets exist
ls public/

# Check browser console for errors
# (F12 → Console)

# Try incognito mode (cache issues)
```

────────────────────────────────────────

## Debugging Techniques

```text
▓▓▓ ENABLE VERBOSE LOGGING
────────────────────────────────────────
# Set in .env or Railway variables
NODE_ENV=development
DEBUG=flowcloser:*
LOG_LEVEL=debug
```

```text
▓▓▓ INSPECT DATABASE
────────────────────────────────────────
sqlite3 data/flowcloser.db

.tables
.schema leads
SELECT * FROM leads LIMIT 10;
.exit
```

```text
▓▓▓ TAIL LOGS CONTINUOUSLY
────────────────────────────────────────
# Local
tail -f logs/flowcloser.log

# Railway
railway logs -f
```

────────────────────────────────────────

## Get Help

```text
▓▓▓ SUPPORT CHANNELS
────────────────────────────────────────
└─ GitHub Issues:
   github.com/neomello/flowcloser-agent
   /issues

└─ Railway Support:
   help.railway.app

└─ Meta Developer Support:
   developers.facebook.com/support

└─ Internal (NODE NEØ):
   Direct message via Telegram
```

────────────────────────────────────────

## Preventive Maintenance

```bash
# Weekly: Check disk space
df -h

# Weekly: Rotate logs (if applicable)
logrotate -f /etc/logrotate.d/flowcloser

# Monthly: Database vacuum
sqlite3 data/flowcloser.db "VACUUM;"

# Monthly: Dependency updates
npm outdated
npm update

# Quarterly: Security audit
npm audit
npm audit fix
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
