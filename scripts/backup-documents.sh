#!/bin/bash
# NΞØ Protocol: Total Backup - Documents & Personal Data
# Author: Antigravity

set -e

# ANSI Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}================================================================${NC}"
echo -e "${CYAN}🛡️  NΞØ SECURITY PROTOCOL: PERSONAL DATA BACKUP${NC}"
echo -e "${CYAN}================================================================${NC}"

BACKUP_NAME="NEO_PERSONAL_BACKUP_$(date +%Y%m%d_%H%M%S).zip"
# Use custom BACKUP_DIR if provided, else default to /tmp/neo_backup
TEMP_DIR="${BACKUP_DIR:-/tmp/neo_backup}"
mkdir -p "$TEMP_DIR"

# Folders to backup
SOURCES=("$HOME/Documents" "$HOME/Desktop" "$HOME/Pictures")

echo -e "📦 ${YELLOW}Targeting:${NC}"
for src in "${SOURCES[@]}"; do
    echo -e "  - $src"
done

# Calculate total size for progress reference
TOTAL_SIZE=$(du -shc "${SOURCES[@]}" | grep total | awk '{print $1}')
echo -e "📊 ${YELLOW}Total size to backup: $TOTAL_SIZE${NC}"

echo -e "\n🔒 ${YELLOW}Compressing and encrypting...${NC}"
echo -e "${CYAN}(You will see the files being processed below)${NC}\n"

# Using -evr for encryption + verbose to see progress
# We exclude typical heavy/trash folders and videos
zip -evr "$TEMP_DIR/$BACKUP_NAME" "${SOURCES[@]}" \
    -x "*/Downloads/*" \
    -x "*/Library/*" \
    -x "*/.Trash/*" \
    -x "*.mp4" -x "*.mov" -x "*.avi" -x "*.mkv" -x "*.wmv" -x "*.flv"

echo -e "\n✅ ${GREEN}Backup created: $TEMP_DIR/$BACKUP_NAME${NC}"
echo -e "${CYAN}----------------------------------------------------------------${NC}"
