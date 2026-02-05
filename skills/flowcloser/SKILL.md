# Skill: FlowCloser Integration
> **Meta-ID:** flowcloser  
> **Role:** Notification Gateway

---

## 🎯 Purpose

This skill allows Neobot to monitor and interact with the **FlowCloser** micro-service. 
FlowCloser is the dedicated notifier that sends WhatsApp messages when events occur in the NEØ Nexus.

---

## 🏗️ Architecture

```
[ NEØ Nexus ] --(Webhook)--> [ FlowCloser ] --(WhatsApp)--> [ User ]
      ^                          ^
      |                          |
[ Neobot Skill ] ----------------/
```

- **FlowCloser Repo:** `NEO-PROTOCOL/neo-closer`
- **Role:** Webhook Notifier
- **Status:** Independent micro-service

---

## 🔧 Commands

- `check-health`: Verifies if the FlowCloser service is alive.
- `dashboard`: Quick access to the sales dashboard.

---

## 📂 Reference

See `docs/PROJECT_IDENTITY_MAP.md` for full ecosystem context.
