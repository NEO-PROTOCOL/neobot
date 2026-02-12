# 🤖 Guia de Automações Avançadas com Claude Pro

Sistema completo de automações inteligentes com relatórios gerados por IA, agendamento avançado e dashboard interativo iOS-style.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Automações Disponíveis](#automações-disponíveis)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Dashboard](#dashboard)
- [API](#api)
- [Exemplos de Uso](#exemplos-de-uso)

## 🎯 Visão Geral

Este sistema fornece:

- **Relatórios Inteligentes**: Análise diária automatizada com insights de IA
- **Briefings Programados**: Resumos matinais e semanais
- **Health Monitoring**: Verificação automática da saúde do sistema
- **Dashboard iOS-style**: Interface moderna com glassmorphism
- **API REST**: Controle completo via HTTP

## 🏗️ Arquitetura

```
src/automations/
├── scheduler.ts                    # Sistema de agendamento com cron
├── intelligent-report-service.ts   # Geração de relatórios com IA
├── intelligent-daily-report.ts     # Configuração das automações
├── automation-manager.ts           # Gerenciador principal
├── index.ts                        # Exports principais
└── example-init.ts                 # Exemplo de inicialização

dashboard/
├── index.html                      # Dashboard iOS-style
├── styles.css                      # Estilos com glassmorphism
├── app.js                          # JavaScript do dashboard
├── server.js                       # Servidor Express
└── automation-routes.js            # API de automações
```

## 🔧 Automações Disponíveis

### 1. Relatório Diário Inteligente

**ID**: `intelligent-report`  
**Schedule**: `0 18 * * *` (18h todo dia)  
**Descrição**: Gera relatório executivo completo com análise de IA

```typescript
Conteúdo do relatório:
- 📈 Resumo Executivo
- 🎯 Métricas Principais
- ⚠️ Problemas Identificados
- ✅ Ações Recomendadas
- 🔮 Previsões
```

### 2. Briefing Matinal

**ID**: `morning-briefing`  
**Schedule**: `0 8 * * *` (8h todo dia)  
**Descrição**: Resumo matinal do sistema

```typescript
Informações incluídas:
- Status do sistema (uptime, memória)
- Uso de IA (24h)
- Lembretes agendados
- Alertas importantes
```

### 3. Resumo Semanal

**ID**: `weekly-summary`  
**Schedule**: `0 9 * * 1` (Segunda às 9h)  
**Descrição**: Análise semanal completa

```typescript
Métricas semanais:
- Total de interações de IA
- Tokens processados
- Investimento em IA
- Performance geral
- Previsões para próxima semana
```

### 4. Health Check

**ID**: `health-check`  
**Schedule**: `*/5 * * * *` (A cada 5 minutos)  
**Descrição**: Monitoramento contínuo da saúde do sistema

```typescript
Verifica:
- Uso de memória
- CPU
- Alertas automáticos se memória > 90%
- Cooldown de 15 minutos entre alertas
```

## 📦 Instalação

### Dependências

```bash
# Já incluídas no package.json
npm install node-cron express
```

### Estrutura de arquivos

Certifique-se de que todos os arquivos de automação estão em:

```
src/automations/
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Crie ou atualize seu `.env`:

```env
# Telegram
TELEGRAM_BOT_TOKEN=seu_token_aqui
TELEGRAM_ADMIN_CHAT=[CHAT_ID]

# Claude AI (já configurado)
ANTHROPIC_API_KEY=sua_api_key
```

### 2. Inicializar Automações

#### Opção A: Integração no Bot Principal

```typescript
import { initializeAutomations } from './src/automations/index.js';
import { TelegramBot } from './seu-bot-telegram.js';

const config = {
    enabledAutomations: [
        'intelligent-report',
        'morning-briefing',
        'weekly-summary',
        'health-check'
    ],
    telegram: yourTelegramBotInstance
};

const manager = initializeAutomations(config);
await manager.initialize();
```


#### Opção B: Standalone

```bash
# Copie o exemplo
cp src/automations/example-init.ts src/automations/init.ts

# Execute
npx tsx src/automations/init.ts
```

### 3. Iniciar Dashboard

```bash
cd dashboard
npm install
node server.js
```

Acesse: `http://localhost:3000`

## 🎨 Dashboard

### Features

- ✨ Design iOS-style com glassmorphism
- 📊 Visualização de todas as automações
- ▶️ Execução manual de tarefas
- ⏸️ Pausar/ativar automações
- 📄 Gerador de relatórios sob demanda
- 📈 Estatísticas em tempo real
- 🔄 Auto-refresh a cada 30 segundos

### Seções

1. **Automações Avançadas**
   - Lista todas as tarefas configuradas
   - Status (ativa/pausada)
   - Último run e contadores
   - Botões de ação

2. **Gerador de Relatórios**
   - Botão para gerar relatório instantâneo
   - Preview do último relatório
   - Salva automaticamente em `reports/`

3. **Estatísticas**
   - Automações ativas
   - Total de execuções
   - Taxa de erro

## 🔌 API

### Base URL

```
http://localhost:3000/api/automations
```

### Endpoints

#### Listar Tarefas

```http
GET /tasks

Response:
{
  "success": true,
  "tasks": [
    {
      "id": "intelligent-report",
      "name": "Relatório Diário Inteligente",
      "schedule": "0 18 * * *",
      "enabled": true,
      "runCount": 5,
      "errorCount": 0,
      "lastRun": "2026-01-28T18:00:00.000Z"
    }
  ],
  "stats": {
    "total": 4,
    "enabled": 4,
    "disabled": 0,
    "totalRuns": 20,
    "totalErrors": 0
  }
}
```

#### Executar Tarefa

```http
POST /tasks/:taskId/execute

Response:
{
  "success": true,
  "message": "Task intelligent-report executed successfully"
}
```

#### Toggle Tarefa

```http
POST /tasks/:taskId/toggle

Body:
{
  "enabled": false
}

Response:
{
  "success": true,
  "message": "Task intelligent-report disabled"
}
```

#### Gerar Relatório

```http
POST /report/generate

Response:
{
  "success": true,
  "report": "📊 **Relatório do Sistema**...",
  "filepath": "/path/to/reports/report-2026-01-28.md"
}
```

#### Dados do Relatório

```http
GET /report/data

Response:
{
  "success": true,
  "data": {
    "stats": { /* system stats */ },
    "aiUsage": { /* AI usage stats */ },
    "reminders": 5,
    "messages": 10,
    "errors": [],
    "logs": []
  }
}
```

## 💡 Exemplos de Uso

### Exemplo 1: Criar Automação Personalizada

```typescript
import { getScheduler } from './src/automations/scheduler.js';

const scheduler = getScheduler();

scheduler.add({
    id: 'custom-backup',
    name: 'Backup Automático',
    schedule: '0 2 * * *', // 2h da manhã
    enabled: true,
    action: async () => {
        console.log('Executando backup...');
        // Seu código de backup aqui
    }
});
```

### Exemplo 2: Executar Tarefa Manualmente

```typescript
import { getAutomationManager } from './src/automations/index.js';

const manager = getAutomationManager();
await manager.executeTask('intelligent-report');
```

### Exemplo 3: Pausar Todas as Automações

```typescript
import { getAutomationManager } from './src/automations/index.js';

const manager = getAutomationManager();
manager.stopAll();
```

### Exemplo 4: Integração com Telegram Bot

```typescript
import { Bot } from 'grammy';
import { initializeAutomations } from './src/automations/index.js';

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

// Adapter para o formato esperado
const telegramAdapter = {
    async sendMessage(chatId: string, message: string, options?: any) {
        await bot.api.sendMessage(chatId, message, options);
    }
};

const manager = initializeAutomations({
    enabledAutomations: ['intelligent-report', 'morning-briefing'],
    telegram: telegramAdapter
});

await manager.initialize();
```

## 🎯 Cronograma de Execução

```
Segunda:
  08:00 - Briefing Matinal
  09:00 - Resumo Semanal
  18:00 - Relatório Diário

Terça a Domingo:
  08:00 - Briefing Matinal
  18:00 - Relatório Diário

Contínuo:
  A cada 5 min - Health Check
```

## 🔐 Segurança

- ✅ Rate limiting no health check (cooldown de 15min para alertas)
- ✅ Validação de entrada em todos os endpoints
- ✅ CORS configurado
- ✅ Logs de todas as operações
- ✅ Tratamento de erros robusto

## 🚀 Performance

- ⚡ Execução assíncrona de todas as tarefas
- ⚡ Cache de dados de relatórios
- ⚡ Auto-refresh otimizado (30s)
- ⚡ Glassmorphism com GPU acceleration

## 📊 Monitoramento

Todas as execuções geram logs:

```
✅ Tarefa agendada: Relatório Diário Inteligente (0 18 * * *)
🚀 Executando: Relatório Diário Inteligente
📊 Gerando relatório inteligente...
💾 Relatório salvo em: /path/to/report-2026-01-28.md
✅ Relatório enviado com sucesso!
✅ Tarefa concluída: Relatório Diário Inteligente (2543ms)
```

## 🐛 Troubleshooting

### Problema: Automações não executam

**Solução**:

```typescript
// Verifique se o manager foi inicializado
const manager = getAutomationManager();
console.log('Manager:', manager);
console.log('Tasks:', manager?.listTasks());
```

### Problema: Dashboard não carrega automações

**Solução**:

1. Verifique se o servidor está rodando
2. Abra o console do navegador (F12)
3. Verifique a resposta da API em Network

### Problema: Telegram não envia mensagens

**Solução**:

1. Verifique `TELEGRAM_BOT_TOKEN` no `.env`
2. Confirme que o bot está iniciado
3. Teste o adapter manualmente

## 📚 Referências

- [Node-Cron Documentation](https://github.com/node-cron/node-cron)
- [Express.js](https://expressjs.com/)
- [Claude API](https://docs.anthropic.com/)
- [iOS Design Guidelines](https://developer.apple.com/design/)

## 🤝 Contribuindo

Para adicionar novas automações:

1. Crie a função em `intelligent-daily-report.ts`
2. Exporte em `index.ts`
3. Adicione à configuração padrão
4. Documente aqui

## 📝 License

MIT

---

Desenvolvido com ❤️ para NeoBot
