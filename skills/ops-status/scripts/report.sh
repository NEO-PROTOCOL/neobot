#!/bin/bash
set -e

DETAIL="${1:-summary}"

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
