#!/bin/bash

# NΞØ Protocol :: Deploy Health Monitor
# Baseado no DEPLOY_SUCCESS_CHECKLIST.md

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${CYAN}🔍 Iniciando Monitoramento de Deploy NΞØ Protocol...${NC}"
echo -e "═══════════════════════════════════════════════════════════"

# 1. Verificar Variáveis de Ambiente Críticas
echo -ne "📡 1. Verificando Variáveis de Ambiente... "
CHECK_LLM=$(railway variables get LLM_MODEL 2>/dev/null)
if [[ "$CHECK_LLM" == *"claude-sonnet-4-20250514"* ]]; then
    echo -e "${GREEN}OK (claude-sonnet-4-20250514)${NC}"
else
    echo -e "${RED}ERRO${NC}"
    echo -e "   Esperado: claude-sonnet-4-20250514"
    echo -e "   Encontrado: $CHECK_LLM"
fi

# 2. Verificar Logs para Modelo em Uso
echo -ne "🧠 2. Validando Modelo nos Logs... "
LOG_MODEL=$(railway logs --lines 200 2>/dev/null | grep "Using Anthropic" | tail -1)
if [[ "$LOG_MODEL" == *"claude-sonnet-4-20250514"* ]]; then
    echo -e "${GREEN}OK${NC}"
else
    echo -e "${YELLOW}AVISO: Não encontrado nos últimos 200 logs.${NC}"
fi

# 3. Verificar Conexão WhatsApp
echo -ne "📱 3. Status WhatsApp... "
WA_LOG=$(railway logs --lines 200 2>/dev/null | grep "WhatsApp Conectado" | tail -1)
if [[ -n "$WA_LOG" ]]; then
    echo -e "${GREEN}CONECTADO${NC}"
else
    echo -e "${RED}DESCONECTADO (ou log não encontrado)${NC}"
fi

# 4. Verificar Erros 404 de Modelo
echo -ne "🚨 4. Verificando Erros 404... "
ERROR_404=$(railway logs --lines 200 2>/dev/null | grep -i "404" | grep "model")
if [[ -z "$ERROR_404" ]]; then
    echo -e "${GREEN}LIMPO${NC}"
else
    echo -e "${RED}ERROS DETECTADOS!${NC}"
    echo "$ERROR_404"
fi

# 5. Status do Túnel
echo -ne "🚇 5. Status NΞØ Tunnel... "
TUNNEL_HEALTH=$(curl -sf https://tunnel.neoprotocol.space/health 2>/dev/null)
if [[ "$TUNNEL_HEALTH" == *"online"* ]] || [[ "$TUNNEL_HEALTH" == *"ok"* ]] || [[ "$TUNNEL_HEALTH" == *"status"* ]]; then
    echo -e "${GREEN}ONLINE${NC}"
else
    echo -e "${RED}OFFLINE${NC}"
fi

echo -e "═══════════════════════════════════════════════════════════"
echo -e "${CYAN}Dica: Use 'railway logs --lines 100' para monitoramento contínuo.${NC}"
