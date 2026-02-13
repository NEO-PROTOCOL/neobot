# Guia de Deploy - Docker vs Railway

Este documento compara as opções de deploy para o neo-ig-cli e fornece instruções detalhadas para cada uma.

## Comparação: Docker vs Railway

### Docker (Local/Próprio Servidor)

**Vantagens:**
- ✅ Controle total sobre o ambiente
- ✅ Sem custos de hospedagem (se você tem servidor próprio)
- ✅ Flexibilidade total de configuração
- ✅ Pode rodar em qualquer lugar (VPS, servidor local, etc.)
- ✅ Melhor para desenvolvimento e testes locais
- ✅ Isolamento completo com containers

**Desvantagens:**
- ❌ Requer gerenciamento de servidor
- ❌ Você é responsável por segurança, backups, updates
- ❌ Pode ter custos de infraestrutura (VPS, etc.)
- ❌ Mais complexo para iniciantes

**Custo:** $0 (se você tem servidor) ou $5-20/mês (VPS)

**Ideal para:**
- Desenvolvimento local
- Servidores próprios/VPS
- Quando você quer controle total
- Projetos que precisam de configurações específicas

---

### Railway

**Vantagens:**
- ✅ Deploy extremamente simples (git push)
- ✅ Gerenciamento automático (scaling, restarts, etc.)
- ✅ Integração nativa com GitHub
- ✅ Logs e monitoramento incluídos
- ✅ SSL/HTTPS automático
- ✅ Zero configuração de infraestrutura
- ✅ Plano gratuito generoso para começar

**Desvantagens:**
- ❌ Menos controle sobre o ambiente
- ❌ Custos podem escalar com uso
- ❌ Dependência de serviço externo
- ❌ Pode ter limitações de recursos no plano gratuito

**Custo:**
- Plano Hobby: $5/mês (inclui $5 de créditos)
- Plano Pro: $20/mês (inclui $20 de créditos)
- Pay-as-you-go após créditos

**Ideal para:**
- Deploy rápido e simples
- Projetos que precisam estar online rapidamente
- Quando você não quer gerenciar infraestrutura
- Prototipagem e MVPs

---

## Recomendação

### Para começar: **Railway**
- Mais rápido para colocar no ar
- Zero configuração
- Perfeito para testar e validar

### Para produção/controle: **Docker**
- Mais controle
- Melhor para ambientes específicos
- Ideal se você já tem infraestrutura

### Estratégia Híbrida Recomendada:
1. **Desenvolvimento**: Docker local
2. **Staging/Testes**: Railway
3. **Produção**: Docker em VPS ou Railway (dependendo das necessidades)

---

## Deploy com Docker

### Pré-requisitos
- Docker instalado
- Docker Compose instalado (opcional, mas recomendado)

### Opção 1: Docker Compose (Recomendado)

```bash
# Build e iniciar
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar
docker-compose down

# Parar e remover volumes (CUIDADO: apaga dados)
docker-compose down -v
```

### Opção 2: Docker direto

```bash
# Build da imagem
docker build -t neo-ig-cli:latest .

# Executar container
docker run -it \
  --name neo-ig-cli \
  -v neo-ig-data:/app/data \
  -e NODE_ENV=production \
  neo-ig-cli:latest

# Executar com comando específico
docker run -it \
  --name neo-ig-cli \
  -v neo-ig-data:/app/data \
  neo-ig-cli:latest node dist/cli.js auth login
```

### Gerenciamento de Dados

Os dados são persistidos em volumes Docker:

```bash
# Ver volumes
docker volume ls

# Inspecionar volume
docker volume inspect neo-ig-cli_neo-ig-data

# Backup do volume
docker run --rm \
  -v neo-ig-cli_neo-ig-data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/neo-ig-backup.tar.gz -C /data .

# Restaurar backup
docker run --rm \
  -v neo-ig-cli_neo-ig-data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/neo-ig-backup.tar.gz -C /data
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
NODE_ENV=production
INSTAGRAM_CLI_DATA_DIR=/app/data

# Login Automático (opcional)
# Se definidas, o login será automático sem necessidade de interação
INSTAGRAM_USERNAME=seu_usuario
INSTAGRAM_PASSWORD=sua_senha
```

**⚠️ IMPORTANTE:**
- Nunca commite o arquivo `.env` no Git!
- Use Railway Secrets ou Docker Secrets para produção
- O arquivo `.env` já está no `.gitignore`

O `docker-compose.yml` já está configurado para ler o arquivo `.env` automaticamente.

---

## Deploy com Railway

### Pré-requisitos
- Conta no Railway (https://railway.app)
- GitHub repo do projeto

### Passo a Passo

1. **Conectar GitHub**
   - Acesse Railway.app
   - Faça login com GitHub
   - Clique em "New Project"
   - Selecione "Deploy from GitHub repo"
   - Escolha o repositório

2. **Configurar Build**
   - Railway detectará automaticamente o `railway.json`
   - Ou configure manualmente:
     - Build Command: `npm ci --legacy-peer-deps && npx patch-package && npm run build`
     - Start Command: `node dist/cli.js`

3. **Variáveis de Ambiente**
   - Vá em "Variables" ou "Secrets"
   - Adicione:
     ```
     NODE_ENV=production
     INSTAGRAM_CLI_DATA_DIR=/app/data
     INSTAGRAM_USERNAME=seu_usuario
     INSTAGRAM_PASSWORD=sua_senha
     ```
   - **⚠️ Use "Secrets" para credenciais** (não aparecem nos logs)
   - Com essas variáveis, o login será automático!

4. **Persistência de Dados**
   - Railway tem storage efêmero por padrão
   - Para dados persistentes, use Railway Volume:
     - Vá em "Volumes"
     - Crie um volume
     - Monte em `/app/data`

5. **Deploy**
   - Railway fará deploy automaticamente a cada push
   - Ou clique em "Deploy" manualmente

### Comandos Railway CLI (Opcional)

```bash
# Instalar CLI
npm i -g @railway/cli

# Login
railway login

# Link ao projeto
railway link

# Deploy
railway up

# Ver logs
railway logs

# Abrir shell no container
railway shell
```

---

## Considerações Importantes

### 1. TUI (Terminal UI) em Servidor

Este projeto usa **Ink** (React TUI) que é projetado para terminais interativos. Em um servidor:

**Opções:**
- **Modo CLI simples**: Executar comandos específicos sem UI interativa
- **API Wrapper**: Criar uma API REST que chama o CLI internamente
- **WebSocket/SSH**: Expor via SSH ou WebSocket para acesso remoto

### 2. Autenticação

**Nunca** coloque credenciais no código ou variáveis de ambiente públicas!

**Recomendações:**
- Use Railway Secrets ou Docker Secrets
- Configure login na primeira execução
- Use sessões salvas (já implementado no projeto)

### 3. Segurança

Com as vulnerabilidades conhecidas:
- ✅ Use Docker para isolamento
- ✅ Configure firewall adequadamente
- ✅ Não exponha portas desnecessárias
- ✅ Use HTTPS/SSL (Railway faz isso automaticamente)
- ✅ Monitore logs regularmente

### 4. Recursos

**Mínimos recomendados:**
- CPU: 0.5 cores
- RAM: 512MB
- Storage: 1GB (para dados de sessão)

**Recomendados:**
- CPU: 1 core
- RAM: 1GB
- Storage: 5GB

---

## Próximos Passos

### Criar API Wrapper (Opcional)

Se você quiser expor o CLI como API REST, considere criar um wrapper:

```typescript
// source/api/server.ts (exemplo)
import express from 'express';
import { InstagramClient } from './client.js';

const app = express();
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  // Implementar chamada ao CLI
});

app.listen(3000);
```

### Monitoramento

- Configure health checks
- Use Railway Metrics ou Docker stats
- Configure alertas

### Backup

- Configure backups automáticos dos volumes
- Railway: Use volumes persistentes
- Docker: Configure cron jobs para backup

---

## Troubleshooting

### Docker

**Problema**: Container não inicia
```bash
# Ver logs
docker-compose logs

# Verificar se build funcionou
docker-compose build --no-cache
```

**Problema**: Permissões
```bash
# Ajustar permissões do volume
docker-compose exec neo-ig-cli chown -R nodejs:nodejs /app/data
```

### Railway

**Problema**: Build falha
- Verifique logs no dashboard
- Confirme que `railway.json` está correto
- Verifique se todas as dependências estão no `package.json`

**Problema**: Aplicação não inicia
- Verifique variáveis de ambiente
- Confirme que `dist/` foi gerado
- Verifique logs em tempo real

---

## Referências

- [Docker Documentation](https://docs.docker.com/)
- [Railway Documentation](https://docs.railway.app/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

