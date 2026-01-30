#!/bin/bash
#
# NEO Protocol - Backup Seguro de Private Keys
# 
# Este script cria um backup criptografado das private keys

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ENV_FILE="${SCRIPT_DIR}/.env"
BACKUP_FILE="${SCRIPT_DIR}/neo-keys-backup-$(date +%Y%m%d-%H%M%S).gpg"

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║     NEO PROTOCOL - BACKUP SEGURO DE PRIVATE KEYS           ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Verificar se .env existe
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Arquivo .env não encontrado em: $ENV_FILE"
    exit 1
fi

echo "📁 Arquivo encontrado: .env"
echo "📊 Linhas: $(wc -l < "$ENV_FILE")"
echo ""

# Opção 1: GPG (criptografia com senha)
if command -v gpg &> /dev/null; then
    echo "🔐 Criando backup criptografado com GPG..."
    echo ""
    echo "⚠️  Digite uma SENHA FORTE para criptografar o backup:"
    echo "   (você precisará desta senha para recuperar as keys)"
    echo ""
    
    gpg --symmetric --cipher-algo AES256 --output "$BACKUP_FILE" "$ENV_FILE"
    
    if [ -f "$BACKUP_FILE" ]; then
        echo ""
        echo "✅ Backup criado com sucesso!"
        echo "   Arquivo: $BACKUP_FILE"
        echo ""
        echo "📋 Para recuperar as keys:"
        echo "   gpg --decrypt $BACKUP_FILE > .env"
        echo ""
        echo "🔐 Guarde este arquivo em um local seguro:"
        echo "   - Cloud storage privado (Google Drive, Dropbox)"
        echo "   - Pen drive criptografado"
        echo "   - Disco externo"
        echo ""
        echo "❓ Deseja deletar o arquivo .env original? (s/N)"
        read -r response
        
        if [[ "$response" =~ ^[Ss]$ ]]; then
            # Sobrescrever com zeros antes de deletar (mais seguro)
            shred -u "$ENV_FILE" 2>/dev/null || srm "$ENV_FILE" 2>/dev/null || rm -P "$ENV_FILE" 2>/dev/null || rm "$ENV_FILE"
            echo "✅ Arquivo .env deletado com segurança"
        else
            echo "ℹ️  Arquivo .env mantido (lembre-se de deletar manualmente depois)"
        fi
    else
        echo "❌ Erro ao criar backup"
        exit 1
    fi
else
    # Opção 2: OpenSSL (alternativa)
    echo "⚠️  GPG não encontrado. Usando OpenSSL..."
    echo ""
    echo "🔐 Digite uma SENHA FORTE para criptografar:"
    
    BACKUP_FILE="${SCRIPT_DIR}/neo-keys-backup-$(date +%Y%m%d-%H%M%S).enc"
    
    openssl enc -aes-256-cbc -salt -in "$ENV_FILE" -out "$BACKUP_FILE" -pbkdf2
    
    if [ -f "$BACKUP_FILE" ]; then
        echo ""
        echo "✅ Backup criado: $BACKUP_FILE"
        echo ""
        echo "📋 Para recuperar:"
        echo "   openssl enc -aes-256-cbc -d -in $BACKUP_FILE -out .env -pbkdf2"
    fi
fi

echo ""
echo "✅ Backup concluído!"
echo ""
