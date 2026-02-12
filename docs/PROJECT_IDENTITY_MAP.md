# NEO PROTOCOL - PROJECT IDENTITY MAP
> **Purpose:** Definitive reference to avoid confusion between projects  
> **Last Updated:** 2026-02-05

---

## CORE IDENTITY MATRIX

| Project Name | Repository | Local Path | Role | Deploy |
|--------------|-----------|------------|------|--------|
| **Neobot** | `neomello/neobot` | `/Users/nettomello/CODIGOS/neobot` | Dev Tool, Architect | Local/Dev |
| **FlowCloser** | `NEO-PROTOCOL/neo-closer` | `/Users/nettomello/CODIGOS/neo-protocol-stack/flowcloser` | Webhook Notifier | Railway (sales.neoprotocol.space) |
| **Neo-Agent-Full** | `neomello/neo-agent-full` | `/Users/nettomello/CODIGOS/neo-agent-full` | Full WhatsApp Agent | Railway (existing) |
| **Neo-Nexus** | `NEO-PROTOCOL/neo-nexus` | `/Users/nettomello/CODIGOS/neo-nexus` | Event Orchestrator | Railway (nexus.neoprotocol.space) |

---

## DEPRECATED / RENAMED

### ❌ OLD: `flowcloser-agent` (DEPRECATED)
- **Old Repo:** `neomello/flowcloser-agent` (may not exist or is outdated)
- **Old URL:** `flowcloser-agent-production.up.railway.app`
- **Status:** REPLACED by **FlowCloser** (new micro-service)

### ❌ OLD: `neo-node-interplanetary` as "Neobot Core"
- **Old Identity:** Was confused with Neobot
- **New Identity:** Renamed to `neo-closer`, hosts **FlowCloser** (webhook notifier)

---

## CORRECT REFERENCES (Use These)

### Neobot (Architect)
```json
{
  "id": "neobot-architect",
  "name": "Neobot (Architect Agent)",
  "repository": "https://github.com/neomello/neobot.git",
  "localPath": "/Users/nettomello/CODIGOS/neobot",
  "role": "Development Tool / Architect"
}
```

### FlowCloser (Notifier)
```json
{
  "id": "flowcloser",
  "name": "FlowCloser (Sales Agent)",
  "repository": "https://github.com/NEO-PROTOCOL/neo-closer.git",
  "localPath": "/Users/nettomello/CODIGOS/neo-protocol-stack/flowcloser",
  "role": "Webhook Notifier",
  "hosting": {
    "platform": "Railway",
    "targetCustomDomain": "sales.neoprotocol.space"
  }
}
```

### Neo-Agent-Full (Full Agent)
```json
{
  "id": "neo-agent-full",
  "name": "NEO Agent Full",
  "repository": "https://github.com/neomello/neo-agent-full.git",
  "localPath": "/Users/nettomello/CODIGOS/neo-agent-full",
  "role": "Full WhatsApp Agent (Web3 + AI)"
}
```

---

## MIGRATION CHECKLIST

### Files to Update:
- [x] `/Users/nettomello/CODIGOS/neobot/config/ecosystem.json`
- [x] `/Users/nettomello/CODIGOS/neo-nexus/config/nodes.json`
- [ ] `/Users/nettomello/CODIGOS/neobot/src/config/cursor-config.ts`
- [ ] `/Users/nettomello/CODIGOS/neobot/skills/flowcloser/skill.json`
- [ ] `/Users/nettomello/CODIGOS/neobot/skills/flowcloser/SKILL.md`
- [ ] `/Users/nettomello/CODIGOS/neobot/scripts/flowcloser/check-health.sh`

### Documentation to Archive (Optional):
- `docs/integrations/flowcloser/` (old references to flowcloser-agent)
- `extensions/flowcloser/` (old integration configs)

---

## QUICK REFERENCE

**When someone asks "What is FlowCloser?"**
> FlowCloser is a lightweight webhook receiver that sends WhatsApp notifications when Nexus dispatches events like MINT_CONFIRMED or PAYMENT_RECEIVED. It's NOT an AI agent, just a simple notifier.

**When someone asks "What is Neobot?"**
> Neobot is the development and architecture agent. It's the tool we use for coding, DevOps, and strategic planning. It contains the Nexus orchestrator embedded.

**When someone asks "What is Neo-Agent-Full?"**
> Neo-Agent-Full is a full-featured WhatsApp agent with AI, Web3 capabilities, and OpenClaw/Moltbot features. It's for complex customer interactions, not just notifications.

---

**Status:** Definitive Reference  
**Action Required:** Update remaining files listed in checklist
