# NEO PROTOCOL - PROJECT IDENTITY MAP
> **Purpose:** Definitive reference to avoid confusion between projects  
> **Last Updated:** 2026-02-16 (Post-Audit Orchestration)

---

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ CORE IDENTITY MATRIX                                 │
├──────────────────────────────────────────────────────────┤
│ 💠 **Neobot Architect** (Sovereign Node)                  │
│    └─ Local: `.`                                         │
│    └─ Identity: `mio-core` / `mio-warrior` (Pending Key) │
│                                                          │
│ 💠 **NEO Agent Full** (Agent Node)                       │
│    └─ Local: `../neo-agent-full`                         │
│    └─ Identity: `mio-asi1` / `mio-telegram`              │
│                                                          │
│ 💠 **NEO Nexus** (Event Hub)                             │
│    └─ Local: `../neo-nexus`                              │
│    └─ Identity: `mio-gateway`                            │
│                                                          │
│ 💠 **MIO System** (Identity Layer)                       │
│    └─ Local: `../mio-system`                             │
│    └─ Identity: `mio-factory` / `mio-skills`             │
│                                                          │
│ 💠 **Neo Dashboard** (Control Center)                     │
│    └─ Local: `../neo-dashboard-deploy`                   │
│    └─ Status: Active Interface                           │
└──────────────────────────────────────────────────────────┘
---

┌──────────────────────────────────────────────────────────┐
│ ▓▓▓ EXTENDED ECOSYSTEM                                   │
├──────────────────────────────────────────────────────────┤
│ 💳 **FlowPay Sovereign** (Financial Node)                │
│    └─ Port: 4321 | Domain: `flowpay.cash`                │
│                                                          │
│ 🏗️ **Neo Smart Factory** (Web3 Engineering)              │
│    └─ Role: Token/Contract Orchestration                 │
│                                                          │
│ 🏛️ **Fluxx DAO** (Governance Node)                       │
│    └─ Role: Protocol Governance & Voting                 │
│                                                          │
│ 🌍 **NEO Protocol Web** (Landing/Boot)                   │
│    └─ URL: `neoprotocol.space`                           │
└──────────────────────────────────────────────────────────┘

---

## CORRECT REFERENCES (Source of Truth: ecosystem.json)

## CORE DATA SYNC (Registry vs Local)

┌──────────────────────────┬────────────┬──────────────────┐
│ MODULE                   │ STATUS     │ MOUNT PATH       │
├──────────────────────────┼────────────┼──────────────────┤
│ neobot-architect         │ 💎 CORE    │ `./`             │
│ neo-agent-full           │ 🤖 AGENT   │ `../neo-agent`   │
│ neo-nexus                │ ⚡ HUB     │ `../neo-nexus`   │
│ mio-system               │ 🔐 AUTH    │ `../mio-system`  │
└──────────────────────────┴────────────┴──────────────────┘

---

**Status:** Soberania Arquitetural Garantida. (85% Global Sync)  
**Audit Live:** Validado via `scripts/e2e/nexus-audit.ts`  
**Security:** MIO Identities Encrypted
**Próxima Etapa:** Unificação de Projetos na Railway.
