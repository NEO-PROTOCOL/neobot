# ASI1AI Rate Limits - Guia Prático

Guia completo sobre como trabalhar com os rate limits do plano free da ASI1.ai.

## 📊 Limites do Plano Free

### Limites Atuais

| Tipo | Limite | Período | Status |
|------|--------|---------|--------|
| **Tokens** | 640,000 | Por minuto | ✅ Generoso |
| **Requests** | 3 | Por minuto | ⚠️ Restritivo |
| **Requests** | 500 | Por dia | ✅ Suficiente |

### O que Significa na Prática

**640,000 TPM (Tokens Por Minuto)**:
- ~320 requests de 2000 tokens por minuto
- Suficiente para a maioria dos casos
- Raramente será o gargalo

**3 RPM (Requests Por Minuto)**:

- 1 request a cada 20 segundos
- **Este é o limite crítico**
- Requer estratégia de uso

**500 RPD (Requests Por Dia)**:

- ~20 requests por hora (se distribuído)
- Suficiente para uso normal
- Planeje bem para uso intenso

## ⚠️ O Desafio: 3 RPM

Este é o limite mais importante a considerar:

### ❌ Padrões que Vão Falhar

```typescript
// ERRO: Múltiplas chamadas rápidas
const result1 = await asi1ai({ action: "chat", prompt: "Q1" });
const result2 = await asi1ai({ action: "chat", prompt: "Q2" }); // Rate limit!
const result3 = await asi1ai({ action: "chat", prompt: "Q3" }); // Erro!
```

```typescript
// ERRO: Loop sem controle
for (const question of questions) {
  await asi1ai({ action: "chat", prompt: question }); // Vai falhar!
}
```

### ✅ Padrões que Funcionam

#### 1. Espaçar Chamadas

```typescript
import { setTimeout } from "timers/promises";

// Espaçar 20+ segundos entre chamadas
const result1 = await asi1ai({ action: "chat", prompt: "Q1" });
await setTimeout(20000); // 20 segundos
const result2 = await asi1ai({ action: "chat", prompt: "Q2" });
await setTimeout(20000);
const result3 = await asi1ai({ action: "chat", prompt: "Q3" });
```

#### 2. Agrupar Perguntas

```typescript
// MELHOR: Agrupar em uma única chamada
const result = await asi1ai({
  action: "chat",
  prompt: `Answer these questions:
    1. What is quantum computing?
    2. How does blockchain work?
    3. Explain AI neural networks.
    
    Provide concise answers for each.`,
  max_tokens: 2048
});
```

#### 3. Queue com Rate Limiting

```typescript
class ASI1AIQueue {
  private queue: Array<() => Promise<any>> = [];
  private processing = false;
  private lastCall = 0;
  private minInterval = 20000; // 20 segundos

  async add<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.process();
    });
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const now = Date.now();
      const elapsed = now - this.lastCall;
      
      if (elapsed < this.minInterval) {
        await setTimeout(this.minInterval - elapsed);
      }

      const fn = this.queue.shift();
      if (fn) {
        this.lastCall = Date.now();
        await fn();
      }
    }

    this.processing = false;
  }
}

// Uso
const queue = new ASI1AIQueue();

// Adicionar múltiplas chamadas (serão espaçadas automaticamente)
const [r1, r2, r3] = await Promise.all([
  queue.add(() => asi1ai({ action: "chat", prompt: "Q1" })),
  queue.add(() => asi1ai({ action: "chat", prompt: "Q2" })),
  queue.add(() => asi1ai({ action: "chat", prompt: "Q3" })),
]);
```

#### 4. Retry com Backoff

```typescript
async function asi1aiWithRetry(params: any, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await asi1ai(params);
    } catch (error: any) {
      if (error.message.includes("rate limit") && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 20000; // Backoff exponencial
        console.log(`Rate limit hit, waiting ${delay/1000}s...`);
        await setTimeout(delay);
        continue;
      }
      throw error;
    }
  }
}
```

## 💡 Estratégias de Otimização

### 1. Batch Processing

Agrupe perguntas relacionadas:

```typescript
// ❌ 3 requests (vai exceder rate limit)
const python = await asi1ai({ prompt: "Explain Python" });
const javascript = await asi1ai({ prompt: "Explain JavaScript" });
const rust = await asi1ai({ prompt: "Explain Rust" });

// ✅ 1 request
const languages = await asi1ai({
  prompt: `Compare and explain these languages:
    1. Python
    2. JavaScript
    3. Rust
    
    For each: purpose, strengths, use cases.`,
  max_tokens: 2048
});
```

### 2. Priorização

Use o tool apenas quando necessário:

```typescript
// Apenas para tarefas que realmente precisam
if (needsDeepReasoning || isComplexTask) {
  result = await asi1ai({ ... });
} else {
  // Use o agente principal
  result = await primaryAgent({ ... });
}
```

### 3. Caching

Cache respostas comuns:

```typescript
const cache = new Map<string, any>();

async function asi1aiCached(params: any) {
  const key = JSON.stringify(params);
  
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const result = await asi1ai(params);
  cache.set(key, result);
  return result;
}
```

### 4. Planejamento de Uso Diário

Com 500 RPD, planeje bem:

```typescript
// Exemplo de uso distribuído
const dailyBudget = {
  morning: 100,    // 6h-12h: Pico de uso
  afternoon: 200,  // 12h-18h: Uso intenso
  evening: 150,    // 18h-00h: Moderado
  night: 50        // 00h-6h: Mínimo
};

// Implemente contador
let requestsToday = 0;
const dailyLimit = 500;

async function asi1aiWithBudget(params: any) {
  if (requestsToday >= dailyLimit) {
    throw new Error("Daily limit reached");
  }
  
  requestsToday++;
  return await asi1ai(params);
}
```

## 🎯 Casos de Uso Práticos

### Análise de Código (Batch)

```typescript
// Agrupe múltiplos arquivos em uma análise
const result = await asi1ai({
  action: "chat",
  prompt: `Review these files for security issues:

FILE 1 - auth.ts:
${file1Content}

FILE 2 - database.ts:
${file2Content}

FILE 3 - api.ts:
${file3Content}

Provide security analysis for each file.`,
  temperature: 0.3,
  max_tokens: 4096
});
```

### Content Creation (Sequencial com Delay)

```typescript
const topics = ["AI", "Blockchain", "IoT"];
const posts = [];

for (const topic of topics) {
  const post = await asi1ai({
    action: "chat",
    prompt: `Write a LinkedIn post about ${topic}`,
    temperature: 0.8
  });
  posts.push(post);
  
  // Esperar 20s antes do próximo
  if (topics.indexOf(topic) < topics.length - 1) {
    await setTimeout(20000);
  }
}
```

### Image Generation (Daily Budget)

```typescript
// Imagens custam 1 request cada
// Planeje com cuidado
const criticalImages = [
  "Logo principal",
  "Hero image landing page", 
  "Diagrama arquitetura"
];

const images = [];
for (const desc of criticalImages) {
  const img = await asi1ai({
    action: "image",
    prompt: desc,
    image_size: "1024x1024"
  });
  images.push(img);
  
  await setTimeout(20000); // Espaçar
}
```

## 📊 Monitoramento

### Tracking de Uso

```typescript
class ASI1AIUsageTracker {
  private requests: Array<{ timestamp: number; type: string }> = [];
  
  log(type: "chat" | "image") {
    this.requests.push({
      timestamp: Date.now(),
      type
    });
    
    // Limpar dados antigos (> 24h)
    const dayAgo = Date.now() - 86400000;
    this.requests = this.requests.filter(r => r.timestamp > dayAgo);
  }
  
  getMinuteCount(): number {
    const minuteAgo = Date.now() - 60000;
    return this.requests.filter(r => r.timestamp > minuteAgo).length;
  }
  
  getDayCount(): number {
    return this.requests.length;
  }
  
  canMakeRequest(): boolean {
    return this.getMinuteCount() < 3 && this.getDayCount() < 500;
  }
  
  getStats() {
    return {
      lastMinute: this.getMinuteCount(),
      last24Hours: this.getDayCount(),
      remainingToday: 500 - this.getDayCount(),
      canRequest: this.canMakeRequest()
    };
  }
}

// Uso
const tracker = new ASI1AIUsageTracker();

async function asi1aiTracked(params: any) {
  if (!tracker.canMakeRequest()) {
    throw new Error(`Rate limit: ${JSON.stringify(tracker.getStats())}`);
  }
  
  tracker.log(params.action);
  return await asi1ai(params);
}
```

## 🚦 Dashboard de Status

```typescript
// Exemplo de status para logging
function logRateLimitStatus(tracker: ASI1AIUsageTracker) {
  const stats = tracker.getStats();
  
  console.log(`
╔══════════════════════════════════════╗
║     ASI1AI Rate Limit Status         ║
╠══════════════════════════════════════╣
║ Last Minute:   ${stats.lastMinute}/3 requests      ║
║ Today:         ${stats.last24Hours}/500 requests   ║
║ Remaining:     ${stats.remainingToday} requests    ║
║ Can Request:   ${stats.canRequest ? '✅ Yes' : '❌ No'}           ║
╚══════════════════════════════════════╝
  `);
}
```

## 💰 Upgrade Considerations

Se você precisar de mais:

**Quando considerar upgrade**:
- [ ] Batendo limite de 500 RPD regularmente
- [ ] Precisando de mais de 3 RPM
- [ ] Uso em produção com múltiplos usuários
- [ ] Workflows automatizados frequentes

**Planos pagos provavelmente oferecem**:
- Mais RPM (10+, 100+, etc)
- Mais RPD (milhares)
- Suporte prioritário
- SLA garantido

## 📝 Checklist de Boas Práticas

- [ ] Sempre espaçar chamadas em 20+ segundos
- [ ] Agrupar perguntas relacionadas quando possível
- [ ] Implementar retry com backoff
- [ ] Usar caching para prompts repetidos
- [ ] Monitorar uso diário
- [ ] Priorizar uso (só quando necessário)
- [ ] Implementar queue para múltiplas chamadas
- [ ] Ter fallback se limite for atingido
- [ ] Logar erros de rate limit
- [ ] Revisar uso semanalmente

---

**Resumo**: Com 3 RPM, a chave é **ESPAÇAR** chamadas e **AGRUPAR** perguntas. Planeje bem seu uso diário de 500 requests! 🎯
