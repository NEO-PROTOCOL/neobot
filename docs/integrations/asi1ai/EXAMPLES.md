# ASI1AI Tool - Exemplos Práticos

Coleção de exemplos práticos de uso do ASI1AI Tool no Neobot.

## 🎯 Casos de Uso por Categoria

### 1. Reasoning Avançado

#### Análise de Decisão Complexa

```json
{
  "action": "chat",
  "prompt": "Devo aceitar uma oferta de emprego com salário 30% maior mas em outra cidade, ou permanecer no emprego atual com possibilidade de promoção em 6 meses?",
  "context": "Você é um consultor de carreira experiente. Faça perguntas relevantes e analise prós e contras de forma estruturada.",
  "temperature": 0.5,
  "max_tokens": 2048
}
```

#### Resolução de Problemas Técnicos

```json
{
  "action": "chat",
  "prompt": "Nossa aplicação está com latência alta no horário de pico. O banco de dados está em 80% de CPU. Temos 3 servidores web e 1 servidor de banco. O que devo fazer?",
  "context": "Você é um arquiteto de sistemas sênior especializado em performance. Priorize soluções de curto prazo primeiro.",
  "temperature": 0.3
}
```

### 2. Criação de Conteúdo

#### Posts para Redes Sociais

```json
{
  "action": "chat",
  "prompt": "Crie 5 posts para LinkedIn sobre os benefícios de pagamentos crypto para e-commerce",
  "context": "Tom: profissional, informativo mas acessível. Inclua call-to-action. Máximo 280 caracteres por post.",
  "temperature": 0.8,
  "max_tokens": 1024
}
```

#### Documentação Técnica

```json
{
  "action": "chat",
  "prompt": "Escreva um README.md para um projeto Node.js que faz integração PIX com FlowPay. Inclua seções de instalação, configuração e exemplos.",
  "context": "Você é um technical writer experiente. Use formato markdown e seja claro e conciso.",
  "temperature": 0.4
}
```

### 3. Análise e Crítica

#### Code Review

```json
{
  "action": "chat",
  "prompt": "Review this TypeScript function for security issues:\n\nasync function processPayment(userId: string, amount: number) {\n  const user = await db.query(`SELECT * FROM users WHERE id = '${userId}'`);\n  const result = await fetch(`https://api.payment.com/charge?amount=${amount}`);\n  return result.json();\n}",
  "context": "Você é um especialista em segurança de aplicações. Identifique vulnerabilidades e sugira correções.",
  "temperature": 0.2
}
```

#### Análise de Estratégia

```json
{
  "action": "chat",
  "prompt": "Analise esta estratégia de go-to-market: 'Lançar produto B2B SaaS de CRM focado em PMEs, preço R$ 99/mês, marketing 100% digital, meta 100 clientes em 3 meses'",
  "context": "Você é um consultor de negócios com 20 anos de experiência em SaaS. Identifique riscos e oportunidades.",
  "temperature": 0.4
}
```

### 4. Geração de Imagens

#### Logo / Branding

```json
{
  "action": "image",
  "prompt": "Modern minimalist logo for a fintech startup called 'NeoBot', combining robot and money flow concepts, blue and green colors, professional",
  "image_size": "1024x1024"
}
```

#### Ilustrações Conceituais

```json
{
  "action": "image",
  "prompt": "Isometric illustration of a decentralized payment network with connected nodes, cryptocurrency symbols, modern tech aesthetic, vibrant colors",
  "image_size": "1024x1024"
}
```

#### Diagramas Visuais

```json
{
  "action": "image",
  "prompt": "Clean infographic showing the flow of a PIX payment: user → QR code → payment processor → merchant confirmation, with icons and arrows",
  "image_size": "1920x1080"
}
```

#### Marketing Visual

```json
{
  "action": "image",
  "prompt": "Hero image for a landing page about instant crypto payments, showing a smartphone with payment interface, futuristic holographic elements, professional photography style",
  "image_size": "1920x1080"
}
```

## 🤖 Integração com Agentes

### Como Fallback de Reasoning

No `system prompt` do agente principal:

```markdown
You are a helpful assistant. For complex reasoning tasks or when you need a second opinion, use the asi1ai tool:

```json
{
  "action": "chat",
  "prompt": "[your complex question]",
  "context": "[relevant context]"
}
```

Only use asi1ai when:
- The question requires deep technical analysis
- You need to solve a complex problem
- The user explicitly asks for a "second opinion"
- You're uncertain about your answer
```

### Especialização por Domínio

```typescript
// Agente especializado em marketing
const marketingAgentSystemPrompt = `
You are a marketing specialist. For content creation tasks, use asi1ai:

- Blog posts: temperature 0.7
- Social media: temperature 0.8
- Technical docs: temperature 0.3

Always review asi1ai output before presenting to the user.
`;
```

### Geração Automática de Imagens

```typescript
// Detectar quando precisa de visual
const visualPrompt = `
When the user asks for:
- "show me", "create an image", "visualize"
- diagrams, logos, illustrations

Use asi1ai tool with action="image" and craft a detailed prompt.
`;
```

## 📊 Padrões de Temperatura

| Task Type | Temperature | Reasoning |
|-----------|-------------|-----------|
| Code Review | 0.1 - 0.3 | Preciso e consistente |
| Análise Técnica | 0.3 - 0.4 | Estruturado mas completo |
| Documentação | 0.4 - 0.5 | Claro e profissional |
| Conversação Geral | 0.6 - 0.7 | Natural e fluido |
| Criação de Conteúdo | 0.7 - 0.9 | Criativo e variado |
| Brainstorming | 0.8 - 1.0 | Exploração máxima |

## 🎨 Padrões de Prompts para Imagens

### Para Logos

```
"Modern minimalist logo for [company name], 
[concept/theme], 
[colors], 
[style: professional/playful/elegant], 
vector style, simple, clean"
```

### Para Ilustrações

```
"[style: isometric/flat/3D] illustration of [subject], 
[mood/atmosphere], 
[color palette], 
[additional details], 
high quality"
```

### Para Diagramas

```
"Clean [type] diagram showing [process/flow], 
with [elements], 
[style: modern/minimalist/technical], 
clear labels, professional"
```

### Para Marketing

```
"[composition: hero image/banner/thumbnail] for [purpose], 
showing [main subject], 
[style: photography/illustration/abstract], 
[mood], 
high quality, commercial use"
```

## 🔄 Workflows Compostos

### Workflow: Análise → Decisão → Ação

```typescript
// 1. Análise da situação
const analysis = await asi1ai({
  action: "chat",
  prompt: "Analyze our current payment system performance",
  context: "Technical context...",
  temperature: 0.3
});

// 2. Gerar recomendações
const recommendations = await asi1ai({
  action: "chat",
  prompt: `Based on this analysis: ${analysis.content}, what are the top 3 actions we should take?`,
  temperature: 0.5
});

// 3. Criar visual para apresentação
const diagram = await asi1ai({
  action: "image",
  prompt: "Diagram showing recommended payment system architecture improvements",
  image_size: "1920x1080"
});
```

### Workflow: Conteúdo Multicanal

```typescript
// 1. Gerar conteúdo principal
const blogPost = await asi1ai({
  action: "chat",
  prompt: "Write a 500-word blog post about crypto payment benefits",
  temperature: 0.6
});

// 2. Adaptar para social media
const socialPosts = await asi1ai({
  action: "chat",
  prompt: `Extract 3 key points from this blog post and create LinkedIn posts: ${blogPost.content}`,
  temperature: 0.7
});

// 3. Criar imagem de capa
const coverImage = await asi1ai({
  action: "image",
  prompt: "Professional hero image for blog post about cryptocurrency payments",
  image_size: "1920x1080"
});
```

## 🎯 Melhores Práticas

### ✅ DO

- Use temperature baixa (0.2-0.4) para tarefas técnicas
- Forneça contexto rico e específico
- Seja específico nos prompts de imagem
- Revise outputs antes de usar em produção
- Use max_tokens apropriado para economizar

### ❌ DON'T

- Não use para informações em tempo real (preços, notícias)
- Não confie cegamente em code suggestions sem review
- Não gere imagens sem revisar primeiro
- Não use temperature alta para tarefas críticas
- Não repita chamadas desnecessariamente (cache quando possível)

## 📈 Performance Tips

### ⚡ Rate Limit Awareness

**Plano Free Limits**:

- 640,000 TPM (tokens por minuto) ✅ Generoso!
- 3 RPM (requests por minuto) ⚠️ Cuidado aqui!
- 500 RPD (requests por dia) ✅ Suficiente

**Estratégias para 3 RPM**:

```typescript
// ❌ MAU: Múltiplas chamadas rápidas
await asi1ai({ action: "chat", prompt: "Question 1" });
await asi1ai({ action: "chat", prompt: "Question 2" }); // Pode falhar!
await asi1ai({ action: "chat", prompt: "Question 3" }); // Vai falhar!

// ✅ BOM: Espaçar chamadas
await asi1ai({ action: "chat", prompt: "Question 1" });
await sleep(20000); // 20 segundos
await asi1ai({ action: "chat", prompt: "Question 2" });

// ✅ MELHOR: Agrupar em uma única chamada
await asi1ai({
  action: "chat",
  prompt: "Answer these 3 questions:\n1. ...\n2. ...\n3. ..."
});
```

### Otimizações

1. **Batch Similar Requests**: Agrupe perguntas relacionadas em um único prompt
2. **Cache Responses**: Para prompts repetidos
3. **Use modelo apropriado**: `asi1-mini` para rapidez, `asi1-plus` para qualidade
4. **Otimize prompts**: Seja conciso mas completo
5. **Monitor usage**: Acompanhe no dashboard
6. **Respect limits**: 3 RPM = espaçar 20+ segundos entre chamadas

## 🔍 Debugging

### Verbose Mode

```typescript
const result = await asi1ai({
  action: "chat",
  prompt: "...",
  // ... params
});

console.log("Usage:", result.usage);
console.log("Model:", result.model);
console.log("Finish reason:", result.finish_reason);
```

### Error Handling

```typescript
try {
  const result = await asi1ai({ ... });
  if (!result.success) {
    console.error("ASI1AI Error:", result.error);
    console.log("Suggestion:", result.suggestion);
  }
} catch (error) {
  console.error("Failed to call ASI1AI:", error);
}
```

---

**Dica Final**: Comece com exemplos simples, monitore os resultados, e vá refinando seus prompts com base no feedback real do modelo.
