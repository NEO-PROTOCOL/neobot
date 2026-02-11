---
description: Start the project session, checking connections and status.
---

# Project Kickoff: Node Warrior

1. **Initialize System**
   - Execute the cleanup and checks script.

// turbo 2. Load Secrets & Run Kickoff

- source scripts/load-secrets-bitwarden.sh && node --import tsx scripts/wrapup.ts

**Note on macOS Permissions**: If `pnpm audit`, `build`, or other validations fail due to `EPERM` or permission locks, request the USER (Executor User) to run the command manually in their terminal.

**Note on macOS Permissions**: If any command in this flow fails with `EPERM` or requires `sudo`, delegate the execution to the USER (Executor User) and proceed after their confirmation.

3. **Session Planning**
   - Review the output above (Notion, Linear, Warp status).
   - If Bitwarden is locked, run `export BW_SESSION=$(bw unlock --raw)` then retry Step 2.
   - If warnings exist, resolve them before proceeding.
   - Run `/update_clawdbot` if upstream updates are needed.
