---
name: Claude AI Integration
description: Integração com Claude AI para conversação inteligente e geração de conteúdo
---

# 🤖 Claude AI Skill

Esta skill integra o Claude AI da Anthropic para fornecer conversação inteligente, geração de código, análise de textos e muito mais.

## 📋 Funcionalidades

- **Chat Inteligente**: Conversação natural com contexto
- **Geração de Código**: Criar código em qualquer linguagem
- **Análise de Textos**: Resumir, traduzir, analisar documentos
- **Histórico de Conversas**: Mantém contexto por usuário

## 🚀 Comandos

### Via Telegram

```bash
# Chat básico (envie qualquer mensagem sem comando)
Olá, como você está?

# Limpar histórico
/limpar

# Gerar código
/codigo javascript função para validar email

# Analisar texto
/analisar <texto ou arquivo>
```

### Via CLI

```bash
# Chat direto
pnpm tsx skills/ai/scripts/chat.ts "sua pergunta aqui"

# Com contexto específico
pnpm tsx skills/ai/scripts/chat.ts "gere um README" --context "projeto Node.js"
```

## ⚙️ Configuração

### Variáveis de Ambiente

```bash
# .env
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### Obter API Key

1. Acesse https://console.anthropic.com/
2. Faça login ou crie uma conta
3. Vá em "API Keys"
4. Crie uma nova chave
5. Copie e cole no `.env`

## 📊 Modelos Disponíveis

- `claude-sonnet-4-5-20250929` - Melhor custo-benefício (padrão)
- `claude-opus-4-5` - Máxima qualidade
- `claude-haiku-4` - Mais rápido e barato

## 💡 Exemplos de Uso

### 1. Geração de Código

```typescript
// Usuário: "crie uma função para validar CPF em JavaScript"

// Claude responde com:
function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]/g, '');
  
  if (cpf.length !== 11) return false;
  if (/^(\d)\1+$/.test(cpf)) return false;
  
  // Validação dos dígitos verificadores
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(9))) return false;
  
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf.charAt(10))) return false;
  
  return true;
}
```

### 2. Análise de Texto

```
Usuário: "resuma este texto: [texto longo]"

Claude: Fornece um resumo conciso e estruturado
```

### 3. Conversação Contextual

```
Usuário: "Qual a capital da França?"
Claude: "A capital da França é Paris."

Usuário: "E a população?"
Claude: "Paris tem aproximadamente 2,2 milhões de habitantes..."
```

## 🔧 Customização

### Alterar System Prompt

Edite o arquivo `claude-service.ts`:

```typescript
private buildSystemPrompt(context?: string): string {
  let prompt = `Você é um assistente especializado em [sua área].
  
  Características:
  - [característica 1]
  - [característica 2]`;
  
  return prompt;
}
```

### Ajustar Parâmetros

```typescript
const response = await this.client.messages.create({
  model: 'claude-sonnet-4-5-20250929',
  max_tokens: 2048,  // Aumentar para respostas mais longas
  temperature: 0.7,  // 0-1: criatividade (opcional)
  system: systemPrompt,
  messages: history
});
```

## 📈 Métricas

- **Latência média**: ~2-3 segundos
- **Custo por 1M tokens**: ~$3 (Sonnet)
- **Limite de contexto**: 200K tokens
- **Taxa limite**: 50 requests/min

## 🐛 Troubleshooting

### Erro: "API key not found"
```bash
# Verifique se a variável está definida
echo $ANTHROPIC_API_KEY

# Ou no .env
cat .env | grep ANTHROPIC
```

### Erro: "Rate limit exceeded"
```typescript
// Adicione retry logic
const response = await this.retryWithBackoff(() => 
  this.client.messages.create({...})
);
```

### Histórico muito grande
```typescript
// Limitar histórico (já implementado)
if (history.length > 20) {
  history.splice(0, history.length - 20);
}
```

## 🔒 Segurança

- ✅ API key nunca exposta no código
- ✅ Histórico por usuário (isolado)
- ✅ Sanitização de inputs
- ⚠️ Não envie dados sensíveis ao Claude

## 📚 Recursos

- [Documentação Claude](https://docs.anthropic.com/)
- [API Reference](https://docs.anthropic.com/claude/reference)
- [Prompt Engineering](https://docs.anthropic.com/claude/docs/prompt-engineering)
- [Pricing](https://www.anthropic.com/pricing)

## 🎯 Próximos Passos

- [ ] Adicionar suporte a imagens
- [ ] Implementar streaming de respostas
- [ ] Cache de respostas frequentes
- [ ] Análise de sentimento
- [ ] Moderação de conteúdo
