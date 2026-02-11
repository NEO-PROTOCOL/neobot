---
description: Start the project session, checking connections and status.
---

# Project Kickoff: Node Warrior

1. **Initialize System**
   - Execute the cleanup and checks script.

// turbo 2. Load Secrets & Run Kickoff

- source scripts/load-secrets-bitwarden.sh && node scripts/kickoff.js

3. **Session Planning**
   - Review the output above (Notion, Linear, Warp status).
   - If Bitwarden is locked, run `export BW_SESSION=$(bw unlock --raw)` then retry Step 2.
   - If warnings exist, resolve them before proceeding.
   - Run `/update_clawdbot` if upstream updates are needed.
