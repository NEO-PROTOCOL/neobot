# NEO IPFS Status Checker

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![NEO Protocol](https://img.shields.io/badge/NEO-Protocol-purple)

## 📋 Description

**NEO-compliant skill** to check IPFS node status, including peer information, storage usage, and connectivity metrics.

This is the first official skill published on the NEO Skills Registry (IPFS).

## 🎯 Features

- ✅ **Node Information** - Peer ID, Agent Version, Protocol
- ✅ **Storage Metrics** - Used/Available space, Object count
- ✅ **Network Status** - Connected peers, Multiaddresses
- ✅ **Health Check** - Automated diagnostics
- ✅ **JSON Output** - Machine-readable format

## 📦 Installation

### From NEO Registry (IPFS)

```bash
pnpm neobot neo:skill:install neo-ipfs-status
```

### Manual Installation

```bash
# Clone the skill
git clone https://github.com/neomello/neobot
cd neobot/skills/neo-ipfs-status

# Run directly
pnpm tsx index.ts
```

## 🚀 Usage

### Basic Check

```bash
pnpm neobot neo-ipfs-status
```

### JSON Output

```bash
pnpm neobot neo-ipfs-status --json
```

### Help

```bash
pnpm neobot neo-ipfs-status --help
```

## 📊 Example Output

```
╔═══════════════════════════════════════════════════════════╗
║         NEO PROTOCOL - IPFS STATUS CHECKER               ║
╚═══════════════════════════════════════════════════════════╝

📋 Node Info:
   Peer ID:  QmXxx...
   Agent:    kubo/0.30.0
   Protocol: ipfs/0.1.0

🌐 Addresses (12):
   /ip4/127.0.0.1/tcp/4001
   /ip6/::1/tcp/4001
   /p2p-circuit/QmXxx...

💾 Storage:
   Used:    1.23 GB / 10.00 GB (12.3%)
   Objects: 456,789
   Path:    ~/.ipfs

👥 Peers: 42 connected

✅ IPFS node is healthy and running

🔗 Endpoints:
   Gateway: http://127.0.0.1:8080
   API:     http://127.0.0.1:5001
```

## ⚙️ Configuration

Edit `config.ts` to customize:

```typescript
export const IPFS_CONFIG = {
  api: {
    host: '127.0.0.1',
    port: 5001,
    protocol: 'http'
  },
  
  gateway: {
    host: '127.0.0.1',
    port: 8080,
    protocol: 'http'
  },
  
  timeout: 5000 // ms
}
```

## 🔐 Permissions

This skill requires the following permissions:

- `ipfs` - Access to IPFS API
- `read` - Read configuration and environment

## 🧪 Testing

```bash
# Ensure IPFS daemon is running
ipfs daemon

# In another terminal
pnpm neobot neo-ipfs-status
```

## 🐛 Troubleshooting

### IPFS node not responding

**Error**: `IPFS node is not responding`

**Solution**:
1. Check if IPFS daemon is running: `ps aux | grep ipfs`
2. Start daemon: `ipfs daemon`
3. Verify API: `curl http://127.0.0.1:5001/api/v0/id`

### Connection timeout

**Error**: `Connection timed out`

**Solution**:
1. Check firewall settings
2. Increase timeout in `config.ts`
3. Verify IPFS API port (default: 5001)

### Port already in use

**Error**: `EADDRINUSE: address already in use`

**Solution**:
1. Change port in IPFS config: `ipfs config edit`
2. Update `config.ts` to match

## 📚 Related Skills

- `neo-ipfs-publish` - Publish files to IPFS
- `neo-ipfs-pin` - Pin management
- `neo-ipfs-gateway` - Gateway operations

## 🤝 Contributing

This skill is part of the NEO Protocol Stack. Contributions are welcome!

1. Fork the repo
2. Create your feature branch: `git checkout -b feat/new-feature`
3. Commit changes: `git commit -m 'feat: add new feature'`
4. Push to branch: `git push origin feat/new-feature`
5. Open a Pull Request

## 📝 License

MIT License - see [LICENSE](../../LICENSE) for details.

## 🔗 Links

- **GitHub**: https://github.com/neomello/neobot
- **NEO Protocol Docs**: https://neo-docs.mello.eth
- **IPFS Docs**: https://docs.ipfs.tech

---

**Made with ❤️ by the NEO Protocol Team**

*First skill published on NEO Skills Registry (IPFS)*
