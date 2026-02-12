# 🏭 Smart Factory Skills

**Versão:** 1.0.0  
**Status:** ✅ Estrutura criada  
**Camada:** Valor & Token

---

## 📖 Descrição

Skills para interagir com NEØ Smart Factory (Neural Core V2). Permite deploy de contratos, mint de tokens, bridge cross-chain e status monitoring.

---

## 🎯 Casos de Uso

1. **Deploy de Contratos**
   - Deployer NeoTokenV2 na Base/Polygon/TON
   - Criar factories customizadas
   - Verificar contratos no Basescan/Polygonscan

2. **Mint de Tokens**
   - Mint de $NEOFLW
   - Batch minting para liquidez
   - Mint para endereços específicos

3. **Bridge Cross-Chain**
   - Transferir tokens Base → Polygon
   - Transferir tokens Base → TON
   - Status de bridge transactions

4. **Monitoring**
   - Status de deployments
   - Saldo de contratos
   - Liquidez em DEXs

---

## 📂 Arquivos

```
skills/smart-factory/
├── SKILL.md              # Este arquivo
├── deploy.ts             # Deploy de contratos
├── mint.ts               # Mint de tokens
├── bridge.ts             # Bridge cross-chain
├── status.ts             # Status monitoring
└── README.md             # Documentação de uso
```

---

## 🔧 Comandos CLI (Planejados)

```bash
# Deploy
moltbot factory deploy --network base --token NEOFLW
moltbot factory deploy --network ton --jetton NeoJetton

# Mint
moltbot factory mint --token NEOFLW --amount 1000000 --to 0x...
moltbot factory mint:batch --file ./mint-list.json

# Bridge
moltbot factory bridge --from base --to polygon --amount 10000
moltbot factory bridge:status --tx 0x...

# Status
moltbot factory status --network base
moltbot factory contracts --all
```

---

## 🔗 Integração

### Local
- **smart-core:** `/Users/nettomello/CODIGOS/neo-smart-token/smart-core/`
- **Scripts:** `scripts/deploy.js`, `scripts/deployV2.js`
- **Config:** `hardhat.config.js`, `tact.config.json`

### GitHub
- [smart-core](https://github.com/neo-smart-token-factory/smart-core)
- [docs](https://github.com/neo-smart-token-factory/docs)

### Notion
- [Smart Factory Page](https://www.notion.so/2f78c6e83be08129bcfcf52c91ebc00a)
- [Projetos Database](https://www.notion.so/29fb6f21b53441c08a2a88dbefedc498)

---

## 🚀 Próximos Passos

1. Implementar `deploy.ts` usando Hardhat programmatically
2. Integrar com Neobot Ledger (audit de deploys)
3. Adicionar notificação Telegram após deploy
4. Criar dashboard view no Neobot UI

---

**Criado em:** 29 Janeiro 2026  
**Node Arquiteto:** NODE NEØ
