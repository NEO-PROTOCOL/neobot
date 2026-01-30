#!/bin/bash
# Open FlowCloser in Antigravity IDE

set -e

FLOWCLOSER_PATH="/Users/nettomello/CODIGOS/flowcloser-local"

if [ ! -d "$FLOWCLOSER_PATH" ]; then
  echo "❌ FlowCloser not found at: $FLOWCLOSER_PATH"
  exit 1
fi

echo "🚀 Opening FlowCloser in Antigravity..."
open -a "Antigravity" "$FLOWCLOSER_PATH"

echo "✅ FlowCloser opened in Antigravity!"
