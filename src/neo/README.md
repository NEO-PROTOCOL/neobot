# 🔷 NEO Protocol Layer

**Versão:** 1.0.0-alpha  
**Status:** 🏗️ Em Desenvolvimento

---

## 📦 Estrutura

```
neo/
├── registry/         # IPFS Skills Registry
├── identity/         # mio-system Identity
├── gateway/          # Gateway Extensions (Web3-native)
├── cli/              # NEO CLI Commands
└── sdk/              # Developer SDK
```

## 🎯 Objetivo

O **NEO Protocol Layer** é uma camada descentralizada e autônoma construída sobre o Moltbot Core, fornecendo:

1. **Skills Registry (IPFS)** - Registro descentralizado de skills
2. **mio-system Identity** - Sistema de identidade Web3
3. **Gateway Extensions** - Canais Web3-native (IPFS PubSub, Nostr, etc)
4. **NEO CLI** - Interface de linha de comando
5. **NEO SDK** - SDK para desenvolvedores

## 🚀 Quick Start

```bash
# Instalar dependências NEO
pnpm install

# Info do protocolo NEO
pnpm neobot neo:info

# Listar skills NEO
pnpm neobot neo:skill:list

# Criar identidade mio-system
pnpm neobot neo:identity:create --name "My Bot"
```

## 📚 Documentação

Ver: [ARCHITECTURE_NEO_PROTOCOL.md](../ARCHITECTURE_NEO_PROTOCOL.md)

## 🤝 Contribuindo

1. Fork o repo
2. Branch: `neo/feature-xyz`
3. Commit: `feat(neo): add xyz`
4. PR

## 📝 Licença

MIT License - NEO Protocol Layer
