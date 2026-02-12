#!/bin/bash

# Script para padronizar formatação de arquivos Markdown no projeto NeoBot
# Autor: NeoBot Team
# Data: 2026-01-28

set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  📝 NeoBot Markdown Formatter${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"

# Função para processar um arquivo
process_file() {
    local file="$1"
    local temp_file="${file}.tmp"
    local changes=0
    
    echo -e "${YELLOW}Processando:${NC} $file"
    
    # Backup do arquivo original
    cp "$file" "${file}.backup"
    
    # Processar arquivo linha por linha
    awk '
    BEGIN {
        prev_line = ""
        prev_was_header = 0
        prev_was_colon = 0
    }
    {
        current_line = $0
        
        # Regra 1: Adicionar linha vazia após cabeçalhos (###, ##, #)
        if (prev_was_header && current_line != "" && current_line !~ /^$/) {
            print ""
        }
        
        # Regra 2: Adicionar linha vazia após linhas que terminam com ":"
        # (exceto se já houver linha vazia ou for dentro de código)
        if (prev_was_colon && current_line != "" && current_line !~ /^$/ && current_line !~ /^```/) {
            print ""
        }
        
        # Detectar cabeçalhos para próxima iteração
        if (current_line ~ /^#{1,6} /) {
            prev_was_header = 1
        } else {
            prev_was_header = 0
        }
        
        # Detectar linhas que terminam com ":" para próxima iteração
        if (current_line ~ /:$/ && current_line !~ /^```/ && current_line !~ /http:/ && current_line !~ /https:/) {
            prev_was_colon = 1
        } else {
            prev_was_colon = 0
        }
        
        # Regra 3: Substituir underline (_) por hífen (-) em listas
        if (current_line ~ /^_ /) {
            gsub(/^_ /, "- ", current_line)
        }
        
        # Imprimir linha atual
        print current_line
        prev_line = current_line
    }
    ' "$file" > "$temp_file"
    
    # Verificar se houve mudanças
    if ! cmp -s "$file" "$temp_file"; then
        mv "$temp_file" "$file"
        changes=1
        echo -e "  ${GREEN}✓${NC} Formatado com sucesso"
    else
        rm "$temp_file"
        echo -e "  ${BLUE}ℹ${NC} Nenhuma mudança necessária"
    fi
    
    # Remover backup se não houver mudanças
    if [ $changes -eq 0 ]; then
        rm "${file}.backup"
    fi
    
    return $changes
}

# Contador de arquivos processados
total_files=0
modified_files=0

# Encontrar todos os arquivos .md (excluindo node_modules, .git, dist)
echo -e "\n${BLUE}Buscando arquivos .md...${NC}\n"

while IFS= read -r -d '' file; do
    ((total_files++))
    if process_file "$file"; then
        ((modified_files++))
    fi
    echo ""
done < <(find . -name "*.md" \
    -not -path "*/node_modules/*" \
    -not -path "*/.git/*" \
    -not -path "*/dist/*" \
    -not -path "*/.cursor/*" \
    -not -path "*/coverage/*" \
    -print0)

# Resumo
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}  📊 Resumo${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "\n  Total de arquivos: ${YELLOW}${total_files}${NC}"
echo -e "  Arquivos modificados: ${GREEN}${modified_files}${NC}"
echo -e "  Arquivos sem mudanças: ${BLUE}$((total_files - modified_files))${NC}\n"

if [ $modified_files -gt 0 ]; then
    echo -e "${GREEN}✓ Formatação concluída!${NC}"
    echo -e "\n${YELLOW}ℹ Backups criados:${NC} *.md.backup"
    echo -e "${YELLOW}ℹ Para remover backups:${NC} find . -name '*.md.backup' -delete\n"
else
    echo -e "${BLUE}ℹ Todos os arquivos já estão formatados corretamente!${NC}\n"
fi

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
