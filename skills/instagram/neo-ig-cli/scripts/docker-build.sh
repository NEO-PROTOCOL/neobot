#!/bin/bash

# Script helper para build Docker

set -e

echo "🐳 Building neo-ig-cli Docker image..."

# Verificar se Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Erro: Docker não está rodando. Inicie o Docker e tente novamente."
    exit 1
fi

# Build
docker build -t neo-ig-cli:latest .

echo "✅ Build concluído!"
echo ""
echo "Para executar:"
echo "  docker-compose up -d"
echo "  ou"
echo "  docker run -it --rm neo-ig-cli:latest"

