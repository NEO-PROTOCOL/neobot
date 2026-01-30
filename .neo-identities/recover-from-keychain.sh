#!/bin/bash
# Recover NEO Protocol keys from iCloud Keychain

echo "Recovering keys from Keychain..."

cat > .env << 'EOF'
# NEO Protocol - Identity Private Keys
# Recovered from iCloud Keychain

EOF

echo "NEO_CORE_PRIVATE_KEY=$(security find-generic-password -s 'NEO Protocol Keys - Core' -w)" >> .env
echo "NEO_GATEWAY_PRIVATE_KEY=$(security find-generic-password -s 'NEO Protocol Keys - Gateway' -w)" >> .env
echo "NEO_SKILLS_PRIVATE_KEY=$(security find-generic-password -s 'NEO Protocol Keys - Skills' -w)" >> .env
echo "NEO_FACTORY_PRIVATE_KEY=$(security find-generic-password -s 'NEO Protocol Keys - Factory' -w)" >> .env
echo "NEO_FLOWPAY_PRIVATE_KEY=$(security find-generic-password -s 'NEO Protocol Keys - FlowPay' -w)" >> .env
echo "NEO_ASI1_PRIVATE_KEY=$(security find-generic-password -s 'NEO Protocol Keys - ASI1' -w)" >> .env
echo "NEO_TELEGRAM_PRIVATE_KEY=$(security find-generic-password -s 'NEO Protocol Keys - Telegram' -w)" >> .env
echo "NEO_WHATSAPP_PRIVATE_KEY=$(security find-generic-password -s 'NEO Protocol Keys - WhatsApp' -w)" >> .env
echo "NEO_IPFS_PRIVATE_KEY=$(security find-generic-password -s 'NEO Protocol Keys - IPFS' -w)" >> .env

echo "✅ .env recovered from Keychain!"
