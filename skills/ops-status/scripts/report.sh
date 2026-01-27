#!/bin/bash
set -e

DETAIL="${1:-summary}"

# Ledger Integration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Resolving project root (assuming/skills/ops-status/scripts layout)
PROJECT_ROOT="$(dirname "$(dirname "$(dirname "$SCRIPT_DIR")")")"
LEDGER_SCRIPT="$PROJECT_ROOT/skills/ledger/scripts/ledger.mjs"

# 1. Policy Check
POLICY_CHECK=$(node "$LEDGER_SCRIPT" check-policy --skill "ops-status")
if echo "$POLICY_CHECK" | grep -q '"allowed":false'; then
  echo "❌ Policy Denied: ops-status is not allowed to run."
  node "$LEDGER_SCRIPT" log --intent "run report" --skill "ops-status" --status "blocked" --risk "high"
  exit 1
fi

# 2. Log Start
node "$LEDGER_SCRIPT" log --intent "run report" --skill "ops-status" --status "pending" --data "{\"detail\":\"$DETAIL\"}" > /dev/null

echo "## System Status Report"
echo "Date: $(date)"
echo "Hostname: $(hostname)"
echo ""

echo "### Gateway"
# Check if gateway port is listening
if lsof -i :19001 > /dev/null; then
  echo "✅ Gateway is RUNNING on port 19001"
else
  echo "❌ Gateway is NOT DETECTED on port 19001"
fi
echo ""

echo "### Process Resources"
# Get memory usage of node processes related to moltbot
ps -eo pid,pcpu,pmem,comm,args | grep "node" | grep "moltbot" | grep -v grep | awk '{print "- PID: "$1", CPU: "$2"%, MEM: "$3"%, CMD: "$5}'
echo ""

if [ "$DETAIL" == "full" ]; then
    echo "### Agent Sessions"
    # List sessions directory size
    if [ -d "$HOME/.clawdbot/sessions" ]; then
        echo "Session storage size: $(du -sh ~/.clawdbot/sessions | cut -f1)"
    else
        echo "Session storage: Not found"
    fi
    
    echo ""
    echo "### Config Check"
    if [ -f ~/.clawdbot/moltbot.json ]; then
        echo "✅ Config file exists"
    else
        echo "❌ Config file missing"
    fi
fi

echo ""
echo "### Summary"
echo "System operational."

# 3. Log Success
node "$LEDGER_SCRIPT" log --intent "run report" --skill "ops-status" --status "success" > /dev/null
