# 🚀 Quick Start - Claude AI

## 1️⃣ Instalar Dependências

```bash
pnpm add @anthropic-ai/sdk
```

## 2️⃣ Configurar API Key

Adicione no seu `.env`:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
```

**Como obter:**
1. Acesse https://console.anthropic.com/
2. Faça login
3. Vá em "API Keys"
4. Crie uma nova chave
5. Copie e cole acima

## 3️⃣ Testar no Terminal

```bash
# Chat interativo
pnpm tsx skills/ai/scripts/chat.ts

# Pergunta rápida
pnpm tsx skills/ai/scripts/chat.ts "Explique o que é TypeScript"
```

## 4️⃣ Integrar no Telegram

### Opção A: Bot Separado (para testar)

```bash
# Rodar bot de exemplo
pnpm tsx skills/ai/scripts/telegram-bot-example.ts
```

### Opção B: Adicionar ao seu bot existente

Copie os comandos de `telegram-bot-example.ts` para o seu bot principal.

**Comandos disponíveis:**
- `/chat <mensagem>` - Conversar com Claude
- `/codigo <linguagem> <descrição>` - Gerar código
- `/resumir <texto>` - Resumir texto
- `/traduzir <idioma> <texto>` - Traduzir
- `/limpar` - Limpar histórico
- `/stats` - Ver estatísticas

## 5️⃣ Exemplos de Uso

### Chat Básico
```
Você: /chat Explique o que é recursão
Claude: Recursão é quando uma função chama a si mesma...
```

### Gerar Código
```
Você: /codigo python função para calcular fibonacci
Claude: [código Python completo]
```

### Resumir Texto
```
Você: /resumir [texto longo]
Claude: [resumo conciso]
```

## 🐛 Troubleshooting

### "API key not found"
```bash
# Verifique se está no .env
cat .env | grep ANTHROPIC_API_KEY
```

### "Module not found"
```bash
# Instale as dependências
pnpm install
```

### Bot não responde
```bash
# Verifique se o bot está rodando
ps aux | grep telegram

# Verifique os logs
tail -f logs/neobot.log
```

## 📚 Próximos Passos

1. ✅ Testar chat básico
2. ✅ Integrar no Telegram
3. ⬜ Adicionar comandos personalizados
4. ⬜ Criar automações com IA
5. ⬜ Integrar com outras skills

## 💡 Dicas

- Use `/limpar` se a conversa ficar confusa
- O Claude mantém contexto de ~10 trocas de mensagens
- Seja específico nas perguntas para melhores respostas
- Use markdown nas respostas do Claude

## 🔗 Links Úteis

- [Documentação Claude](https://docs.anthropic.com/)
- [Exemplos de Prompts](https://docs.anthropic.com/claude/docs/prompt-engineering)
- [Pricing](https://www.anthropic.com/pricing)
