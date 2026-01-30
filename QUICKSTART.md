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


---

## Quick Usage Guide


# 🤖 Guia de Uso do Neobot - Protocolo NΞØ

## 📱 Telegram - Envio de Mensagens

### Enviar Mensagem Direta

```bash
pnpm tsx skills/telegram/scripts/telegram.ts \
  --to 8181568281 \
  --message "sua mensagem aqui"
```

**Importante:**
- ✅ Chat ID **SEM aspas** (ex: `8181568281`)
- ✅ Mensagem **COM aspas** (ex: `"olá!"`)

### Descobrir Chat ID de Alguém

```bash
pnpm tsx skills/telegram/scripts/get-chat-id.ts
```

**Como usar:**
1. Rode o comando acima
2. Peça para a pessoa enviar `/start` para o bot
3. O script mostrará o Chat ID dela

**⚠️ Atenção:** Só pode rodar **UM** listener por vez! Se já tiver um rodando, pare-o antes (Ctrl+C).

### Monitorar Mensagens Recebidas

```bash
pnpm tsx skills/telegram/scripts/listen.ts
```

**O que faz:**
- Mostra todas as mensagens recebidas em tempo real
- Exibe nome, username, Chat ID
- Indica se é uma resposta
- Emite um "beep" quando chega mensagem

---

## ⏰ Agendamento de Mensagens

### Agendar uma Mensagem

```bash
pnpm tsx skills/scheduler/scripts/scheduler.ts add \
  --name "Nome da Tarefa" \
  --when "in 15 minutes" \
  --command "pnpm tsx skills/telegram/scripts/telegram.ts --to 8181568281 --message 'texto'"
```

**Formatos de tempo aceitos:**
- `"in 15 minutes"` - Daqui a 15 minutos
- `"in 2 hours"` - Daqui a 2 horas
- `"em 30 minutos"` - Português também funciona
- `"0 9 * * *"` - Cron expression (todo dia às 9h)

### Listar Tarefas Agendadas

```bash
pnpm neobot cron list
```

### Executar Tarefa Manualmente

```bash
pnpm neobot cron run <id-da-tarefa>
```

### Iniciar o Scheduler (Execução Automática)

```bash
pnpm neobot cron start
```

**Nota:** Deixe rodando em background para que as tarefas sejam executadas automaticamente.

---

## 🔔 Sistema de Lembretes Pessoais

**✨ NOVO: Agora SEM precisar de API da Anthropic!**

O sistema usa o comando `at` do macOS/Linux para agendar lembretes diretamente.

### Criar um Lembrete

```bash
pnpm tsx skills/reminders/remind.ts "texto do lembrete" "quando"
```

**Exemplos práticos:**

```bash
# Lembrete em 30 minutos
pnpm tsx skills/reminders/remind.ts "Beber água" "in 30 minutes"

# Lembrete em 2 horas
pnpm tsx skills/reminders/remind.ts "Ligar para mãe" "in 2 hours"

# Em português também funciona
pnpm tsx skills/reminders/remind.ts "Academia" "em 1 hora"
```

**Formatos aceitos:**
- `"in X minutes"` - Daqui a X minutos
- `"in X hours"` - Daqui a X horas  
- `"em X minutos"` - Português
- `"em X horas"` - Português

**Como funciona:**
1. Você cria o lembrete com texto e horário
2. O sistema agenda usando o comando `at` do macOS
3. No horário marcado, você recebe uma mensagem no Telegram com 🔔
4. **Não precisa deixar nada rodando!** O sistema operacional cuida disso

**Ver lembretes agendados:**
```bash
atq  # Lista todos os lembretes pendentes
```

**Cancelar um lembrete:**
```bash
atrm <número>  # Remove o lembrete pelo número mostrado no atq
```

---

## 🔑 Configuração Inicial

### Arquivo `.env`

Certifique-se de ter estas variáveis configuradas:

```bash
# Telegram
TELEGRAM_BOT_TOKEN=seu-token-aqui
TELEGRAM_CHAT_ID=seu-chat-id

# Anthropic (Claude AI) - Necessário para agendamento inteligente
ANTHROPIC_API_KEY=sk-ant-sua-chave-aqui
```

**Onde conseguir:**
- **Telegram Bot Token:** [@BotFather](https://t.me/BotFather) no Telegram
- **Anthropic API Key:** [console.anthropic.com](https://console.anthropic.com/settings/keys)

---

## 📋 Chat IDs Conhecidos

| Nome | Username | Chat ID |
|------|----------|---------|
| Netto MELLØ | - | `[CHAT_ID]` |
| Ana Carolina | @anacarolinamaia | `8181568281` |

---

## 🛠️ Comandos Úteis

### Verificar Status do Sistema

```bash
pnpm neobot health --full
```

### Ver Configuração Atual

```bash
pnpm neobot config show
```

### Ver Ledger (Auditoria)

```bash
pnpm neobot ledger tail 10
```

---

## 💡 Exemplos Práticos

### Exemplo 1: Enviar "Bom dia" todo dia às 9h

```bash
pnpm tsx skills/scheduler/scripts/scheduler.ts add \
  --name "Bom dia para Julia" \
  --when "0 9 * * *" \
  --command "pnpm tsx skills/telegram/scripts/telegram.ts --to 8181568281 --message 'Bom dia! ☀️'"
```

### Exemplo 2: Lembrete em 30 minutos

```bash
pnpm tsx skills/scheduler/scripts/scheduler.ts add \
  --name "Lembrete Reunião" \
  --when "in 30 minutes" \
  --command "pnpm tsx skills/telegram/scripts/telegram.ts --to [CHAT_ID] --message 'Reunião em 30 minutos!'"
```

### Exemplo 3: Sequência de Mensagens

```bash
# Primeira mensagem (agora)
pnpm tsx skills/telegram/scripts/telegram.ts \
  --to 8181568281 \
  --message "Oi! Tudo bem?"

# Segunda mensagem (15 min depois)
pnpm tsx skills/scheduler/scripts/scheduler.ts add \
  --name "Follow-up" \
  --when "in 15 minutes" \
  --command "pnpm tsx skills/telegram/scripts/telegram.ts --to 8181568281 --message 'Vamos sair?'"
```

---

## 🚨 Troubleshooting

### Erro: "Conflict: terminated by other getUpdates request"

**Problema:** Dois listeners tentando rodar ao mesmo tempo.

**Solução:** 
1. Pare todos os processos do bot: `pkill -f "get-chat-id\|listen"`
2. Rode apenas um listener por vez

### Erro: "chat not found"

**Problema:** A pessoa ainda não iniciou conversa com o bot.

**Solução:**
1. Peça para ela procurar o bot no Telegram
2. Ela deve enviar `/start`
3. Depois disso, você pode enviar mensagens

### Erro: "TELEGRAM_BOT_TOKEN not found"

**Problema:** Variável de ambiente não configurada.

**Solução:**
1. Verifique se o arquivo `.env` existe
2. Certifique-se de que `TELEGRAM_BOT_TOKEN` está definido
3. Reinicie o terminal

---

## 🔐 Segurança

- ⚠️ **NUNCA** compartilhe seu `.env` ou faça commit dele no Git
- ⚠️ O `.env` já está no `.gitignore` por segurança
- ⚠️ Tokens e API keys são sensíveis - trate como senhas

---

## 📚 Recursos Adicionais

- **Documentação do Telegram Bot API:** https://core.telegram.org/bots/api
- **Anthropic Console:** https://console.anthropic.com/
- **Cron Expression Generator:** https://crontab.guru/

---

**Última atualização:** 27/01/2026 23:34  
**Versão do Neobot:** v1.1.0  
**Protocolo:** NΞØ 🛰️
