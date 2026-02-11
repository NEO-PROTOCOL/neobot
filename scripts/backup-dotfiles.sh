#!/bin/bash
# NΞØ Protocol: Total Backup - System Configs (Dotfiles)
# Author: Antigravity

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${GREEN}================================================================${NC}"
echo -e "${GREEN}🛡️  NΞØ SECURITY PROTOCOL: SYSTEM CONFIGS (DOTFILES)${NC}"
echo -e "${GREEN}================================================================${NC}"

BACKUP_NAME="NEO_CONFIG_BACKUP_$(date +%Y%m%d_%H%M%S).zip"
TEMP_DIR="/tmp/neo_backup"
mkdir -p "$TEMP_DIR"

# Config files to backup
CONFIGS=(
    "$HOME/.zshrc"
    "$HOME/.gitconfig"
    "$HOME/.ssh"
    "$HOME/.config/notion"
    "$HOME/.npmrc"
)

echo -e "📦 ${YELLOW}Targeting system configurations...${NC}"

zip -r "$TEMP_DIR/$BACKUP_NAME" "${CONFIGS[@]}"

echo -e "\n✅ ${GREEN}Dotfiles backup created: $TEMP_DIR/$BACKUP_NAME${NC}"
