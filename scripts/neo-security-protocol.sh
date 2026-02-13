#!/bin/bash
# NΞØ Protocol: New Security Protocol - Emergency Backup System
# Author: Antigravity

set -e

# ANSI Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${RED}================================================================${NC}"
echo -e "${RED}🛡️  NΞØ SECURITY PROTOCOL: EMERGENCY BACKUP MODE ACTIVATED${NC}"
echo -e "${RED}================================================================${NC}"

# Define target directories
TARGET_ROOT="/Users/nettomello/neomello"
BACKUP_NAME="NEO_SOVEREIGN_BACKUP_$(date +%Y%m%d_%H%M%S).zip"
TEMP_DIR="/tmp/neo_backup"

mkdir -p "$TEMP_DIR"

echo -e "📦 ${CYAN}Preparing to archive: ${TARGET_ROOT}${NC}"

# 1. Compress and Encrypt
echo -e "🔒 ${YELLOW}Compressing and encrypting data...${NC}"
echo -e "${YELLOW}Please enter a STRONG PASSWORD when prompted for the zip encryption.${NC}"

# We exclude node_modules, .venv, and heavy media files to save space and time
cd "$TARGET_ROOT"
zip -er "$TEMP_DIR/$BACKUP_NAME" . \
    -x "*/node_modules/*" \
    -x "*/.venv/*" \
    -x "*/.pnpm-store/*" \
    -x "*/dist/*" \
    -x "*.mp4" -x "*.mov" -x "*.avi" -x "*.mkv" -x "*.wmv" -x "*.flv"

echo -e "\n✅ ${GREEN}Backup archive created: $TEMP_DIR/$BACKUP_NAME${NC}"

# 2. Check for Web3 Tools
echo -e "\n🛰️  ${CYAN}Checking Web3 Backup Tools...${NC}"

check_tool() {
    if ! command -v $1 &> /dev/null; then
        echo -e "⚠️  ${YELLOW}$1 is not installed.${NC}"
        return 1
    else
        echo -e "✅ ${GREEN}$1 is ready.${NC}"
        return 0
    fi
}

install_tools() {
    echo -e "📥 ${YELLOW}Attempting to install tools locally...${NC}"
    npm install -g @lighthouse-web3/sdk @storacha/cli || echo -e "❌ ${RED}Global install failed. Please run: npm install -g @lighthouse-web3/sdk @storacha/cli${NC}"
}

if ! check_tool "lighthouse" || ! check_tool "storacha"; then
    install_tools
fi

# 3. Instruction for Providers
echo -e "\n${BRIGHT}--- SELECT BACKUP PROVIDER ---${NC}"

echo -e "1. ${GREEN}Lighthouse (Filecoin/IPFS)${NC}"
echo -e "   Command: lighthouse-web3 upload \"$TEMP_DIR/$BACKUP_NAME\""
echo -e "   (Note: Use 'lighthouse-web3 login' first if not authenticated)\n"

echo -e "2. ${GREEN}Storacha (Web3.Storage)${NC}"
echo -e "   Command: storacha put \"$TEMP_DIR/$BACKUP_NAME\""
echo -e "   (Note: Use 'storacha login' first if not authenticated)\n"

echo -e "3. ${GREEN}IPFS (Local/Public)${NC}"
echo -e "   Command: ipfs add \"$TEMP_DIR/$BACKUP_NAME\"\n"

echo -e "${RED}================================================================${NC}"
echo -e "🚨 ${RED}PROTOCOL ACTIVE: DO NOT LEAVE THIS TERMINAL UNTIL BACKUP IS CONFIRMED.${NC}"
echo -e "${RED}================================================================${NC}"
