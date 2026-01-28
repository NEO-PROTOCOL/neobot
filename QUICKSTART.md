# 🚀 Início Rápido - NeoBot Dashboard & Automações

Guia de 5 minutos para configurar e executar o dashboard iOS-style com automações avançadas.

## ⚡ Setup Automático (Recomendado)

```bash
# 1. Executar script de setup
chmod +x scripts/setup-dashboard.sh
./scripts/setup-dashboard.sh

# 2. O script irá:
#    - Verificar dependências
#    - Instalar pacotes
#    - Criar .env de exemplo
#    - Compilar TypeScript
#    - Configurar dashboard

# 3. Configure o .env com suas credenciais
nano .env  # ou seu editor preferido

# 4. Inicie o dashboard
cd dashboard
node server.js
```

Acesse: **http://localhost:3000**

## 🔧 Setup Manual

### 1. Instalar Dependências

```bash
# Projeto principal
pnpm install  # ou npm install

# Dashboard
cd dashboard
npm install
cd ..
```

### 2. Configurar Variáveis de Ambiente

Crie `.env` na raiz do projeto:

```env
# Telegram
TELEGRAM_BOT_TOKEN=seu_token_do_botfather
TELEGRAM_ADMIN_CHAT=seu_chat_id

# Claude AI
ANTHROPIC_API_KEY=sk-ant-api03-...

# Dashboard (opcional)
DASHBOARD_PORT=3000
```

**Como obter:**

- **Telegram Token**: Fale com [@BotFather](https://t.me/BotFather)
- **Chat ID**: Use [@userinfobot](https://t.me/userinfobot)
- **Claude API**: [console.anthropic.com](https://console.anthropic.com)

### 3. Build do Projeto

```bash
pnpm run build
```

### 4. Iniciar Dashboard

```bash
cd dashboard
node server.js
```

## 📱 Acessar Dashboard

Abra no navegador:

```
http://localhost:3000
```

### Features Principais

✅ **Ações Rápidas**
- Criar lembretes
- Enviar mensagens
- Analisar bugs

✅ **Chat com Claude AI**
- Interface de chat em tempo real
- Histórico de conversas
- Estatísticas de uso

✅ **Automações Avançadas**
- Relatório diário (18h)
- Briefing matinal (8h)
- Resumo semanal (segunda 9h)
- Health check (a cada 5 min)

✅ **Visualizações**
- Status do sistema
- Métricas de IA
- Lembretes agendados
- Mensagens recentes

## 🤖 Configurar Automações

### Opção 1: Integrado ao Bot

```typescript
// No seu arquivo principal do bot
import { initializeAutomations } from './src/automations/index.js';

// Adapter do seu bot Telegram
const telegramAdapter = {
    async sendMessage(chatId: string, message: string, options?: any) {
        await yourBot.api.sendMessage(chatId, message, options);
    }
};

// Configurar automações
const manager = initializeAutomations({
    enabledAutomations: [
        'intelligent-report',   // Relatório diário
        'morning-briefing',     // Briefing matinal
        'weekly-summary',       // Resumo semanal
        'health-check'          // Health check
    ],
    telegram: telegramAdapter
});

await manager.initialize();
```

### Opção 2: Standalone

```bash
# Copiar exemplo
cp src/automations/example-init.ts src/automations/init.ts

# Editar e configurar seu bot
nano src/automations/init.ts

# Executar
npx tsx src/automations/init.ts
```

## 📊 Testar Funcionalidades

### 1. Health Check

```bash
curl http://localhost:3000/api/health
```

Resposta esperada:
```json
{
  "status": "ok",
  "telegram": "connected",
  "scheduler": "active"
}
```

### 2. Chat com Claude

No dashboard, vá para a seção **Chat com Claude AI** e envie uma mensagem:

```
Olá! Como você está?
```

### 3. Criar Lembrete

Clique em **Novo Lembrete** e configure:
- Mensagem: "Beber água"
- Quando: "Daqui a 15 minutos"

### 4. Executar Automação

Na seção **Automações Avançadas**, clique em **▶️ Executar** em qualquer tarefa.

### 5. Gerar Relatório

Clique em **Gerar Relatório Inteligente** para criar um relatório sob demanda.

## 🎨 Customizar Dashboard

### Cores

Edite `dashboard/styles.css`:

```css
:root {
    --accent-primary: #007AFF;  /* Azul iOS */
    --accent-success: #34C759;  /* Verde iOS */
    /* ... suas cores ... */
}
```

### Nova Seção

1. Adicione HTML em `dashboard/index.html`
2. Estilize em `dashboard/styles.css`
3. Adicione lógica em `dashboard/app.js`

### Nova Automação

1. Crie função em `src/automations/intelligent-daily-report.ts`
2. Registre no manager
3. Configure schedule (cron)

## 🐛 Troubleshooting

### Erro: "Cannot find module"

```bash
# Rebuild do projeto
pnpm run build
```

### Erro: "ECONNREFUSED"

- Verifique se o servidor está rodando
- Confirme a porta (3000)

### Automações não executam

1. Verifique se foram inicializadas:
```typescript
const manager = getAutomationManager();
console.log(manager?.listTasks());
```

2. Verifique logs do servidor

### Dashboard não carrega

1. Abra DevTools (F12)
2. Verifique Console e Network
3. Confirme que API está respondendo

## 📚 Próximos Passos

### Aprender Mais

- 📖 [Dashboard README](dashboard/README.md)
- 📖 [Guia de Automações](docs/automations-guide.md)
- 📖 [API Documentation](docs/api-docs.md)

### Tutoriais

1. **Criar Automação Custom**
   ```typescript
   scheduler.add({
       id: 'my-task',
       name: 'Minha Tarefa',
       schedule: '0 * * * *', // A cada hora
       enabled: true,
       action: async () => {
           // Seu código aqui
       }
   });
   ```

2. **Adicionar Widget ao Dashboard**
   - Ver: `dashboard/README.md#adicionar-nova-seção`

3. **Integrar com WhatsApp**
   - Ver: `docs/whatsapp-integration.md`

### Dicas

1. **Use o auto-refresh**: O dashboard atualiza a cada 30s
2. **Monitore os logs**: Sempre visíveis no terminal do servidor
3. **Teste as APIs**: Use curl ou Postman
4. **Customize o design**: Mude cores e layouts no CSS

## 🎯 Checklist de Setup

- [ ] Node.js 22+ instalado
- [ ] Dependências instaladas
- [ ] `.env` configurado
- [ ] Projeto compilado (`pnpm build`)
- [ ] Dashboard iniciado
- [ ] Acessou http://localhost:3000
- [ ] Testou chat com Claude
- [ ] Criou um lembrete
- [ ] Viu as automações
- [ ] Gerou um relatório

## 💡 Dicas Pro

### Development Mode

```bash
# Watch mode
node --watch dashboard/server.js
```

### Production Deploy

```bash
# Build otimizado
NODE_ENV=production pnpm build

# Usar PM2
pm2 start dashboard/server.js --name neobot-dashboard
```

### Docker

```bash
# Build
docker build -t neobot-dashboard .

# Run
docker run -p 3000:3000 \
  -e TELEGRAM_BOT_TOKEN=xxx \
  -e ANTHROPIC_API_KEY=xxx \
  neobot-dashboard
```

### Mobile App (PWA)

1. No mobile, abra o dashboard
2. Menu > "Adicionar à tela inicial"
3. Use como app nativo!

## 🎉 Tudo Pronto!

Seu dashboard está configurado e rodando! 

Agora você pode:
- ✅ Conversar com Claude AI
- ✅ Gerenciar lembretes
- ✅ Enviar mensagens
- ✅ Monitorar automações
- ✅ Gerar relatórios inteligentes
- ✅ Visualizar métricas em tempo real

---

**Need help?** Confira a documentação completa ou abra uma issue!

**Made with ❤️ for NeoBot**
