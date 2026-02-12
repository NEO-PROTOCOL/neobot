#!/bin/bash
# Script para buscar mudanças nos projetos NEO nos últimos 2 dias
# Data: 04 e 05 de Fevereiro de 2026

echo "================================================================"
echo "   NEO PROTOCOL :: RECENT CHANGES REPORT"
echo "   Period: Feb 04-05, 2026"
echo "================================================================"
echo ""

# Lista de projetos principais do NEO Protocol
PROJECTS=(
    "neobot"
    "neo-agent-full"
    "neo-nexus"
    "neo-smart-factory"
    "neo-flowoff-pwa"
    "neo-flowoff-landing"
    "flowpay"
    "flowpay-core"
    "neo-protocol-landing"
    "neo-dashboard-deploy"
)

BASE_DIR="/Users/nettomello/CODIGOS"

# Função para verificar commits recentes
check_project() {
    local project=$1
    local project_path="$BASE_DIR/$project"
    
    if [ ! -d "$project_path/.git" ]; then
        return
    fi
    
    cd "$project_path" || return
    
    # Buscar commits dos últimos 2 dias
    local commits=$(git log --since="2026-02-04 00:00:00" --until="2026-02-05 23:59:59" --oneline 2>/dev/null)
    
    if [ -n "$commits" ]; then
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "📦 PROJECT: $project"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        
        # Branch atual
        local branch=$(git branch --show-current)
        echo "🌿 Branch: $branch"
        
        # Status
        local status=$(git status --short)
        if [ -n "$status" ]; then
            echo "⚠️  Uncommitted changes detected"
        fi
        
        echo ""
        echo "📝 Recent Commits:"
        echo "$commits"
        
        # Estatísticas
        local commit_count=$(echo "$commits" | wc -l | tr -d ' ')
        local files_changed=$(git diff --stat HEAD~${commit_count}..HEAD 2>/dev/null | tail -1)
        
        if [ -n "$files_changed" ]; then
            echo ""
            echo "📊 Changes: $files_changed"
        fi
        
        echo ""
    fi
}

# Verificar cada projeto
for project in "${PROJECTS[@]}"; do
    check_project "$project"
done

echo "================================================================"
echo "   REPORT COMPLETE"
echo "================================================================"
