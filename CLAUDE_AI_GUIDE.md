# 🤖 Claude AI - Guia Rápido

## ✨ O que foi implementado

### 🎯 **Chat Inteligente no Dashboard**
- Interface visual premium integrada ao bento grid
- Contexto de conversa mantido automaticamente
- Respostas em tempo real do Claude Sonnet 4
- Histórico de mensagens com timestamps

### 📊 **Analytics em Tempo Real**
- Total de requests
- Tokens consumidos
- Custo total e por request
- Tempo médio de resposta

### 🔌 **API REST Completa**
```
POST /api/ai/chat              - Chat com contexto
POST /api/ai/analyze-image     - Análise de imagens
POST /api/ai/plan              - Criar plano de ação
GET  /api/ai/stats             - Estatísticas de uso
POST /api/ai/clear-context     - Limpar contexto
```

## 🚀 Como Usar

### 1. **Configurar API Key**

Já está configurado no `.env`:
```bash
ANTHROPIC_API_KEY=sk-ant-...
```

### 2. **Acessar o Dashboard**

```bash
# O servidor já está rodando!
http://localhost:3000
```

### 3. **Usar o Chat**

1. Role até o card **"🤖 Chat com Claude AI"**
2. Digite sua mensagem
3. Clique em **"Enviar"**
4. Receba a resposta em segundos!

### 4. **Exemplos de Uso**

**Perguntas Gerais:**
```
"Explique o que é um agente autônomo"
"Como funciona o Claude AI?"
"Me ajude a criar um plano de estudos"
```

**Análise de Código:**
```
"Analise este código TypeScript: [cole o código]"
"Como posso melhorar esta função?"
"Encontre bugs neste código"
```

**Planejamento:**
```
"Crie um plano para implementar autenticação"
"Quebre esta tarefa em etapas: [descreva a tarefa]"
"Como devo estruturar este projeto?"
```

**Criatividade:**
```
"Me dê ideias para features do dashboard"
"Crie uma mensagem de boas-vindas criativa"
"Sugira melhorias para a UX"
```

## 📊 Monitoramento

### **Estatísticas de IA**

No card **"📊 Estatísticas de IA"** você vê:

- **Requests**: Quantas perguntas você fez
- **Tokens**: Total de tokens consumidos
- **Custo Total**: Quanto você gastou
- **Tempo Médio**: Velocidade média de resposta

### **Custos do Claude Sonnet 4**

- Input: $3 por milhão de tokens
- Output: $15 por milhão de tokens
- Média: ~$0.0001 por mensagem

**Exemplo prático:**
- 100 mensagens ≈ $0.01 (1 centavo!)
- 1000 mensagens ≈ $0.10 (10 centavos!)

## 🎯 Features Avançadas

### **Contexto de Conversa**

O Claude lembra das últimas 10 mensagens automaticamente:

```
Você: "Qual é a capital da França?"
Claude: "A capital da França é Paris."

Você: "E a população?"
Claude: "Paris tem cerca de 2,2 milhões de habitantes..."
```

### **Limpar Contexto**

Clique no ícone **🗑️** para começar uma nova conversa.

### **Auto-resumo**

A cada 20 mensagens, o sistema cria um resumo automático para economizar tokens.

## 🔧 Integração com Telegram

Você pode usar o Claude via Telegram também:

```bash
pnpm tsx skills/ai/scripts/chat.ts "sua pergunta aqui"
```

## 📈 Próximas Features

- [ ] **Análise de Imagens** - Upload e análise via dashboard
- [ ] **Agente Autônomo** - Execução de tarefas complexas
- [ ] **Streaming** - Respostas em tempo real (palavra por palavra)
- [ ] **Múltiplos Contextos** - Projetos separados
- [ ] **Histórico Persistente** - Salvar conversas no banco
- [ ] **Voice Input** - Falar com o Claude

## 💡 Dicas Pro

### **Economizar Tokens**
- Seja específico nas perguntas
- Use o botão de limpar contexto quando mudar de assunto
- Evite mensagens muito longas

### **Melhores Resultados**
- Dê contexto claro
- Peça exemplos quando necessário
- Use formatação markdown nas perguntas

### **Performance**
- Respostas típicas: 1-3 segundos
- Máximo de tokens por resposta: 4096
- Modelo usado: Claude Sonnet 4 (mais recente!)

## 🎨 Interface

### **Design Premium**
- ✅ Dark theme moderno
- ✅ Mensagens com gradientes
- ✅ Animações suaves
- ✅ Auto-scroll
- ✅ Timestamps
- ✅ Loading states

### **Responsivo**
Funciona perfeitamente em:
- Desktop
- Tablet  
- Mobile

## 🔐 Segurança

- API Key nunca é exposta no frontend
- Todas as chamadas passam pelo backend
- Rate limiting automático
- Contextos isolados por usuário

## 📞 Suporte

Se algo não funcionar:

1. Verifique se `ANTHROPIC_API_KEY` está no `.env`
2. Confirme que o servidor está rodando
3. Abra o console do navegador (F12)
4. Veja os logs de erro

---

**Pronto para usar!** 🚀

Acesse: **http://localhost:3000** e comece a conversar com o Claude!
