#!/bin/bash
# fix-openclaw-links.sh
# Script para atualizar referências de moltbot para openclaw
# Data: 30 Janeiro 2026
# Uso: ./scripts/fix-openclaw-links.sh

set -e

echo "🔍 Auditoria e Correção de Links - moltbot → openclaw"
echo "════════════════════════════════════════════════════════"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contadores
TOTAL_CHANGES=0

# Função para contar mudanças
count_changes() {
  local pattern="$1"
  local count=$(git diff --cached --numstat | grep -E "$pattern" | wc -l || echo "0")
  echo "$count"
}

# Função para confirmar ação
confirm() {
  read -p "$(echo -e "${YELLOW}$1 (y/n)${NC} ")" -n 1 -r
  echo
  [[ $REPLY =~ ^[Yy]$ ]]
}

echo "📦 Verificando status do repositório..."
if [[ -n $(git status --porcelain) ]]; then
  echo -e "${RED}⚠️  Você tem mudanças não commitadas!${NC}"
  echo "Recomendamos commitar ou stash antes de continuar."
  if ! confirm "Continuar mesmo assim?"; then
    echo "Abortado."
    exit 1
  fi
fi

echo ""
echo "🎯 O que será feito:"
echo "  1. Backup do estado atual (git branch backup-before-openclaw)"
echo "  2. Atualizar URLs GitHub: moltbot/moltbot → openclaw/openclaw"
echo "  3. Atualizar pacotes npm: @moltbot/* → @openclaw/*"
echo "  4. Revisar mudanças antes de commitar"
echo ""

if ! confirm "Prosseguir com a correção?"; then
  echo "Abortado."
  exit 1
fi

echo ""
echo "📂 Criando branch de backup..."
git branch backup-before-openclaw 2>/dev/null || echo "Branch backup já existe"
echo -e "${GREEN}✅ Backup criado: backup-before-openclaw${NC}"

echo ""
echo "🔧 Phase 1: Atualizando URLs GitHub (github.com/moltbot → github.com/openclaw)"
echo "────────────────────────────────────────────────────────────────────────────────"

# Lista de arquivos críticos (P0)
CRITICAL_FILES=(
  "README.md"
  "CONTRIBUTING.md"
  "package.json"
  "src/agents/system-prompt.ts"
  "src/cli/update-cli.ts"
)

echo -e "${BLUE}Atualizando arquivos CRÍTICOS (P0):${NC}"
for file in "${CRITICAL_FILES[@]}"; do
  if [[ -f "$file" ]]; then
    echo "  - $file"
    sed -i '' 's|github\.com/moltbot/moltbot|github.com/openclaw/openclaw|g' "$file"
    sed -i '' 's|moltbot/moltbot/issues|openclaw/openclaw/issues|g' "$file"
    sed -i '' 's|moltbot/moltbot/discussions|openclaw/openclaw/discussions|g' "$file"
    sed -i '' 's|moltbot/moltbot/releases|openclaw/openclaw/releases|g' "$file"
    sed -i '' 's|moltbot/moltbot/blob|openclaw/openclaw/blob|g' "$file"
    sed -i '' 's|moltbot/moltbot/tree|openclaw/openclaw/tree|g' "$file"
    TOTAL_CHANGES=$((TOTAL_CHANGES + 1))
  fi
done

echo ""
echo -e "${BLUE}Atualizando documentação (docs/):${NC}"
find docs/ -type f -name "*.md" -not -path "*/node_modules/*" | while read -r file; do
  echo "  - $file"
  sed -i '' 's|github\.com/moltbot/moltbot|github.com/openclaw/openclaw|g' "$file"
  sed -i '' 's|moltbot/moltbot/issues|openclaw/openclaw/issues|g' "$file"
  sed -i '' 's|moltbot/moltbot/discussions|openclaw/openclaw/discussions|g' "$file"
  sed -i '' 's|moltbot/moltbot/releases|openclaw/openclaw/releases|g' "$file"
  sed -i '' 's|moltbot/moltbot/blob|openclaw/openclaw/blob|g' "$file"
  sed -i '' 's|moltbot/moltbot/tree|openclaw/openclaw/tree|g' "$file"
  TOTAL_CHANGES=$((TOTAL_CHANGES + 1))
done

echo ""
echo -e "${BLUE}Atualizando appcast.xml (releases):${NC}"
if [[ -f "appcast.xml" ]]; then
  echo "  - appcast.xml"
  sed -i '' 's|github\.com/moltbot/moltbot/releases|github.com/openclaw/openclaw/releases|g' appcast.xml
  sed -i '' 's|moltbot/moltbot/blob|openclaw/openclaw/blob|g' appcast.xml
  TOTAL_CHANGES=$((TOTAL_CHANGES + 1))
fi

echo ""
echo -e "${BLUE}Atualizando apps/ (macOS/Android/iOS):${NC}"
find apps/ -type f \( -name "*.swift" -o -name "*.kt" -o -name "*.md" \) 2>/dev/null | while read -r file; do
  echo "  - $file"
  sed -i '' 's|github\.com/moltbot/moltbot|github.com/openclaw/openclaw|g' "$file"
  TOTAL_CHANGES=$((TOTAL_CHANGES + 1))
done

echo ""
echo "🔧 Phase 2: Atualizando pacotes npm (@moltbot → @openclaw)"
echo "────────────────────────────────────────────────────────────────────────────────"

echo -e "${BLUE}Atualizando extensions/*/package.json:${NC}"
find extensions/ -name "package.json" -not -path "*/node_modules/*" | while read -r file; do
  echo "  - $file"
  sed -i '' 's|"@moltbot/|"@openclaw/|g' "$file"
  sed -i '' 's|"npmSpec": "@moltbot/|"npmSpec": "@openclaw/|g' "$file"
  TOTAL_CHANGES=$((TOTAL_CHANGES + 1))
done

echo ""
echo -e "${BLUE}Atualizando docs/ (comandos de instalação):${NC}"
find docs/ -type f -name "*.md" | while read -r file; do
  if grep -q "@moltbot/" "$file" 2>/dev/null; then
    echo "  - $file"
    sed -i '' 's|@moltbot/|@openclaw/|g' "$file"
  fi
done

echo ""
echo -e "${BLUE}Atualizando arquivos TypeScript (imports e referências):${NC}"
find src/ test/ -type f -name "*.ts" -not -path "*/node_modules/*" | while read -r file; do
  if grep -q "@moltbot/" "$file" 2>/dev/null; then
    echo "  - $file"
    sed -i '' 's|@moltbot/|@openclaw/|g' "$file"
  fi
done

echo ""
echo "🔧 Phase 3: Repositórios Relacionados"
echo "────────────────────────────────────────────────────────────────────────────────"

echo -e "${BLUE}Atualizando referências a repositórios auxiliares:${NC}"
find docs/ -type f -name "*.md" | while read -r file; do
  if grep -q "moltbot-ansible\|nix-moltbot" "$file" 2>/dev/null; then
    echo "  - $file"
    sed -i '' 's|moltbot/moltbot-ansible|openclaw/openclaw-ansible|g' "$file"
    sed -i '' 's|moltbot/nix-moltbot|openclaw/nix-openclaw|g' "$file"
    sed -i '' 's|moltbot/lobster|openclaw/lobster|g' "$file"
  fi
done

echo ""
echo "═══════════════════════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ Correções aplicadas com sucesso!${NC}"
echo "═══════════════════════════════════════════════════════════════════════════════"
echo ""
echo "📊 Resumo:"
echo "  • Arquivos modificados: $TOTAL_CHANGES+"
echo "  • Branch de backup: backup-before-openclaw"
echo ""
echo "🔍 Próximos passos:"
echo ""
echo "1️⃣  Revisar mudanças:"
echo "    git diff"
echo ""
echo "2️⃣  Verificar arquivos modificados:"
echo "    git status"
echo ""
echo "3️⃣  Testar se compilação funciona:"
echo "    pnpm build"
echo ""
echo "4️⃣  Se tudo OK, commitar:"
echo "    git add ."
echo "    git commit -m \"chore: update upstream references (moltbot → openclaw)\""
echo ""
echo "5️⃣  Se algo der errado, reverter:"
echo "    git checkout ."
echo "    # ou voltar ao backup:"
echo "    git checkout backup-before-openclaw"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANTE:${NC}"
echo "  • Revisar CUIDADOSAMENTE as mudanças antes de commitar!"
echo "  • Testar pnpm build para garantir que não quebrou nada"
echo "  • Atualizar AUDIT_LINKS_OPENCLAW.md com status final"
echo ""
echo -e "${BLUE}📝 Documentação:${NC}"
echo "  Ver auditoria completa: AUDIT_LINKS_OPENCLAW.md"
echo "  Ver análise upstream: UPSTREAM_MIGRATION_OPENCLAW.md"
echo ""
