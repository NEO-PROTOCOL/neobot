---
description: Check status of all stack projects and ensure clean exit.
---

# Project Wrap-up: Safe Shutdown

1. **Check Stack Status**
   - Run the wrap-up script to see if any project has uncommitted changes or unpushed code.

// turbo
2. Audit Stack
   - node --import tsx scripts/wrapup.ts

3. **Manual Actions (if needed)**
   - If the script above shows ⚠️ warnings, navigate to the specific folders and commit your changes.
   - Separate commits by context (Agência, Agent, Protocol, etc.).

4. **Final Sync**
   - After handling code, ensure the Notion Sync is up to date:
   - `node --import tsx scripts/notion-sync.ts`

5. **Shutdown**
   - You are safe to close the session.
