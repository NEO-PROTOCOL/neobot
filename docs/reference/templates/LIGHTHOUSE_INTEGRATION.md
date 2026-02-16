# Lighthouse IPFS Integration

## ✅ Status: Funcionando

Lighthouse foi integrado como provedor principal de IPFS storage para o NEO Skills Registry.

## Por que Lighthouse?

1. **Web3 Descentralizado**: Alinhado com a filosofia NEØ Protocol
2. **Pin by CID no plano gratuito**: Diferente do Pinata que requer plano pago
3. **Gateway dedicado**: `https://gateway.lighthouse.storage/ipfs/{cid}`
4. **Integração Filecoin**: Redundância adicional via Filecoin

## Configuração

Adicione no `.env`:

```bash
LIGHTHOUSE_API_KEY=your_api_key_here
```

## Como Funciona

### Prioridade de Pinning

1. **Lighthouse** (se configurado) - ✅ Prioridade
2. **Pinata** (se configurado) - Fallback
3. **Local IPFS** - Sempre ativo

### Durante Publicação de Skills

Quando você publica uma skill:

```bash
pnpm neobot neo skill publish ./skills/my-skill
```

O sistema automaticamente:
1. Publica no IPFS local
2. Pina no Lighthouse (se configurado)
3. Pina no Pinata (se Lighthouse não estiver configurado)

### Gateway URLs

Cada skill publicada recebe múltiplas URLs de acesso:

- **Local**: `http://127.0.0.1:8080/ipfs/{cid}`
- **Public IPFS**: `https://ipfs.io/ipfs/{cid}`
- **Lighthouse**: `https://gateway.lighthouse.storage/ipfs/{cid}` ✅
- **Pinata**: `https://your-gateway.mypinata.cloud/ipfs/{cid}` (requer plano pago)

## Testes

### Testar Pinning

```bash
node --import tsx scripts/test-lighthouse.ts
```

### Verificar Gateway

```bash
curl https://gateway.lighthouse.storage/ipfs/{cid}
```

## Comparação: Lighthouse vs Pinata

| Feature | Lighthouse | Pinata |
|---------|-----------|--------|
| Pin by CID (free) | ✅ Sim | ❌ Requer plano pago |
| Web3 Descentralizado | ✅ Sim | ⚠️ Centralizado |
| Gateway dedicado | ✅ Sim | ✅ Sim |
| Filecoin integration | ✅ Sim | ❌ Não |
| Plano gratuito | ✅ Generoso | ⚠️ Limitado |

## Próximos Passos

- [ ] Monitorar uso do Lighthouse
- [ ] Implementar retry logic para pinning
- [ ] Adicionar métricas de sucesso/falha
- [ ] Considerar Infura IPFS como terceira opção

## Referências

- [Lighthouse Docs](https://docs.lighthouse.storage/)
- [Pin CID API](https://docs.lighthouse.storage/lighthouse-1/how-to/pin-cid)
- [Gateway](https://gateway.lighthouse.storage/)
