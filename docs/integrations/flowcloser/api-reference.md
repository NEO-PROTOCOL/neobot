<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

```text
========================================
    FLOWCLOSER API · REFERENCE
========================================
```

Complete API reference for FlowCloser
Agent HTTP endpoints.

────────────────────────────────────────

## Base URLs

```text
▓▓▓ ENVIRONMENTS
────────────────────────────────────────
└─ Local: http://localhost:8042
└─ Production: flowcloser-agent
                -production.up.railway.app
```

────────────────────────────────────────

## Health Check

### `GET /health`

Returns agent health status.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2026-01-30T..."
}
```

**Status codes:**

- `200` - Agent healthy
- `500` - Agent unhealthy

────────────────────────────────────────

## Dashboard

### `GET /dashboard`

Returns HTML dashboard with leads
overview and real-time updates.

**Features:**

- Auto-refresh every 30s
- Lead metrics
- Recent leads list
- Score distribution

────────────────────────────────────────

## Leads API

### `GET /api/leads`

List all leads with optional filters.

**Query params:**

- `status` - Filter by status
- `qualified` - true/false
- `platform` - instagram/whatsapp
- `limit` - Max results (default: 50)

**Response:**

```json
{
  "leads": [
    {
      "id": "uuid",
      "name": "Maria Santos",
      "score": 85,
      "qualified": true,
      "status": "qualified",
      "platform": "instagram",
      "created_at": "2026-01-30T..."
    }
  ],
  "total": 42,
  "metrics": {
    "qualified": 28,
    "avg_score": 72
  }
}
```

────────────────────────────────────────

## Agents API

### `GET /api/agents`

List available agents.

**Response:**

```json
{
  "agents": [
    {
      "id": "flowcloser",
      "name": "FlowCloser Agent",
      "status": "active"
    }
  ]
}
```

### `POST /api/agents/flowcloser/message`

Send message directly to agent.

**Body:**

```json
{
  "message": "Olá, preciso de um site",
  "userId": "user123"
}
```

**Response:**

```json
{
  "reply": "Agent response...",
  "score": 75
}
```

────────────────────────────────────────

## Webhooks

### `GET /api/webhooks/instagram`

Instagram webhook verification.

**Query params:**

- `hub.mode` - "subscribe"
- `hub.verify_token` - Token
- `hub.challenge` - Challenge string

### `POST /api/webhooks/instagram`

Receive Instagram/Messenger messages.

**Body:** Meta webhook payload

### `GET /api/webhooks/whatsapp`

WhatsApp webhook verification.

### `POST /api/webhooks/whatsapp`

Receive WhatsApp messages (Meta Cloud API).

────────────────────────────────────────

## Legal Endpoints

### `GET /privacy-policy`

Returns HTML privacy policy page.

### `GET /terms-of-service`

Returns HTML terms of service page.

### `POST /api/data-deletion`

GDPR data deletion request.

**Body:**

```json
{
  "user_id": "123",
  "reason": "User request"
}
```

### `GET /data-deletion-status`

Check data deletion request status.

────────────────────────────────────────

## Error Responses

All endpoints may return:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": {...}
}
```

**Common status codes:**

- `400` - Bad request
- `401` - Unauthorized
- `404` - Not found
- `500` - Internal server error

────────────────────────────────────────

## Authentication

Currently, most endpoints are **open**
for development purposes.

Production deployment uses:

- Webhook token verification
- HMAC signature validation
- Client certificate (optional)

────────────────────────────────────────

## Rate Limiting

No rate limiting currently implemented.

Recommended for production:

- 100 req/min per IP
- 1000 req/hour per IP

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
