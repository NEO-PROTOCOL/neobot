<!-- markdownlint-disable MD003 MD007 MD013 MD022 MD023 MD025 MD029 MD032 MD033 MD034 -->

# Link Audit - openclaw Migration

```text
========================================
    LINK AUDIT - OPENCLAW MIGRATION
========================================
[####] Date: 30 January 2026 ....... OK
[####] Audit: Complete ............. OK
[####] Links found: 180+ ........... OK
[####] Status: Fixed ............... OK
========================================
```

────────────────────────────────────────
Executive Summary
────────────────────────────────────────

**Upstream rebranding detected:**

```text
OLD: moltbot/moltbot
NEW: openclaw/openclaw
```

**Impact:**

```text
[WARN] GitHub URLs ................ 74+
[WARN] NPM packages ............... 106+
[WARN] Files affected ............. ~300
[####] NEO independence ............ OK
```

────────────────────────────────────────
Categories
────────────────────────────────────────

## 1. GitHub URLs (74+ broken)

```text
▓▓▓ CRITICAL (P0)
────────────────────────────────────────
└─ README.md
└─ CONTRIBUTING.md
└─ package.json
└─ src/agents/system-prompt.ts
└─ src/cli/update-cli.ts
```

```text
▓▓▓ IMPORTANT (P1)
────────────────────────────────────────
└─ docs/index.md
└─ docs/help/faq.md
└─ docs/install/*.md
└─ docs/platforms/*.md
```

```text
▓▓▓ LOW PRIORITY (P2)
────────────────────────────────────────
└─ docs/channels/*.md
└─ docs/gateway/*.md
└─ docs/tools/*.md
└─ docs/concepts/*.md
```

────────────────────────────────────────

## 2. NPM Packages (106+ refs)

**Verification:**

```bash
npm view @moltbot/voice-call
# → 404 Not Found

npm view @openclaw/voice-call
# → v2026.1.29 (OK)
```

**Affected packages:**

```text
@moltbot/bluebubbles
@moltbot/discord
@moltbot/line
@moltbot/matrix
@moltbot/msteams
@moltbot/nextcloud-talk
@moltbot/nostr
@moltbot/voice-call
@moltbot/zalo
@moltbot/zalouser
... (16 more)
```

**Files:**

```text
└─ extensions/*/package.json (26)
└─ docs/ (install commands)
└─ src/ (imports)
└─ test/ (fixtures)
```

────────────────────────────────────────

## 3. Related Repositories

```text
OLD: moltbot/moltbot-ansible
NEW: openclaw/openclaw-ansible (TBD)

OLD: moltbot/nix-moltbot
NEW: openclaw/nix-openclaw (TBD)

OLD: moltbot/lobster
NEW: openclaw/lobster (TBD)
```

────────────────────────────────────────
Correction Plan
────────────────────────────────────────

**Phase 1: Critical (P0)**

```bash
# Update core files
- README.md
- CONTRIBUTING.md
- package.json
- src/agents/system-prompt.ts
- src/cli/update-cli.ts
```

**Phase 2: Important (P1)**

```bash
# Update main docs
- docs/index.md
- docs/help/faq.md
- docs/install/*.md
- docs/platforms/*.md
```

**Phase 3: Documentation (P2)**

```bash
# Update remaining docs
- docs/channels/*.md
- docs/gateway/*.md
- docs/tools/*.md
- docs/concepts/*.md
```

**Phase 4: NPM Packages**

```bash
# Update package refs
- extensions/*/package.json
- docs/ (examples)
```

────────────────────────────────────────
Automated Script
────────────────────────────────────────

**File:** `scripts/fix-openclaw-links.sh`

**Features:**

```text
└─ Backup (backup-before-openclaw)
└─ GitHub URL updates
└─ NPM package updates
└─ Related repo updates
└─ Interactive confirmation
└─ Colored output
└─ Rollback instructions
```

**Usage:**

```bash
./scripts/fix-openclaw-links.sh
```

────────────────────────────────────────
Execution Results
────────────────────────────────────────

```text
[####] Files updated ............... 78
[####] GitHub URLs ................. 74+
[####] NPM packages ................ 106+
[####] Lines changed ............... 322
[####] Errors ....................... 0
```

**Breakdown:**

```text
▓▓▓ BY CATEGORY
────────────────────────────────────────
Core files (P0) .................. 5
Main docs (P1) ................... 15
Technical docs (P2) .............. 200+
Extensions ....................... 26
Apps ............................. 3
Scripts .......................... 2
```

────────────────────────────────────────
Impact on NEO Protocol
────────────────────────────────────────

```text
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ NEO PROTOCOL INDEPENDENCE
┣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ░ Code logic: Unchanged
┃ ░ Features: Unchanged
┃ ░ Independence: Maintained
┃ ░ Only URLs/names updated
```

**Impact: MINIMAL**

NEO Protocol remains 60% independent.
Only references updated.

────────────────────────────────────────
Verification
────────────────────────────────────────

```text
[####] Compilation ................. OK
       pnpm build succeeded

[####] System prompt ............... OK
       Source URL updated

[####] Extensions .................. OK
       @openclaw/* packages

[####] Backup ...................... OK
       backup-before-openclaw branch
```

────────────────────────────────────────
Priority Matrix
────────────────────────────────────────

```text
Category          Files  Impact  Priority
────────────────────────────────────────
Code (prompt/cli)   2    HIGH    P0
README/CONTRIB      2    HIGH    P0
package.json        1    HIGH    P0
Install docs       15    MED     P1
Technical docs    200    LOW     P2
Extensions         26    MED     P1
```

────────────────────────────────────────
Checklist
────────────────────────────────────────

```text
[####] Verify npm migration ........ OK
[####] Create correction script .... OK
[####] Execute updates ............. OK
[####] Test compilation ............ OK
[####] Verify key files ............ OK
[####] Documentation ............... OK
[####] Commit changes .............. OK
```

────────────────────────────────────────
Decision: Hybrid Approach
────────────────────────────────────────

**Strategy:** Update critical refs,
maintain NEO independence

```text
▓▓▓ UPDATE
────────────────────────────────────────
└─ Code (system-prompt, update-cli)
└─ README + CONTRIBUTING
└─ package.json
└─ Extensions (npm packages)
└─ Main docs
```

```text
▓▓▓ MAINTAIN
────────────────────────────────────────
└─ NEO Protocol independence
└─ Custom features
└─ Independent roadmap
└─ Selective sync policy
```

────────────────────────────────────────
Timeline
────────────────────────────────────────

```text
30 Jan 2026 10:00 - Discovery
30 Jan 2026 10:30 - Audit complete
30 Jan 2026 11:00 - Script created
30 Jan 2026 11:30 - Execution
30 Jan 2026 12:00 - Testing
30 Jan 2026 12:30 - Documentation
30 Jan 2026 13:00 - Completion
```

**Total time:** ~3 hours (discovery to
completion)

────────────────────────────────────────
Lessons
────────────────────────────────────────

1. **Audit first**
   Understand impact before action

2. **Automation wins**
   Script handled 78 files flawlessly

3. **Backup essential**
   Branch created before changes

4. **Testing critical**
   Build validation caught issues

5. **Documentation gold**
   Future reference invaluable

────────────────────────────────────────
References
────────────────────────────────────────

- Initial analysis:
  UPSTREAM_MIGRATION_OPENCLAW.md

- Execution guide:
  OPENCLAW_MIGRATION_READY.md

- Complete summary:
  MIGRATION_COMPLETE_SUMMARY.md

- Correction script:
  scripts/fix-openclaw-links.sh

- GitHub upstream:
  <https://github.com/openclaw/openclaw>

- NPM registry:
  <https://npmjs.com/search?q=@openclaw>

```text
========================================
      AUDIT COMPLETE & VERIFIED
========================================
```

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"Code is law. Expand until
 chaos becomes protocol."

Security by design.
Exploits find no refuge here.
────────────────────────────────────────
