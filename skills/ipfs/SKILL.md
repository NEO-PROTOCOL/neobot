# 📦 IPFS Storage Integration

**Versão:** 1.0.0  
**Status:** 🟢 Ativo  
**Node:** Peer ID `12D3KooWBSy5SgGEgnSboE6Kqg3GaRe8aKF7YLqcJfHPaRLRXBSX`

---

## 📖 Descrição

Integração com nó IPFS local (kubo v0.39.0) para armazenamento descentralizado de:
- Logs do Ceramic Network
- Memória do neo-agent-full
- Backups de configuração
- Media files (images, videos)

---

## 🎯 Casos de Uso

### 1. Upload de Arquivo
```bash
pnpm moltbot ipfs upload ./file.json
# Output: QmHash123...
```

### 2. Download de Arquivo
```bash
pnpm moltbot ipfs fetch QmHash123... --output ./downloaded.json
```

### 3. Pin de Conteúdo
```bash
pnpm moltbot ipfs pin QmHash123...
```

### 4. Status do Nó
```bash
pnpm moltbot ipfs status
```

---

## 🚀 Setup

### Nó Já Ativo

O nó IPFS local já está rodando:
- **Peer ID:** `12D3KooWBSy5SgGEgnSboE6Kqg3GaRe8aKF7YLqcJfHPaRLRXBSX`
- **Agent:** kubo v0.39.0
- **Desktop UI:** 3b52cab
- **API:** http://127.0.0.1:5001
- **Gateway:** http://127.0.0.1:8080

### Verificar Status

```bash
# Via HTTP API
curl http://127.0.0.1:5001/api/v0/id | jq

# Via skill
pnpm moltbot ipfs status
```

---

## 📋 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `ipfs upload <file>` | Upload arquivo para IPFS |
| `ipfs fetch <hash>` | Download arquivo do IPFS |
| `ipfs pin <hash>` | Pin conteúdo (permanente) |
| `ipfs unpin <hash>` | Unpin conteúdo |
| `ipfs status` | Status do nó local |
| `ipfs peers` | Lista peers conectados |
| `ipfs stats` | Estatísticas de storage |

---

## 🔧 Arquitetura

```
skills/ipfs/
├── SKILL.md            # Esta documentação
├── upload.ts           # Upload files
├── fetch.ts            # Download files
├── pin.ts              # Pin/Unpin management
├── status.ts           # Node status
└── config.ts           # IPFS config
```

### Fluxo de Upload

```
File → upload.ts
    ↓
IPFS HTTP API (localhost:5001)
    ↓
Store + Generate CID (QmHash...)
    ↓
Return CID to user
```

### Fluxo de Fetch

```
CID (QmHash...) → fetch.ts
    ↓
IPFS HTTP API (localhost:5001)
    ↓
Retrieve content
    ↓
Save to output file
```

---

## 🔗 Integrações

### neo-agent-full
- Armazenar logs de memória no IPFS
- Ceramic Network usa IPFS como backend

### Neobot
- Backup de configurações
- Media storage (Telegram, WhatsApp)

### Smart Factory
- Metadata de tokens (imagens, JSONs)
- Proofs de transações

---

## 📊 Exemplos de Uso

### Exemplo 1: Upload JSON Config
```bash
pnpm moltbot ipfs upload .env.example
# Output:
# ✅ Uploaded to IPFS
# CID: QmXk2Abc...
# URL: http://127.0.0.1:8080/ipfs/QmXk2Abc...
```

### Exemplo 2: Fetch e Save
```bash
pnpm moltbot ipfs fetch QmXk2Abc... --output config-backup.json
# Output:
# ✅ Downloaded from IPFS
# Saved to: config-backup.json
# Size: 1.2 KB
```

### Exemplo 3: Pin Important Content
```bash
pnpm moltbot ipfs pin QmXk2Abc...
# Output:
# ✅ Content pinned
# CID: QmXk2Abc...
# Status: Permanent
```

### Exemplo 4: Check Node Status
```bash
pnpm moltbot ipfs status
# Output:
# 🟢 IPFS Node Status
# ─────────────────────
# Peer ID: 12D3KooWBSy5SgGEgnSboE6Kqg3GaRe8aKF7YLqcJfHPaRLRXBSX
# Agent: kubo/v0.39.0
# Addresses: 5 active
# Peers: 42 connected
# Storage: 2.3 GB used
```

---

## 🔐 Segurança

### API Local
- IPFS API acessível apenas em localhost
- Não exposto publicamente

### Content Addressing
- Conteúdo identificado por CID (hash)
- Imutável (qualquer mudança = novo CID)

### Pinning
- Pin = conteúdo permanente (não será coletado)
- Unpin = pode ser removido pelo garbage collector

---

## 📈 Roadmap

### v1.1 (Esta Semana)
- [ ] Implementar upload.ts
- [ ] Implementar fetch.ts
- [ ] Implementar pin.ts
- [ ] Implementar status.ts

### v1.2 (Próximas 2 Semanas)
- [ ] Integração com Ceramic Network
- [ ] Backup automático de configs
- [ ] Media storage para Telegram/WhatsApp

### v2.0 (Futuro)
- [ ] IPFS Cluster (múltiplos nós)
- [ ] Pinning service remoto (Pinata/Web3.Storage)
- [ ] Encrypted storage (private data)

---

## 🐛 Troubleshooting

### Nó IPFS não responde
1. Verificar se kubo está rodando
2. Testar: `curl http://127.0.0.1:5001/api/v0/id`
3. Reiniciar: `ipfs daemon`

### Upload falha
1. Verificar permissões de arquivo
2. Verificar espaço em disco
3. Verificar logs: `ipfs log tail`

### Fetch timeout
1. CID pode não existir na rede
2. Peers desconectados
3. Tentar gateway público: `https://ipfs.io/ipfs/QmHash...`

---

## 🔗 Links Úteis

- **IPFS Docs:** https://docs.ipfs.tech
- **kubo GitHub:** https://github.com/ipfs/kubo
- **HTTP API Ref:** https://docs.ipfs.tech/reference/kubo/rpc/
- **Desktop UI:** http://127.0.0.1:5001/webui

---

**Última Atualização:** 30 Janeiro 2026  
**Status:** ✅ Skill documentada, implementação pendente
