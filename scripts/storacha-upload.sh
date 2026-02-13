#!/bin/bash
# NΞØ Protocol: Storacha Sovereign Upload
# Author: Antigravity

set -e

# Configurações do Storacha (UCAN do Mello)
UCAN_TOKEN="z4MXj1wBzi9jUstyPWmomSd1pFwszvphKndMbzxrAdxYPNYpEhdHeDWvtULKgrWfbbSXFeQZbpnSPihq2NFL1GaqvFGRPYRRKzap12r57RdqvUEBdvbravLoKd5ZTsU6AwfoE6qfn8cGvCkxeZTwSAH5ob3frxH85px2TGYDJ9hPGFnkFo5Ysoc2gk9fvK9Q1Esod5Mv6CMDbnT3icR2jYZWsaBNzzfB5vhd4YQtkghxuzZABtyJYYz54FbjD6AXuogZksorduWuZT4f8wKoinsZ86UqsKPHxquSDSfLjGiVaT8BTGoRg7kri8fZGKA2tukYug4TiQVDprgGEbL6N85XHDJ2RQ6EVwscrhLG38aSzqms1Mjjv"

if [ -z "$1" ]; then
    echo "Uso: ./scripts/storacha-upload.sh [ARQUIVO]"
    exit 1
fi

FILE_PATH="$1"

if [ ! -f "$FILE_PATH" ]; then
    echo "Erro: Arquivo $FILE_PATH não encontrado."
    exit 1
fi

echo "🚀 Iniciando upload para Storacha: $FILE_PATH"
echo "📡 DID: did:key:z6Mkjee3CCaP6q2vhRnE3wRBGNqMxEq645EvnYocsbbeZiBR"

# Executa via npx delegando o UCAN para autenticação sem login manual
# Usamos -y para não pedir confirmação e um cache temporário para evitar erros de permissão
export npm_config_cache=/tmp/npm_cache_storacha
npx -y @storacha/cli put "$FILE_PATH" --secret "$UCAN_TOKEN"
