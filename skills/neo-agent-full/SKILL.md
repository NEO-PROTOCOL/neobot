# Skill: NEO Agent Full Integration
> **Meta-ID:** neo-agent-full  
> **Role:** Sovereign Agent Node (WhatsApp/TG)

---

## 🎯 Purpose

This skill allows Neobot to monitor and interact with the **NEO Agent Full** node. 
NEO Agent Full is a sovereign AI node responsible for multi-channel communication (WhatsApp and Telegram) within the NEØ Protocol.

---

## 🏗️ Architecture

```
[ NEØ Nexus ] --(Webhook)--> [ NEO Agent Full ] --(WhatsApp/TG)--> [ User ]
      ^                             ^
      |                             |
[ Neobot Skill ] -------------------/
```

- **Node Repo:** `neomello/neo-agent-full`
- **Role:** Autonomous Service / Communication Gateway
- **Status:** Independent sovereign node

---

## 🔧 Commands

- `check-health`: Verifies if the Agent service is alive.
- `dashboard`: Quick access to the monitoring dashboard.

---

## 📂 Reference

See `config/ecosystem.json` for full ecosystem context.
