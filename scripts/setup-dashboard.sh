#!/bin/bash

# 🎨 Setup Script para NeoBot Dashboard
# Este script configura e inicia o dashboard automaticamente

set -e

echo "
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🎨 Setup do Dashboard NeoBot                        ║
║   iOS-style Bento Grid Dashboard                     ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
"

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções auxiliares
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Verificar se está no diretório correto
if [ ! -f "package.json" ]; then
    print_error "Execute este script na raiz do projeto!"
    exit 1
fi

print_info "Verificando dependências..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js não encontrado! Instale Node.js 22+ primeiro."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 22 ]; then
    print_warning "Node.js $NODE_VERSION detectado. Recomendado: 22+"
fi

print_success "Node.js $(node -v) encontrado"

# Verificar npm/pnpm
if command -v pnpm &> /dev/null; then
    PKG_MANAGER="pnpm"
    print_success "pnpm encontrado"
elif command -v npm &> /dev/null; then
    PKG_MANAGER="npm"
    print_success "npm encontrado"
else
    print_error "npm ou pnpm não encontrado!"
    exit 1
fi

# Instalar dependências do projeto principal
print_info "Instalando dependências do projeto..."
$PKG_MANAGER install

# Verificar .env
if [ ! -f ".env" ]; then
    print_warning "Arquivo .env não encontrado!"
    print_info "Criando .env de exemplo..."
    
    cat > .env << EOF
# Telegram Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_ADMIN_CHAT=your_chat_id_here

# Claude AI Configuration
ANTHROPIC_API_KEY=your_anthropic_key_here

# Neo Core Configuration
NEO_CORE_PRIVATE_KEY=your_neo_core_private_key_here

# Dashboard Configuration
DASHBOARD_PORT=3000
EOF

    print_success "Arquivo .env criado! Configure suas credenciais antes de iniciar."
    print_warning "Edite o arquivo .env com suas credenciais reais!"
else
    print_success "Arquivo .env encontrado"
fi

# Build do projeto TypeScript
print_info "Compilando TypeScript..."
$PKG_MANAGER run build

print_success "Projeto compilado com sucesso!"

# Verificar se o dashboard existe
if [ ! -d "dashboard" ]; then
    print_error "Diretório dashboard não encontrado!"
    exit 1
fi

# Instalar dependências do dashboard
cd dashboard

if [ ! -f "package.json" ]; then
    print_info "Criando package.json do dashboard..."
    
    cat > package.json << EOF
{
  "name": "neobot-dashboard",
  "version": "1.0.0",
  "description": "iOS-style Dashboard for NeoBot",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  },
  "dependencies": {
    "express": "^5.2.1",
    "cors": "^2.8.5"
  }
}
EOF
    
    print_success "package.json criado!"
fi

print_info "Instalando dependências do dashboard..."
npm install

cd ..

print_success "Setup concluído!"

echo "
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   ✅ Setup Concluído com Sucesso!                     ║
║                                                       ║
║   📋 Próximos passos:                                 ║
║                                                       ║
║   1. Configure suas credenciais no .env              ║
║   2. Inicie o dashboard:                             ║
║      $ cd dashboard && node server.js                ║
║                                                       ║
║   3. Acesse: http://localhost:3000                   ║
║                                                       ║
║   📚 Documentação:                                    ║
║   - Dashboard: dashboard/README.md                   ║
║   - Automações: docs/automations-guide.md            ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
"

# Perguntar se deseja iniciar agora
read -p "Deseja iniciar o dashboard agora? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    print_info "Iniciando dashboard..."
    cd dashboard
    node server.js
fi
