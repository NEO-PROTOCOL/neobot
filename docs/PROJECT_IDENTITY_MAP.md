# NEO PROTOCOL - PROJECT IDENTITY MAP

> **Purpose:** Definitive reference to avoid confusion between projects  
> **Last Updated:** 2026-02-18 (Post-Audit Orchestration)

---

## CORE IDENTITY MATRIX

- **Neobot Architect (Sovereign Node)**
  - Local Path: `.`
  - Identity: `mio-core` / `mio-warrior` (Pending Key)
  - Role: Sovereign Node / Orchestrator / Architect

- **NEO Agent Full (Agent Node)**
  - Local Path: `../neo-agent-full`
  - Identity: `mio-asi1` / `mio-telegram`
  - Role: Agent Node / Autonomous Service

- **NEO Nexus (Event Hub)**
  - Local Path: `../neo-nexus`
  - Identity: `mio-gateway`
  - Role: Event Hub / Relay

- **MIO System (Identity Layer)**
  - Local Path: `../mio-system`
  - Identity: `mio-factory` / `mio-skills`
  - Role: Identity Layer / Security

- **Neo Dashboard (Control Center)**
  - Local Path: `../neo-dashboard-deploy`
  - Status: Active Interface
  - Role: System Visualization / Control Center

---

## EXTENDED ECOSYSTEM (Source of Truth: ecosystem.json)

- **FlowPay Sovereign (Financial Node)**
  - Domain: `flowpay.cash`
  - Role: Financial Sovereign Node / Storefront

- **FlowPay Core (Settlement Node)**
  - Domain: `flowpaycore.com`
  - ENS: `flowpaycore.eth`
  - Role: Settlement Engine / Webhook Logic

- **Neo Smart Factory (Web3 Engineering)**
  - Organization: Neo Smart Factory
  - Role: Token and Contract Engineering

- **Fluxx DAO (Governance Node)**
  - Domain: `fluxx.space`
  - Role: Protocol Governance

- **NEO Protocol Web (Landing/Boot)**
  - URL: `neoprotocol.space`
  - Role: Frontend / Landing / Bootloader

---

## CORE DATA SYNC (Registry vs Local)

| Module           | Status | Local Mount Path |
| :--------------- | :----- | :--------------- |
| neobot-architect | CORE   | `./`             |
| neo-agent-full   | AGENT  | `../neo-agent`   |
| neo-nexus        | HUB    | `../neo-nexus`   |
| mio-system       | AUTH   | `../mio-system`  |

---

**Status:** Soberania Arquitetural Garantida (85% Global Sync)  
**Audit Live:** Validado via `scripts/e2e/nexus-audit.ts`  
**Security:** MIO Identities Encrypted  
**Next Step:** Project Unification on Railway
