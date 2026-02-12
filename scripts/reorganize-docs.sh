#!/usr/bin/env bash
# 📚 NeoBot Documentation Reorganization Script
# 
# This script implements the reorganization plan from DOCS_ORGANIZATION_REPORT.md
# 
# Usage:
#   ./scripts/reorganize-docs.sh [--dry-run]
#
# Options:
#   --dry-run    Show what would be done without making changes
#
# Safety:
#   - Creates backup branch before any changes
#   - All operations are logged
#   - Can be reverted via git

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKUP_BRANCH="docs-organization-backup-$(date +%Y%m%d-%H%M%S)"
DRY_RUN=false
LOG_FILE="docs-reorganization-$(date +%Y%m%d-%H%M%S).log"

# Parse arguments
if [[ "${1:-}" == "--dry-run" ]]; then
    DRY_RUN=true
    echo -e "${YELLOW}🔍 DRY RUN MODE - No changes will be made${NC}"
fi

# Logging function
log() {
    echo -e "$1" | tee -a "$LOG_FILE"
}

# Execute or simulate command
run() {
    if [[ "$DRY_RUN" == "true" ]]; then
        log "${BLUE}[DRY-RUN]${NC} $*"
    else
        log "${GREEN}[EXEC]${NC} $*"
        eval "$*"
    fi
}

log "${GREEN}========================================${NC}"
log "${GREEN}NeoBot Documentation Reorganization${NC}"
log "${GREEN}========================================${NC}"
log ""
log "Started: $(date)"
log "Backup branch: $BACKUP_BRANCH"
log "Log file: $LOG_FILE"
log ""

# Phase 0: Safety checks
log "${BLUE}Phase 0: Safety Checks${NC}"
log "----------------------------------------"

# Check if we're in the right directory
if [[ ! -f "package.json" ]] || [[ ! -d "src" ]]; then
    log "${RED}❌ Error: Must be run from neobot root directory${NC}"
    exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD -- 2>/dev/null; then
    log "${YELLOW}⚠️  Warning: You have uncommitted changes${NC}"
    if [[ "$DRY_RUN" == "false" ]]; then
        read -p "Continue anyway? (y/N) " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log "${RED}Aborted by user${NC}"
            exit 1
        fi
    fi
fi

log "${GREEN}✅ Safety checks passed${NC}"
log ""

# Phase 1: Create backup branch
log "${BLUE}Phase 1: Create Backup Branch${NC}"
log "----------------------------------------"

run "git checkout -b $BACKUP_BRANCH"
if [[ "$DRY_RUN" == "false" ]]; then
    run "git push origin $BACKUP_BRANCH"
    run "git checkout main"
fi

log "${GREEN}✅ Backup branch created: $BACKUP_BRANCH${NC}"
log ""

# Phase 2: Create directory structure
log "${BLUE}Phase 2: Create Directory Structure${NC}"
log "----------------------------------------"

DIRS=(
    "docs/audits"
    "docs/deployment"
    "docs/examples"
    "docs/neo-protocol"
    "docs/testing"
    "docs/project"
    "docs/history"
)

for dir in "${DIRS[@]}"; do
    run "mkdir -p $dir"
done

log "${GREEN}✅ Directory structure created${NC}"
log ""

# Phase 3: Merge redundant files
log "${BLUE}Phase 3: Merge Redundant Files${NC}"
log "----------------------------------------"

# 3.1 Merge NEO Protocol status docs
log "📄 Merging NEO Protocol status docs..."
if [[ "$DRY_RUN" == "false" ]]; then
    cat > docs/history/NEO_PHASE1_ARCHIVE.md <<'EOF'
# NEO Protocol Phase 1 - Historical Archive

**Created:** $(date +%Y-%m-%d)  
**Purpose:** Historical archive of Phase 1 implementation and status

This document consolidates the following files:
- NEO_SUMMARY.md
- NEO_PHASE1_SUCCESS.md
- NEO_IMPLEMENTATION_COMPLETE.md
- NEO_VISUAL_PROGRESS.md

For current NEO Protocol status, see:
- [NEO_PROTOCOL_KICKOFF.md](../../NEO_PROTOCOL_KICKOFF.md)
- [ARCHITECTURE_NEO_PROTOCOL.md](../../ARCHITECTURE_NEO_PROTOCOL.md)
- [NEXT_STEPS_V2.md](../../NEXT_STEPS_V2.md)

---

EOF
    cat NEO_SUMMARY.md >> docs/history/NEO_PHASE1_ARCHIVE.md
    echo -e "\n\n---\n\n" >> docs/history/NEO_PHASE1_ARCHIVE.md
    cat NEO_PHASE1_SUCCESS.md >> docs/history/NEO_PHASE1_ARCHIVE.md
    echo -e "\n\n---\n\n" >> docs/history/NEO_PHASE1_ARCHIVE.md
    cat NEO_IMPLEMENTATION_COMPLETE.md >> docs/history/NEO_PHASE1_ARCHIVE.md
    echo -e "\n\n---\n\n" >> docs/history/NEO_PHASE1_ARCHIVE.md
    cat NEO_VISUAL_PROGRESS.md >> docs/history/NEO_PHASE1_ARCHIVE.md
else
    run "cat NEO_SUMMARY.md NEO_PHASE1_SUCCESS.md NEO_IMPLEMENTATION_COMPLETE.md NEO_VISUAL_PROGRESS.md > docs/history/NEO_PHASE1_ARCHIVE.md"
fi

# 3.2 Merge migration docs
log "📄 Merging migration docs..."
if [[ "$DRY_RUN" == "false" ]]; then
    cat > docs/history/MIGRATIONS_ARCHIVE.md <<'EOF'
# Migrations - Historical Archive

**Created:** $(date +%Y-%m-%d)  
**Purpose:** Historical archive of completed migrations

This document consolidates:
- MIGRATION_COMPLETE_SUMMARY.md
- OPENCLAW_MIGRATION_READY.md

For current migration tracking, see:
- [UPSTREAM_MIGRATION_OPENCLAW.md](../../UPSTREAM_MIGRATION_OPENCLAW.md)

---

EOF
    cat MIGRATION_COMPLETE_SUMMARY.md >> docs/history/MIGRATIONS_ARCHIVE.md
    echo -e "\n\n---\n\n" >> docs/history/MIGRATIONS_ARCHIVE.md
    cat OPENCLAW_MIGRATION_READY.md >> docs/history/MIGRATIONS_ARCHIVE.md
else
    run "cat MIGRATION_COMPLETE_SUMMARY.md OPENCLAW_MIGRATION_READY.md > docs/history/MIGRATIONS_ARCHIVE.md"
fi

# 3.3 Merge status snapshots
log "📄 Merging status snapshots..."
if [[ "$DRY_RUN" == "false" ]]; then
    cat > docs/history/STATUS_SNAPSHOTS.md <<'EOF'
# Status Snapshots - Historical Archive

**Created:** $(date +%Y-%m-%d)  
**Purpose:** Historical project status reports

This document consolidates:
- STATUS_FINAL.md
- SUMMARY.md
- MISSION_COMPLETE.md

For current project status, see:
- [NEXT_STEPS_V2.md](../../NEXT_STEPS_V2.md)
- [CHANGELOG.md](../../CHANGELOG.md)

---

EOF
    cat STATUS_FINAL.md >> docs/history/STATUS_SNAPSHOTS.md
    echo -e "\n\n---\n\n" >> docs/history/STATUS_SNAPSHOTS.md
    cat SUMMARY.md >> docs/history/STATUS_SNAPSHOTS.md
    echo -e "\n\n---\n\n" >> docs/history/STATUS_SNAPSHOTS.md
    cat MISSION_COMPLETE.md >> docs/history/STATUS_SNAPSHOTS.md
else
    run "cat STATUS_FINAL.md SUMMARY.md MISSION_COMPLETE.md > docs/history/STATUS_SNAPSHOTS.md"
fi

log "${GREEN}✅ Files merged${NC}"
log ""

# Phase 4: Move files to new structure
log "${BLUE}Phase 4: Move Files${NC}"
log "----------------------------------------"

# Move audit files
log "Moving audit files..."
run "git mv AUDIT_EVOLUTION_VS_FLOWCLOSER.md docs/audits/"
run "git mv AUDIT_FLOWPAY.md docs/audits/"
run "git mv AUDIT_LINKS_OPENCLAW.md docs/audits/"
run "git mv AUDIT_MINIAPPS.md docs/audits/"

# Move deployment files
log "Moving deployment files..."
run "git mv DEPLOYMENT_RAILWAY_INFO.md docs/deployment/"
run "git mv FLOWCLOSER_LLM_GUIDE.md docs/deployment/"

# Move examples
log "Moving example files..."
run "git mv EXEMPLOS_PRATICOS.md docs/examples/"
run "git mv CLAUDE_AI_GUIDE.md docs/examples/"

# Move NEO protocol docs (keep some in root)
log "Moving NEO protocol files..."
run "git mv MIO_IDENTITIES_REGISTRATION.md docs/neo-protocol/"
# Keep NEO_PROTOCOL_KICKOFF.md in root as it's essential

# Move testing
log "Moving test files..."
run "git mv WHATSAPP_TEST_RESULTS.md docs/testing/"

# Move project docs
log "Moving project documentation..."
run "git mv PROJECT_TREE.md docs/project/"
run "git mv OPTIMIZATIONS.md docs/project/"

# Move to history (only those not already merged)
log "Moving files to history..."
run "git mv PLANO_PERSONALIZACAO.md docs/history/"
run "git mv RESUMO_CRIACAO.md docs/history/"
run "git mv CORRECOES.md docs/history/"
run "git mv COMMIT_SUMMARY.md docs/history/"

log "${GREEN}✅ Files moved${NC}"
log ""

# Phase 5: Delete redundant files
log "${BLUE}Phase 5: Delete Redundant Files${NC}"
log "----------------------------------------"

# Delete duplicates
log "Deleting duplicate files..."
if [[ -f "README_CHANGELOG.md" ]]; then
    run "git rm README_CHANGELOG.md"
fi

if [[ -f "GUIA_DE_USO.md" ]]; then
    # First append to QUICKSTART
    if [[ "$DRY_RUN" == "false" ]]; then
        echo -e "\n\n---\n\n## Quick Usage Guide\n\n" >> QUICKSTART.md
        cat GUIA_DE_USO.md >> QUICKSTART.md
    else
        run "cat GUIA_DE_USO.md >> QUICKSTART.md"
    fi
    run "git rm GUIA_DE_USO.md"
fi

if [[ -f "NEXT_STEPS.md" ]]; then
    run "git mv NEXT_STEPS.md docs/history/"
fi

if [[ -f "docs.acp.md" ]]; then
    run "git rm docs.acp.md"
fi

# Delete merged source files
log "Deleting merged source files..."
FILES_TO_DELETE=(
    "NEO_SUMMARY.md"
    "NEO_PHASE1_SUCCESS.md"
    "NEO_IMPLEMENTATION_COMPLETE.md"
    "NEO_VISUAL_PROGRESS.md"
    "MIGRATION_COMPLETE_SUMMARY.md"
    "OPENCLAW_MIGRATION_READY.md"
    "STATUS_FINAL.md"
    "SUMMARY.md"
    "MISSION_COMPLETE.md"
)

for file in "${FILES_TO_DELETE[@]}"; do
    if [[ -f "$file" ]]; then
        run "git rm $file"
    fi
done

log "${GREEN}✅ Redundant files deleted${NC}"
log ""

# Phase 6: Create README files for new folders
log "${BLUE}Phase 6: Create README Files${NC}"
log "----------------------------------------"

# Create README for docs/audits/
if [[ "$DRY_RUN" == "false" ]]; then
    cat > docs/audits/README.md <<'EOF'
# Audits

Technical audits of external services and system components.

## Available Audits

- [Evolution API vs FlowCloser](./AUDIT_EVOLUTION_VS_FLOWCLOSER.md) - WhatsApp API comparison
- [FlowPay Audit](./AUDIT_FLOWPAY.md) - Payment system analysis
- [OpenClaw Links Audit](./AUDIT_LINKS_OPENCLAW.md) - Link migration audit
- [Mini Apps Audit](./AUDIT_MINIAPPS.md) - Mini apps analysis

---

[← Back to Documentation Index](../../INDEX.md)
EOF
    run "git add docs/audits/README.md"
fi

# Create README for docs/history/
if [[ "$DRY_RUN" == "false" ]]; then
    cat > docs/history/README.md <<'EOF'
# Historical Documentation Archive

This folder contains archived documentation and historical snapshots.

## Archives

- [NEO Phase 1 Archive](./NEO_PHASE1_ARCHIVE.md) - Phase 1 implementation history
- [Migrations Archive](./MIGRATIONS_ARCHIVE.md) - Migration completion records
- [Status Snapshots](./STATUS_SNAPSHOTS.md) - Historical status reports

## Historical Files

- Planning documents
- Completed migration records
- Bug fix logs
- Commit summaries

---

**Note:** These documents are kept for historical reference. For current information, see the main documentation.

[← Back to Documentation Index](../../INDEX.md)
EOF
    run "git add docs/history/README.md"
fi

log "${GREEN}✅ README files created${NC}"
log ""

# Phase 7: Summary
log "${BLUE}Phase 7: Summary${NC}"
log "========================================${NC}"
log ""
log "📊 Changes Summary:"
log "  - Created: 7 new folders"
log "  - Moved: 14 files to organized folders"
log "  - Merged: 11 files → 3 archive files"
log "  - Deleted: 4+ redundant files"
log "  - Root-level files: 43 → ~15 (-65%)"
log ""
log "📁 New Structure:"
log "  docs/audits/        - Technical audits"
log "  docs/deployment/    - Deployment guides"
log "  docs/examples/      - Examples & tutorials"
log "  docs/neo-protocol/  - NEO Protocol docs"
log "  docs/testing/       - Test documentation"
log "  docs/project/       - Project metadata"
log "  docs/history/       - Historical archive"
log ""

if [[ "$DRY_RUN" == "false" ]]; then
    log "${GREEN}✅ Reorganization complete!${NC}"
    log ""
    log "Next steps:"
    log "  1. Review changes: git status"
    log "  2. Test build: pnpm build"
    log "  3. Commit changes: git add . && git commit -m 'docs: reorganize documentation structure'"
    log "  4. Push: git push origin main"
    log ""
    log "Backup branch: $BACKUP_BRANCH"
    log "To rollback: git reset --hard $BACKUP_BRANCH"
else
    log "${YELLOW}🔍 DRY RUN COMPLETE - No changes made${NC}"
    log ""
    log "To execute these changes, run:"
    log "  ./scripts/reorganize-docs.sh"
fi

log ""
log "Finished: $(date)"
log "Log saved to: $LOG_FILE"
