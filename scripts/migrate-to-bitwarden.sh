#!/bin/bash
# Migra secrets do .env para Bitwarden
set -e

echo "🔐 Migrando secrets .env → Bitwarden"
echo "====================================="
echo ""

# Check session
if [ -z "$BW_SESSION" ]; then
    echo "❌ BW_SESSION não definida"
    echo ""
    echo "Execute primeiro:"
    echo "export BW_SESSION=\$(bw unlock --raw)"
    echo ""
    exit 1
fi

if ! bw status --session "$BW_SESSION" | grep -q "unlocked"; then
    echo "❌ Vault não está desbloqueado"
    exit 1
fi

echo "✅ Vault desbloqueado e pronto"
echo ""

# Check .env exists
if [ ! -f .env ]; then
    echo "❌ .env não encontrado"
    exit 1
fi

echo "📄 Lendo .env..."
echo ""

MIGRATED=0
SKIPPED=0

# Read .env and create items
while IFS='=' read -r key value || [ -n "$key" ]; do
    # Skip comments and empty lines
    [[ $key =~ ^#.*$ ]] && continue
    [[ -z $key ]] && continue
    
    # Remove quotes from value
    value=$(echo "$value" | tr -d '"' | tr -d "'" | xargs)
    
    # Skip if value is empty
    if [ -z "$value" ]; then
        echo "  ⚠️  Skipping $key (empty value)"
        SKIPPED=$((SKIPPED + 1))
        continue
    fi
    
    echo "  📝 Migrando: $key"
    
    # Check if exists
    SEARCH=$(bw list items --search "$key" --session "$BW_SESSION" | grep "\"name\": \"$key\"") || true
    if [ -n "$SEARCH" ]; then
        echo "     ⚠️  Já existe, pulando..."
        SKIPPED=$((SKIPPED + 1))
    else
        # Create secure note JSON
        # We use a secure note (type 2)
        # Note: We need to escape double quotes in the value for JSON
        ESCAPED_VALUE=$(echo "$value" | sed 's/"/\\"/g')
        
        JSON=$(cat <<EOF
{
  "type": 2,
  "name": "$key",
  "notes": "$ESCAPED_VALUE",
  "secureNote": {
    "type": 0
  }
}
EOF
)
        # Encode and Create
        ENCODED=$(echo "$JSON" | bw encode)
        bw create item "$ENCODED" --session "$BW_SESSION" > /dev/null
        
        if [ $? -eq 0 ]; then
            echo "     ✅ Criado!"
            MIGRATED=$((MIGRATED + 1))
        else
            echo "     ❌ Erro ao criar"
        fi
    fi
    
done < .env

echo ""
echo "═══════════════════════════════════════"
echo "✅ Migração completa!"
echo ""
echo "Estatísticas:"
echo "  • Migrados: $MIGRATED"
echo "  • Pulados: $SKIPPED"
echo ""

# Sync
echo "📡 Sincronizando com servidor..."
bw sync --session "$BW_SESSION" > /dev/null
echo "✅ Sincronizado!"
echo ""
