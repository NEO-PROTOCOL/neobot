# ASI1AI Tool - Quick Start

Guia rápido para começar a usar o ASI1AI Tool no Neobot.

## ⚡ Setup em 3 Passos

### 1. Configure a API Key

```bash
# Adicione no .env
echo "ASI1AI_API_KEY=sk_sua_chave_aqui" >> .env

# Proteja o arquivo
chmod 600 .env
```

### 2. Rebuild (se necessário)

```bash
pnpm build
```

### 3. Teste no Gateway

```bash
# Inicie o gateway
pnpm moltbot gateway

# Em outra janela, envie mensagem via WhatsApp/Telegram para testar
```

## 🎯 Primeiro Teste

### Via WhatsApp/Telegram

Envie para o bot:

```
Use the asi1ai tool to explain blockchain in simple terms
```

O agente deve automaticamente usar o tool e retornar a resposta.

### Via CLI (Teste Direto)

```bash
# Teste chat completion
curl -X POST https://api.asi1.ai/v1/chat/completions \
  -H "Authorization: Bearer $ASI1AI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"content": "Hello!", "role": "user"}],
    "model": "asi1-mini"
  }'
```

## 📝 Exemplos Simples

### 1. Pergunta Simples

**Prompt do usuário**:
```
Use asi1ai to explain quantum computing
```

**Tool call interno**:
```json
{
  "action": "chat",
  "prompt": "Explain quantum computing in simple terms",
  "temperature": 0.7
}
```

### 2. Geração de Imagem

**Prompt do usuário**:
```
Create an image of a futuristic crypto wallet
```

**Tool call interno**:
```json
{
  "action": "image",
  "prompt": "Futuristic cryptocurrency wallet interface with holographic elements, modern UI design",
  "image_size": "1024x1024"
}
```

### 3. Code Review

**Prompt do usuário**:
```
Use asi1ai to review this code: [code snippet]
```

**Tool call interno**:
```json
{
  "action": "chat",
  "prompt": "Review this code for issues: [code]",
  "context": "You are a senior code reviewer",
  "temperature": 0.3
}
```

## 🔧 Configuração do Agente

Para que o agente use o tool automaticamente, adicione no **system prompt**:

```markdown
You have access to the asi1ai tool for advanced reasoning and image generation.

Use it when:
- User asks complex questions requiring deep analysis
- User explicitly mentions "use asi1ai" or "second opinion"
- Task involves image generation (logos, diagrams, illustrations)

Example usage:
```json
{
  "action": "chat",
  "prompt": "user's question",
  "temperature": 0.7
}
```
```

## 🎨 Casos de Uso Rápidos

### Análise Técnica
```
Analyze the pros and cons of microservices vs monolithic architecture
```

### Criação de Conteúdo
```
Write 3 LinkedIn posts about AI in healthcare
```

### Geração Visual
```
Create a logo for a fintech startup called "PayFlow"
```

### Code Help
```
Review this function for security issues: [code]
```

## 📊 Verificar Uso

Acesse [ASI1.ai Dashboard](https://asi1.ai/dashboard) para:
- ✅ Ver quantas chamadas você fez
- ✅ Monitorar tokens consumidos
- ✅ Verificar custos
- ✅ Gerenciar API keys

## ⚡ Rate Limits

**Seu plano free tem limites generosos**:
- **640,000 TPM** (tokens por minuto)
- **3 RPM** (requests por minuto)
- **500 RPD** (requests por dia)

**Dicas**:
- Espaçe chamadas em ~20 segundos
- Use max_tokens apropriado
- Cache respostas quando possível

## 🐛 Troubleshooting Rápido

### "API key not configured"
```bash
# Verifique se está no .env
cat .env | grep ASI1AI_API_KEY

# Se não estiver, adicione
echo "ASI1AI_API_KEY=sk_..." >> .env
```

### "401 Unauthorized"
```bash
# Teste a key manualmente
curl https://api.asi1.ai/v1/chat/completions \
  -H "Authorization: Bearer $ASI1AI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"test"}],"model":"asi1-mini"}'
```

### Tool não aparece
```bash
# Rebuild
pnpm build

# Restart gateway
pnpm moltbot gateway
```

## 🎯 Próximos Passos

1. ✅ Configure a API key
2. ✅ Teste com pergunta simples
3. ✅ Experimente geração de imagem
4. 📖 Leia [EXAMPLES.md](./EXAMPLES.md) para casos avançados
5. 📖 Consulte [README.md](./README.md) para documentação completa

## 💡 Dicas

- **Comece simples**: Teste com perguntas básicas primeiro
- **Ajuste temperature**: Baixa (0.3) para precisão, alta (0.8) para criatividade
- **Use contexto**: Adicione context para respostas mais direcionadas
- **Monitor costs**: Acompanhe uso no dashboard
- **Cache respostas**: Para prompts repetidos (implementar se necessário)

## 🔗 Links Úteis

- [API Docs](https://docs.asi1.ai)
- [Dashboard](https://asi1.ai/dashboard)
- [Exemplos Completos](./EXAMPLES.md)
- [README Completo](./README.md)

---

**Happy Hacking! 🚀**
