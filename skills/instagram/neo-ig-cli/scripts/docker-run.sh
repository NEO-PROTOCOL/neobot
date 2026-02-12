#!/bin/bash

# Script helper para executar container Docker

set -e

CONTAINER_NAME="neo-ig-cli"
IMAGE_NAME="neo-ig-cli:latest"

# Verificar se imagem existe
if ! docker image inspect "$IMAGE_NAME" > /dev/null 2>&1; then
    echo "📦 Imagem não encontrada. Fazendo build..."
    docker build -t "$IMAGE_NAME" .
fi

# Verificar se container já existe
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "⚠️  Container já existe. Removendo..."
    docker rm -f "$CONTAINER_NAME" > /dev/null 2>&1 || true
fi

echo "🚀 Iniciando container..."

# Executar container
docker run -it \
    --name "$CONTAINER_NAME" \
    -v neo-ig-data:/app/data \
    -e NODE_ENV=production \
    "$IMAGE_NAME" \
    "$@"

