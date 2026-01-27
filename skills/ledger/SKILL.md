---
name: ledger
description: Execution Ledger and Policy Gate for Neobot System Governance
---

# Execution Ledger & Policy Gate

This skill provides the centralized logging, audit, and governance layer for Neobot. It records every action in a standard "Envelope" format and enforces policies before execution.

## Tools

### `ledger_log`

Records an event to the ledger.

**Parameters:**
- `intent` (string): The description of what was attempted/done.
- `skill` (string): The skill name involved.
- `status` (string): "success", "fail", "pending".
- `data` (object, optional): Inputs, outputs, or error details.
- `risk` (string, optional): "low", "med", "high".

**Usage:**
```bash
node skills/ledger/scripts/ledger.mjs log --intent "run ops-status" --skill "ops-status" --status "success"
```

### `ledger_check_policy`

Checks if an action is allowed based on the local policy.

**Parameters:**
- `skill` (string): The skill attempting to run.

**Usage:**
```bash
node skills/ledger/scripts/ledger.mjs check-policy --skill "ops-status"
```

### `ledger_search`

Searches the ledger logs.

**Parameters:**
- `last` (number, optional): Number of recent lines to retrieve.

**Usage:**
```bash
node skills/ledger/scripts/ledger.mjs search --last 10
```

## Data Structure: The Envelope

Every log entry follows this JSON structure:

```json
{
  "id": "evt_<uuid>",
  "ts": "ISO8601",
  "actor": "user|agent|system",
  "skill": "skill-name",
  "intent": "description",
  "status": "success|fail|pending",
  "risk": "low|med|high",
  "data": { ... }
}
```

## Storage

- **Logs**: `~/.clawdbot/ledger/main.jsonl`
- **Policies**: `skills/ledger/policies/allowlist.yaml`
