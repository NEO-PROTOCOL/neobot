#!/bin/bash
set -eo pipefail

echo "=================================================="
echo "🔄 NΞØ Update Protocol: Clawdbot Sync (Secure)"
echo "=================================================="

# 0. Check Status
echo "📊 Checking divergence from upstream..."
git fetch upstream
git rev-list --left-right --count main...upstream/main

# 1. Safety First: User Confirmation
echo ""
read -p "⚠️  Ready to rebase onto upstream/main? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Update aborted."
    exit 1
fi

# 2. Rebase
echo "📥 Rebasing onto upstream/main..."
# Capture rebase output; if it fails, likely conflicts
if ! git rebase upstream/main; then
    echo "❌ Rebase failed due to conflicts."
    echo "   Please resolve conflicts manually, then run 'git rebase --continue'."
    echo "   After resolving, run 'npm run clean:check' to verify safety."
    exit 1
fi

# 3. Protocol Security Check (Anti-Telegram)
echo "🛡️  Running Protocol Security Check..."
if pnpm run clean:check; then
    echo "✅ Codebase is clean. No forbidden modules detected."
else
    echo "⚠️  Telegram/Forbidden components detected in update!"
    echo "🧹  Initiating Auto-Clean Protocol..."
    
    # Aggressively remove known Telegram paths
    rm -rf src/telegram
    rm -f src/infra/notifiers/telegram.ts
    
    # Re-verify
    if pnpm run clean:check; then
         echo "✅ Auto-clean successful. Telegram components removed."
         
         # Commit the removal
         if ! git diff-index --quiet HEAD --; then
             git add .
             git commit -m "chore: auto-remove telegram components after update"
             echo "💾 Clean-up committed."
         fi
    else
         echo "❌ CRITICAL: Auto-clean failed. Manual intervention required."
         exit 1
    fi
fi

# 4. Dependencies & Build
echo "📦 Installing dependencies..."
pnpm install

echo "🏗️  Building TypeScript..."
pnpm build

# 5. Swift/macOS Compatibility Checks (From Workflow)
echo "� Checking for Swift 6.2/macOS issues..."
if grep -r "FileManager\.default\|Thread\.isMainThread" src/ apps/ --include="*.swift" --quiet; then
    echo "⚠️  WARNING: Found deprecated Swift APIs (FileManager.default / Thread.isMainThread)"
    echo "   Please review 'apps/macos' and 'src/canvas-host/a2ui' manually."
    # We don't exit here, just warn, as per workflow it might need manual fix
else
    echo "✅ No obvious Swift deprecation issues found."
fi

# 6. Rebuild macOS App (Optional prompt)
read -p "🖥️  Rebuild macOS App now? (y/n) " -n 1 -r
echo ""
if [[ $REPLY =~ ^[Yy]$ ]]; then
    ./scripts/restart-mac.sh
fi

echo "=================================================="
echo "✨ Update Sequence Complete."
echo "   Don't forget to push: git push origin main --force-with-lease"
echo "=================================================="
