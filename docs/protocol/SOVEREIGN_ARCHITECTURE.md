<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->
# 🏛️ SOVEREIGN ARCHITECTURE
# NΞØ PROTOCOL

```text
========================================
     SOVEREIGN ARCHITECTURE v1.0.0
========================================
[####] Status Active .............. OK
[####] Date Feb 2026 .............. OK
[####] Architect NΞØ MELLØ ........ OK
[####] Security Level ............. MAX
========================================
```

## 1. Vision: Logic Vault

The **NEO Protocol** is a sovereign,
decentralized layer built atop the
Moltbot core. It transforms a standard
automation bot into an **Interplanetary
Node** capable of:

1.  **Self-Sovereign Identity:** Using
    MIO keys.
2.  **Decentralized Intelligence:**
    Skills via IPFS.
    (Interplanetary File System)
3.  **Cryptographic Truth:** Signing
    every action on-chain.

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ NEO PROTOCOL STACK
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ░ NEO Layer (Sovereign)
┃ ░ • Skills Registry <IPFS>
┃ ░ • Identity <mio-system>
┃ ░ • Audit <SovereignAudit>
┃ ░
┃ ░ Moltbot Core (Operational)
┃ ░ • Gateway Runtime
┃ ░ • Channel Adapters
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

## 2. Hybrid Helix Architecture

The system operates on a **Hybrid
Double-Helix** model:

### 🔴 Helix A: Moltbot Core
*Synced with upstream.*

```text
▓▓▓ OPERATIONAL LAYER (src/)
────────────────────────────────────────
└─ src/gateway/ (WebSockets)
└─ src/channels/ (WhatsApp, Telegram)
└─ src/agents/ (AI Runtime)
└─ src/infra/ (Databases)
```

**Strategy:** Keep clean and synced.
Do not hack core unless necessary.

### 🔵 Helix B: NEO Protocol
*Exclusive sovereign intelligence.*

```text
▓▓▓ SOVEREIGN LAYER (src/neo/)
────────────────────────────────────────
└─ src/neo/registry/ (IPFS Skills)
└─ src/neo/identity/ (MIO Keys)
└─ src/neo/audit/ (Immutable Logs)
└─ docs/protocol/ (The Law)
```

**Role:** The "Soul". Handles Identity,
Permissions, and Universal Logic.

## 3. Component Details

### 3.1. Identity System (MIO)

**Location:** `src/neo/identity/`

```text
▓▓▓ MIO IDENTITIES
────────────────────────────────────────
└─ mio-core: The Brain
   └─ Signs system updates
└─ mio-warrior: The Defender
   └─ Signs security audits
└─ mio-flowpay: The Treasurer
   └─ Signs transactions
└─ mio-gateway: The Voice
   └─ Signs network packets
```

### 3.2. FlowPay Economy

**Location:** `src/infra/flowpay/`

**Mechanism:**
- Atomic Transactions.
- Cryptographic Audit.
  (`audit_log` with `signature`).
- Local Ledger (SQLite).

## 4. Universal Directory Structure

This structure is **MANDATORY**. Do not
create folders outside this schema.

```text
▓▓▓ PROJECT ROOT (neobot/)
────────────────────────────────────────
└─ .neo-identities/ (🔐 Encrypted)
└─ .env (Local secrets)
└─ data/ (Mutable State)
   └─ flowpay/ (Ledger)
   └─ sessions/ (Memories)
└─ docs/ (Knowledge Base)
   └─ protocol/ (⭐️ TRUTH)
   └─ core/ (Upstream docs)
└─ src/ (Source Code)
   └─ agents/ (Personalities)
   └─ neo/ (🔵 PROTOCOL SOUL)
   └─ infra/ (Services)
└─ skills/ (Pluggable Caps)
└─ dashboard/ (Visual Interface)
```

## 5. Security Protocols

1.  **No Naked Keys:** Keys loaded only
    via `IdentityLoader`.
2.  **Signed Logs:** Critical actions
    MUST utilize `SovereignAudit`.
3.  **Read-Only Core:** Extend via
    `src/neo/`, do not mod core.

---

> *"Code is Law. Expand until
> chaos becomes protocol."*

```text
▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"Code is law. Expand until
 chaos becomes protocol."

Security by design.
Exploits find no refuge here.
────────────────────────────────────────
```
