#!/bin/bash
# NΞØ Protocol: Total Backup - System State (Apps & OS)
# Author: Antigravity

set -e

CYAN='\033[0;36m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${CYAN}================================================================${NC}"
echo -e "${CYAN}🛡️  NΞØ SECURITY PROTOCOL: EXPORTING SYSTEM STATE${NC}"
echo -e "${CYAN}================================================================${NC}"

STATE_DIR="/tmp/neo_backup/system_state_$(date +%Y%m%d)"
mkdir -p "$STATE_DIR"

echo -e "📝 ${CYAN}Exporting Homebrew app list...${NC}"
if command -v brew &> /dev/null; then
    brew bundle dump --file="$STATE_DIR/Brewfile" --force || echo "Brew dump failed, skipping..." > "$STATE_DIR/Brewfile_error.txt"
    echo -e "✅ Brewfile check completed."
else
    echo -e "⚠️  Homebrew not found."
fi

echo -e "📝 ${CYAN}Exporting macOS system preferences...${NC}"
defaults read > "$STATE_DIR/macos_preferences.plist" || echo "Defaults read failed" > "$STATE_DIR/macos_preferences_error.txt"
echo -e "✅ Preferences check completed."

echo -e "📝 ${CYAN}Exporting crontab...${NC}"
crontab -l > "$STATE_DIR/crontab_backup.txt" 2>/dev/null || echo "No crontab for user or access denied" > "$STATE_DIR/crontab_backup.txt"

echo -e "\n📦 ${CYAN}Finalizing state backup...${NC}"
BACKUP_FILE="/tmp/neo_backup/NEO_STATE_$(date +%Y%m%d).zip"
zip -r "$BACKUP_FILE" "$STATE_DIR"

echo -e "\n✅ ${GREEN}System state backup created: $BACKUP_FILE${NC}"
