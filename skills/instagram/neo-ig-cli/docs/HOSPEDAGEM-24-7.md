# 🌐 Guia de Hospedagem 24/7 - Instagram CLI Multiagente

## 📋 Visão Geral

Este guia detalha as melhores opções para manter seu sistema multiagente rodando 24/7, garantindo disponibilidade contínua para automação do Instagram.

## 🥇 Opção 1: Railway (Recomendado para Iniciantes)

### Por que Railway?
- ✅ **Deploy em 5 minutos** - Zero configuração
- ✅ **24/7 automático** - Gerenciamento completo
- ✅ **SSL gratuito** - HTTPS automático
- ✅ **GitHub integrado** - Deploy automático a cada push
- ✅ **Plano gratuito** para começar

### Como fazer:

#### Passo 1: Criar conta
```bash
# Acesse: https://railway.app
# Conecte com GitHub
```

#### Passo 2: Deploy automático
```bash
# Railway detecta automaticamente o projeto Node.js
# Primeiro deploy leva ~5 minutos
# Depois: todo push no GitHub faz deploy automático
```

#### Passo 3: Configurar variáveis
```bash
# No Railway Dashboard → Variables:
INSTAGRAM_USERNAME=seu_usuario
INSTAGRAM_PASSWORD=sua_senha
NODE_ENV=production
```

#### Custos:
- **Gratuito:** $5 de créditos/mês
- **Hobby:** $5/mês (512MB RAM, 1GB storage)
- **Pro:** $20/mês (4GB RAM, 32GB storage)

---

## 🥈 Opção 2: Docker em VPS (Para Controle Total)

### VPS Recomendados:
- **DigitalOcean:** $6/mês (1GB RAM)
- **Linode:** $5/mês (1GB RAM)
- **Vultr:** $3.50/mês (512MB RAM)
- **Hetzner:** €3/mês (2GB RAM)

### Setup em 10 minutos:
```bash
# 1. Conectar no VPS
ssh root@seu_vps

# 2. Instalar Docker
curl -fsSL https://get.docker.com | sh

# 3. Clonar projeto
git clone https://github.com/seu-repo/neo-ig-cli
cd neo-ig-cli

# 4. Build e run
docker-compose up -d --build

# 5. Configurar domínio (opcional)
# Usar Nginx reverse proxy ou Cloudflare Tunnel
```

### Monitoramento 24/7:
```bash
# Ver se está rodando
docker-compose ps

# Ver logs
docker-compose logs -f

# Restart automático
docker-compose restart
```

---

## 🥉 Opção 3: Render (Semelhante ao Railway)

### Vantagens:
- ✅ **Deploy direto do GitHub**
- ✅ **Free tier** generoso
- ✅ **Auto-scaling**
- ✅ **Logs em tempo real**

### Limitações:
- ❌ **Sleep after 15min** de inatividade (free tier)
- ❌ **Cold starts** possíveis

---

## 🏠 Opção 4: Servidor Próprio/Local

### Se você tem servidor:
```bash
# Raspberry Pi, mini-PC, ou servidor local
# Manter sempre ligado

# Usar PM2 para gerenciar processo
npm install -g pm2
pm2 start dist/cli.js --name instagram-agent
pm2 startup
pm2 save
```

### Com Docker local:
```bash
# Manter máquina sempre ligada
docker-compose up -d

# Acessar remotamente via SSH ou API
```

---

## 🎯 Recomendação para seu Multiagente:

### Para Começar: Railway
```
🚀 Fácil + Rápido + 24/7 automático
↓
💰 Custos baixos ($5/mês)
↓
📊 Monitoramento incluído
```

### Para Produção: VPS + Docker
```
🔧 Controle total + Escalável
↓
💪 Melhor performance
↓
🔒 Segurança avançada
```

## ⚙️ Configuração para 24/7:

### 1. Health Checks (Importante)
```typescript
// Adicionar no seu agente
setInterval(() => {
  // Ping para verificar se está vivo
  console.log(`Agent alive: ${new Date().toISOString()}`);
}, 60000); // A cada minuto
```

### 2. Auto-restart
```bash
# Railway faz isso automaticamente
# Docker: restart: unless-stopped no compose
# PM2: pm2 startup && pm2 save
```

### 3. Logs Centralizados
```bash
# Railway: Logs no dashboard
# Docker: docker-compose logs -f
# VPS: Usar serviço como Papertrail ou ELK stack
```

### 4. Backup Automático
```bash
# Railway: Snapshots automáticos
# Docker: Scripts de backup
# VPS: Cron jobs para backup
```

## 🚨 Avisos Importantes:

### 1. Rate Limiting
Instagram tem limites de API. Configure delays entre ações:
```typescript
// Aguardar entre posts
await new Promise(resolve => setTimeout(resolve, 30000)); // 30s
```

### 2. Monitoramento
Configure alertas para quando o agente parar:
- Railway: Notificações por email
- VPS: Scripts de monitoring (Monit, Nagios)

### 3. Segurança
- **Nunca** exponha credenciais
- Use **Railway Secrets** ou **Docker Secrets**
- Configure **firewall** no VPS

---

## 🎉 Conclusão:

**Para começar hoje:** Railway (5 minutos para deploy)
**Para produção séria:** VPS + Docker (mais controle)
**Para sempre online:** Ambos mantêm 24/7 automaticamente
