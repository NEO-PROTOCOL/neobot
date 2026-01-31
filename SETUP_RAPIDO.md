# 🚀 Setup Rápido - NeoBot

**Guia de configuração rápida do ambiente NeoBot em Português**

## ⚡ Pré-requisitos

Antes de começar, você precisa ter instalado:

- **Node.js** ≥ 22.0.0 (recomendado: 22.22.0+)
- **npm** (vem com o Node.js)
- **Git**

## 📋 Passos de Instalação

### 1️⃣ Clone o Repositório

```bash
git clone https://github.com/neomello/neobot.git
cd neobot
```

### 2️⃣ Instale o Node.js 22+ (se necessário)

#### Opção A: Usando `n` (recomendado)

```bash
# Instale o 'n' globalmente (se não tiver)
npm install -g n

# Instale o Node.js 22
sudo n 22

# Verifique a versão
node --version  # deve mostrar v22.x.x
```

#### Opção B: Usando `nvm`

```bash
# Instale o nvm (se não tiver)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# Carregue o nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Instale o Node.js 22
nvm install 22
nvm use 22

# Verifique a versão
node --version  # deve mostrar v22.x.x
```

### 3️⃣ Instale o pnpm

```bash
npm install -g pnpm

# Verifique a instalação
pnpm --version  # deve mostrar 10.x.x ou superior
```

### 4️⃣ Instale as Dependências

```bash
# No diretório do neobot
pnpm install
```

### 5️⃣ Compile o Projeto

```bash
pnpm build
```

### 6️⃣ Verifique a Instalação

```bash
# Teste o CLI
./moltbot.mjs --version
# ou
pnpm moltbot --version

# Veja a ajuda
./moltbot.mjs --help
```

## ✅ Verificação Rápida

Execute estes comandos para confirmar que tudo está funcionando:

```bash
# 1. Versão do Node.js (deve ser 22+)
node --version

# 2. Versão do pnpm
pnpm --version

# 3. Versão do NeoBot
./moltbot.mjs --version

# 4. Executar testes (opcional)
pnpm test
```

## 🎯 Próximos Passos

Após a instalação bem-sucedida:

1. **Configure o bot:**
   ```bash
   pnpm moltbot onboard --install-daemon
   ```

2. **Inicie o Gateway:**
   ```bash
   pnpm moltbot gateway --port 18789
   ```

3. **Explore os comandos:**
   ```bash
   pnpm moltbot --help
   pnpm moltbot health        # Verificar saúde do sistema
   pnpm moltbot skills list   # Listar skills disponíveis
   ```

## 🔧 Solução de Problemas Comuns

### Problema: "command not found: pnpm"

**Solução:** Instale o pnpm globalmente:
```bash
npm install -g pnpm
```

### Problema: "moltbot requires Node >=22.0.0"

**Solução:** Atualize o Node.js para a versão 22+:
```bash
sudo n 22
```

### Problema: Build falha com erro de "form-data"

**Solução:** A dependência já foi adicionada. Execute:
```bash
pnpm install
pnpm build
```

### Problema: Warnings sobre "Unsupported engine"

**Explicação:** Esses são avisos, não erros. O projeto funciona mesmo com esses avisos, mas é recomendado usar Node.js 22.12.0+.

## 📚 Documentação Completa

Para informações detalhadas, consulte:

- [SETUP.md](SETUP.md) - Guia de setup completo
- [README.md](README.md) - Visão geral do projeto
- [GUIA_COMPLETO_NEOBOT.md](GUIA_COMPLETO_NEOBOT.md) - Guia completo em português
- [ARCHITECTURE_NEO_PROTOCOL.md](ARCHITECTURE_NEO_PROTOCOL.md) - Arquitetura

## 💡 Comandos Úteis

```bash
# Desenvolvimento
pnpm dev                    # Modo desenvolvimento
pnpm build                  # Build do projeto
pnpm test                   # Executar testes
pnpm lint                   # Verificar código
pnpm format                 # Formatar código

# NeoBot CLI
pnpm moltbot gateway        # Iniciar gateway
pnpm moltbot health         # Status do sistema
pnpm moltbot doctor         # Diagnóstico
pnpm moltbot skills list    # Listar skills
```

## 🆘 Precisa de Ajuda?

- **Issues:** https://github.com/neomello/neobot/issues
- **Documentação:** https://github.com/neomello/neobot/tree/main/docs
- **Telegram:** @neoprotocol
- **Email:** neo@neoprotocol.space

---

**Criado por:** NEØ MELLØ  
**Versão:** 2026.1.26  
**Última atualização:** 31 de Janeiro de 2026
