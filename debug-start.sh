echo "🦞 Limpando TMP local..."
export TMPDIR=$(pwd)/.tmp-debug
mkdir -p $TMPDIR
rm -rf $TMPDIR/moltbot* 2>/dev/null || true

echo "🦞 Iniciando Moltbot (Modo Debug Local) com TMPDIR=$TMPDIR"

# Variáveis de ambiente
export MOLTBOT_STATE_DIR="./.state-debug"
export CLAWDBOT_STATE_DIR="./.state-debug"
export CLAWDBOT_GATEWAY_PORT=18799
export NODE_ENV=production
export CLAWDBOT_GATEWAY_TOKEN="debug-token-123"

# Setup dos diretórios
mkdir -p $MOLTBOT_STATE_DIR

# Executa o gateway
node dist/index.js gateway --bind loopback --allow-unconfigured

echo "🦞 Processo finalizado."

