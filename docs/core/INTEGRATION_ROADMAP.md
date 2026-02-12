# 🔗 Integration Roadmap - NEØ Protocol

**Data:** 30 Janeiro 2026  
**Status:** Sistemas criados, aguardando integração

---

## 📊 **ESTADO ATUAL**

### ✅ Sistemas Implementados (4)

1. **TaskScheduler** (`src/automations/scheduler.ts`)
   - ✅ Cron jobs funcionais
   - ✅ Event emitter
   - ✅ Estatísticas
   - ❌ Sem CLI commands
   - ❌ Sem persistência

2. **DeployAssistant** (`src/automations/deploy-assistant.ts`)
   - ✅ Git diff analysis
   - ✅ AI code review
   - ✅ Deploy checklist
   - ❌ Sem CLI commands
   - ❌ Não integrado com Railway

3. **IntelligentReportService** (`src/automations/intelligent-report-service.ts`)
   - ✅ System stats
   - ✅ AI reports
   - ✅ Export MD/JSON
   - ❌ Não agendado (deveria rodar diariamente)
   - ❌ Sem notificação Telegram

4. **MioIdentityManager** (`src/neo/identity/mio-system.ts`)
   - ✅ Web3 identities
   - ✅ Cryptographic signatures
   - ✅ Roles & permissions
   - ❌ Sem CLI commands
   - ❌ Sem storage (filesystem ou DB)

---

## 🎯 **PLANO DE INTEGRAÇÃO (Próximos Passos)**

### **Fase 1: CLI Commands** (Prioridade MÁXIMA)

#### 1.1 - Scheduler CLI
```bash
# Criar: src/cli/commands/schedule.ts

pnpm moltbot schedule add "daily-report" "0 9 * * *" --action generateReport
pnpm moltbot schedule list
pnpm moltbot schedule enable daily-report
pnpm moltbot schedule disable daily-report
pnpm moltbot schedule run daily-report  # Manual trigger
pnpm moltbot schedule stats
```

**Arquivos a criar:**
- `src/cli/commands/schedule.ts`
- `src/cli/commands/schedule-add.ts`
- `src/cli/commands/schedule-list.ts`

---

#### 1.2 - Deploy CLI
```bash
# Criar: src/cli/commands/deploy.ts

pnpm moltbot deploy analyze              # Analisa mudanças vs main
pnpm moltbot deploy analyze --branch dev # Analisa vs dev
pnpm moltbot deploy review               # Code review com AI
pnpm moltbot deploy checklist           # Gera checklist
pnpm moltbot deploy prepare             # Análise completa + save report
```

**Arquivos a criar:**
- `src/cli/commands/deploy.ts`
- `src/cli/commands/deploy-analyze.ts`
- `src/cli/commands/deploy-review.ts`

---

#### 1.3 - Report CLI
```bash
# Criar: src/cli/commands/report.ts

pnpm moltbot report generate            # Gera relatório agora
pnpm moltbot report today               # Relatório do dia
pnpm moltbot report json                # Export JSON
pnpm moltbot report send --telegram     # Envia via Telegram
```

**Arquivos a criar:**
- `src/cli/commands/report.ts`
- `src/cli/commands/report-generate.ts`
- `src/cli/commands/report-send.ts`

---

#### 1.4 - Identity CLI
```bash
# Criar: src/cli/commands/identity.ts

pnpm moltbot identity create --name "NEO Gateway"
pnpm moltbot identity list
pnpm moltbot identity verify mio-abc12345
pnpm moltbot identity export mio-abc12345 --json
pnpm moltbot identity import identity.json
pnpm moltbot identity generate 5  # Gera 5 identidades
```

**Arquivos a criar:**
- `src/cli/commands/identity.ts`
- `src/cli/commands/identity-create.ts`
- `src/cli/commands/identity-list.ts`
- `src/cli/commands/identity-verify.ts`

---

### **Fase 2: Integrações entre Sistemas**

#### 2.1 - Report Agendado (Scheduler + ReportService)
```typescript
// src/automations/example-init.ts (atualizar)

import { getScheduler } from './scheduler.js'
import { getReportService } from './intelligent-report-service.js'

const scheduler = getScheduler()
const reportService = getReportService()

// Agendar relatório diário às 9h
scheduler.add({
  id: 'daily-report',
  name: 'Relatório Diário Inteligente',
  schedule: '0 9 * * *',  // 9h todos os dias
  enabled: true,
  action: async () => {
    const report = await reportService.generateIntelligentReport()
    await reportService.saveReport(report)
    
    // TODO: Enviar via Telegram
    // await sendTelegramMessage(report)
  }
})
```

**Arquivos a atualizar:**
- `src/automations/example-init.ts`

---

#### 2.2 - Deploy Assistant + Telegram
```typescript
// src/automations/deploy-assistant.ts (adicionar método)

async sendDeployNotification(analysis: any): Promise<void> {
  const { stats, checklist, review } = analysis
  
  const message = `
🚀 **Deploy Analysis**

📊 Files: ${stats.filesChanged}
📝 +${stats.insertions} -${stats.deletions}

✅ Tests: ${checklist.tests.length}
⚠️ Warnings: ${checklist.warnings.length}
🔒 Score: ${review?.score || 'N/A'}/100

Run: pnpm moltbot deploy checklist
  `.trim()
  
  // TODO: Integrar com Telegram Bot
  // await sendTelegramMessage(message)
}
```

**Arquivos a atualizar:**
- `src/automations/deploy-assistant.ts`
- Integrar `skills/telegram/bot.ts`

---

#### 2.3 - Identity + Skills Registry
```typescript
// src/neo/cli/skill-publish.ts (integrar MioIdentity)

import { createMioIdentityManager } from '../identity/mio-system.js'

async function publishSkill(skillPath: string) {
  // Carregar ou criar identidade do publisher
  const privateKey = process.env.NEO_IDENTITY_KEY
  const manager = createMioIdentityManager(privateKey)
  
  // Assinar skill com identidade
  const skillContent = await fs.readFile(skillPath, 'utf-8')
  const signature = await manager.signMessage(skillContent)
  
  // Publicar no IPFS com assinatura
  const cid = await ipfsClient.add({
    content: skillContent,
    metadata: {
      signature,
      publisher: manager.getMioId(),
      timestamp: new Date().toISOString()
    }
  })
  
  console.log(`✅ Skill published: ${cid}`)
  console.log(`📝 Signed by: ${manager.getMioId()}`)
}
```

**Arquivos a atualizar:**
- `src/neo/cli/skill-publish.ts`

---

### **Fase 3: Persistência & Storage**

#### 3.1 - Identity Storage
```typescript
// Criar: src/neo/identity/identity-store.ts

import fs from 'fs/promises'
import path from 'path'

export class IdentityStore {
  private identitiesDir: string
  
  constructor() {
    this.identitiesDir = path.join(
      process.env.HOME!,
      '.neobot',
      'identities'
    )
  }
  
  async save(identity: NeoIdentity): Promise<void> {
    await fs.mkdir(this.identitiesDir, { recursive: true })
    const filepath = path.join(this.identitiesDir, `${identity.id}.json`)
    await fs.writeFile(filepath, JSON.stringify(identity, null, 2))
  }
  
  async load(id: string): Promise<NeoIdentity | null> {
    const filepath = path.join(this.identitiesDir, `${id}.json`)
    try {
      const content = await fs.readFile(filepath, 'utf-8')
      return JSON.parse(content)
    } catch {
      return null
    }
  }
  
  async list(): Promise<NeoIdentity[]> {
    const files = await fs.readdir(this.identitiesDir)
    const identities = []
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        const id = file.replace('.json', '')
        const identity = await this.load(id)
        if (identity) identities.push(identity)
      }
    }
    
    return identities
  }
}
```

**Arquivos a criar:**
- `src/neo/identity/identity-store.ts`

---

#### 3.2 - Scheduler Persistence
```typescript
// Atualizar: src/automations/scheduler.ts

export class TaskScheduler extends EventEmitter {
  private configFile = path.join(process.env.HOME!, '.neobot', 'scheduler.json')
  
  async loadTasks(): Promise<void> {
    try {
      const content = await fs.readFile(this.configFile, 'utf-8')
      const tasks = JSON.parse(content)
      
      for (const task of tasks) {
        this.add(task)
      }
      
      console.log(`✅ Loaded ${tasks.length} scheduled tasks`)
    } catch {
      console.log('ℹ️ No saved tasks found')
    }
  }
  
  async saveTasks(): Promise<void> {
    const tasks = this.list()
    await fs.writeFile(this.configFile, JSON.stringify(tasks, null, 2))
  }
}
```

**Arquivos a atualizar:**
- `src/automations/scheduler.ts`

---

### **Fase 4: Automações Práticas**

#### 4.1 - Tarefa: Deploy Check (diário)
```typescript
scheduler.add({
  id: 'deploy-check',
  name: 'Deploy Check Diário',
  schedule: '0 8 * * *',  // 8h
  enabled: true,
  action: async () => {
    const assistant = getDeployAssistant()
    const analysis = await assistant.analyzeChanges('main')
    
    if (analysis.stats.filesChanged > 0) {
      await assistant.sendDeployNotification(analysis)
      console.log('⚠️ Mudanças detectadas! Verifique antes de deploy.')
    } else {
      console.log('✅ Nenhuma mudança desde último deploy')
    }
  }
})
```

---

#### 4.2 - Tarefa: System Health (a cada hora)
```typescript
scheduler.add({
  id: 'health-check',
  name: 'Health Check Horário',
  schedule: '0 * * * *',  // A cada hora
  enabled: true,
  action: async () => {
    const reportService = getReportService()
    const data = await reportService.generateReportData()
    
    // Alertar se memória > 500MB
    const memoryMB = data.stats.memoryUsage.heapUsed / 1024 / 1024
    if (memoryMB > 500) {
      console.warn(`⚠️ High memory usage: ${memoryMB.toFixed(2)} MB`)
      // TODO: Enviar alerta Telegram
    }
    
    // Alertar se muitos erros
    if (data.errors.length > 5) {
      console.warn(`⚠️ Multiple errors detected: ${data.errors.length}`)
      // TODO: Enviar alerta Telegram
    }
  }
})
```

---

#### 4.3 - Tarefa: Identity Backup (diário)
```typescript
scheduler.add({
  id: 'identity-backup',
  name: 'Backup de Identidades',
  schedule: '0 2 * * *',  // 2h da manhã
  enabled: true,
  action: async () => {
    const store = new IdentityStore()
    const identities = await store.list()
    
    const backupDir = path.join(process.env.HOME!, '.neobot', 'backups')
    await fs.mkdir(backupDir, { recursive: true })
    
    const filename = `identities-${new Date().toISOString().split('T')[0]}.json`
    const filepath = path.join(backupDir, filename)
    
    await fs.writeFile(filepath, JSON.stringify(identities, null, 2))
    console.log(`✅ Backup criado: ${filename}`)
  }
})
```

---

## 📋 **CHECKLIST DE IMPLEMENTAÇÃO**

### **Semana 1 (31 Jan - 6 Feb)**

**Dia 1-2: CLI Commands**
- [ ] Criar `src/cli/commands/schedule.ts` + subcommands
- [ ] Criar `src/cli/commands/deploy.ts` + subcommands
- [ ] Criar `src/cli/commands/report.ts` + subcommands
- [ ] Criar `src/cli/commands/identity.ts` + subcommands
- [ ] Registrar comandos no CLI principal

**Dia 3: Identity Storage**
- [ ] Criar `src/neo/identity/identity-store.ts`
- [ ] Atualizar MioIdentityManager para usar store
- [ ] Testar save/load/list

**Dia 4: Scheduler Persistence**
- [ ] Adicionar loadTasks() e saveTasks() ao Scheduler
- [ ] Criar arquivo de config `~/.neobot/scheduler.json`
- [ ] Auto-load tasks no boot

**Dia 5: Integrações**
- [ ] Report agendado (Scheduler + ReportService)
- [ ] Deploy notifications (DeployAssistant + Telegram)
- [ ] Identity signing (MioIdentity + Skills)

**Dia 6-7: Automações**
- [ ] Deploy check diário
- [ ] Health check horário
- [ ] Identity backup diário
- [ ] Testar todas as automações

---

### **Semana 2 (7-13 Feb): Produção**

**Railway Deploy** (conforme DECISION_POINT)
- [ ] Deploy gateway 24/7
- [ ] Monitoramento ativo
- [ ] Health checks automáticos
- [ ] Relatórios diários via Telegram

---

## 🎯 **COMANDOS DISPONÍVEIS APÓS INTEGRAÇÃO**

```bash
# === SCHEDULER ===
pnpm moltbot schedule add "daily-report" "0 9 * * *"
pnpm moltbot schedule list
pnpm moltbot schedule stats

# === DEPLOY ===
pnpm moltbot deploy analyze
pnpm moltbot deploy review
pnpm moltbot deploy checklist

# === REPORTS ===
pnpm moltbot report generate
pnpm moltbot report send --telegram

# === IDENTITY ===
pnpm moltbot identity create --name "NEO Gateway"
pnpm moltbot identity list
pnpm moltbot identity verify mio-abc12345

# === AUTOMATIONS (running in background) ===
# ✅ Daily report (9h)
# ✅ Deploy check (8h)
# ✅ Health check (hourly)
# ✅ Identity backup (2h)
```

---

## 🚀 **VALOR IMEDIATO**

### O Que Isso Desbloqueia:

1. **Monitoramento Automático**
   - Sistema se auto-monitora (memória, CPU, erros)
   - Alertas automáticos via Telegram
   - Relatórios diários sem intervenção

2. **Deploy Seguro**
   - Code review automático com AI
   - Checklist pré-deploy
   - Detecção de problemas antes de produção

3. **Identidade Web3**
   - Skills assinadas cryptograficamente
   - Provenance tracking
   - Permissões granulares

4. **Automações Inteligentes**
   - Tarefas agendadas (cron)
   - Backups automáticos
   - Health checks contínuos

---

## 📊 **PROGRESSO ATUAL**

```
INFRASTRUCTURE: ████████████████████ 100% (WhatsApp, Telegram, Gateway)
AUTOMATION CODE: ████████████████░░░░ 80% (4 sistemas implementados)
CLI INTEGRATION: ░░░░░░░░░░░░░░░░░░░░ 0% (próximo passo!)
PRODUCTION USE:  ░░░░░░░░░░░░░░░░░░░░ 0% (Railway deploy pendente)
```

**Próximo Bloqueio:** CLI Commands para os 4 sistemas  
**Tempo Estimado:** 2-3 dias de implementação  
**ROI:** Alto (automações 24/7 + deploy seguro)

---

## 💡 **DECISÃO RECOMENDADA**

**Opção A: Integrar Automações PRIMEIRO** (1 semana)
- Implementar CLI commands
- Testar automações localmente
- Deploy Railway com automações ativas
- **Resultado:** Sistema auto-gerenciado em produção

**Opção B: Deploy DIRETO** (Path A do DECISION_POINT)
- Pular automações por ora
- Foco 100% em cliente/produção
- Adicionar automações depois
- **Resultado:** Revenue imediato, automações depois

**Recomendação NODE NEØ:** **Opção A** (Automações primeiro)
- Você já construiu os sistemas
- 1 semana para integrar tudo
- Deploy Railway com sistema completo
- Auto-monitoramento desde dia 1

---

**Próxima Ação:** Escolher Opção A ou B?

📞 **Aguardando sua decisão, Node Arquiteto.**
