# ✅ Deploy Success Checklist - NΞØ Protocol

## Finalização do Deploy

Após corrigir problemas e fazer deploy, execute:

```bash
railway restart

echo ""
echo "✅ Sistema 100% operacional!"
echo "✅ Todos os clientes podem usar agora"
echo ""
echo "📊 MONITORE nos próximos 30 minutos:"
echo "   railway logs --lines 100"
echo ""
echo "🚨 Se aparecer erro 404:"
echo "   railway variables set MAINTENANCE_MODE=true"
echo "   railway restart"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "MISSÃO CUMPRIDA! 🚀"
echo "═══════════════════════════════════════════════════════════"
```

## Resumo de Correções (2026-02-03)

### Problema Original

- ❌ Claude 3.5 Sonnet retornando erro 404
- ❌ Clientes recebendo mensagens de erro técnicas
- ❌ Cache de build do Railway usando código antigo

### Soluções Implementadas

#### 1. Correção do Modelo Claude

```typescript
// ANTES (ERRADO):
const modelName = process.env.LLM_MODEL || "claude-sonnet-4-5-20250929";

// DEPOIS (CORRETO):
const modelName = process.env.LLM_MODEL || "claude-sonnet-4-20250514";
```

**Arquivo:** `src/executors/langchain-agent-executor.ts`

#### 2. Circuit Breaker Implementado

```typescript
// Arquivo: src/middleware/circuit-breaker.ts
export const MAINTENANCE_MODE = process.env.MAINTENANCE_MODE === "true";
export function shouldBlockMessage(phone: string): boolean;
export function sanitizeErrorForClient(error: Error, context?: any): string;
export function isLLMError(error: Error): boolean;
```

**Proteções:**

- ✅ Modo manutenção com whitelist
- ✅ Sanitização de erros (clientes não veem stacktraces)
- ✅ Mensagens amigáveis em caso de falha
- ✅ Detecção de erros de LLM

#### 3. Integração no WhatsApp Server

```typescript
// Arquivo: src/whatsapp-server.mts
import {
  shouldBlockMessage,
  sanitizeErrorForClient,
  isLLMError,
  MAINTENANCE_MESSAGE,
} from "./middleware/circuit-breaker.js";

// Try-catch robusto com erro amigável
try {
  const result = await executor.execute(text, { platform: "whatsapp", remoteJid });
  // ...
} catch (err) {
  const safeMessage = sanitizeErrorForClient(error, { remoteJid, text });
  await sock.sendMessage(remoteJid, { text: safeMessage });
}
```

#### 4. Variáveis de Ambiente

```bash
railway variables set LLM_MODEL="claude-sonnet-4-20250514"
railway variables set MAINTENANCE_MODE="false"
railway variables set MAINTENANCE_WHITELIST="+5562983231110"
railway variables set ANTHROPIC_API_KEY="sk-ant-api03-..."
```

#### 5. Build Limpo

- ✅ Removido `nixpacks.toml` conflitante
- ✅ Railway usando apenas `Dockerfile`
- ✅ Build cache limpo via dashboard
- ✅ Código recompilado do zero

## Validação Final

### Checklist de Sucesso

```bash
# 1. Modelo correto?
railway logs --lines 200 | grep "Using Anthropic" | tail -1
# Deve mostrar: [NΞØ AI] Using Anthropic (Main): claude-sonnet-4-20250514

# 2. Serviço rodando?
railway logs --lines 200 | grep "Webhook Listener" | tail -1
# Deve mostrar: [NΞØ Adapter] Webhook Listener running on port 8042

# 3. WhatsApp conectado?
railway logs --lines 200 | grep "WhatsApp Conectado" | tail -1
# Deve mostrar: ✅ [NEØ Agent Full] WhatsApp Conectado com Sucesso! 🔥🦅

# 4. Sem erros 404?
railway logs --lines 200 | grep -i "404" | grep "model"
# Não deve retornar nada
```

### Status Esperado

```
✅ LLM_MODEL: claude-sonnet-4-20250514
✅ ANTHROPIC_API_KEY: Configurada
✅ MAINTENANCE_MODE: false
✅ WhatsApp: Conectado
✅ Circuit Breaker: Ativo
✅ Erros: Sanitizados
```

## Monitoramento Pós-Deploy

### Primeiros 30 Minutos

```bash
# Monitora em tempo real
railway logs --lines 100

# Procura por erros
railway logs --lines 200 | grep -i "error" | grep -v "0 error"

# Verifica modelo em uso
railway logs --lines 200 | grep "Using Anthropic"
```

### Se Aparecer Erro 404

```bash
# 1. Ativa modo manutenção IMEDIATAMENTE
railway variables set MAINTENANCE_MODE=true
railway restart

# 2. Verifica o modelo nos logs
railway logs --lines 200 | grep "claude-sonnet"

# 3. Corrige se necessário
railway variables set LLM_MODEL="claude-sonnet-4-20250514"

# 4. Clear cache e redeploy
railway open
# Settings → Build → Clear Build Cache → Redeploy

# 5. Testa com seu número (whitelist)
# Envia mensagem de teste

# 6. Se funcionar, desativa manutenção
railway variables set MAINTENANCE_MODE=false
railway restart
```

## Lições Aprendidas

### 1. Cache de Build

- Railway cacheia agressivamente `dist/` e `node_modules/`
- Mudanças em variáveis de ambiente **NÃO** forçam rebuild
- Sempre usar "Clear Build Cache" após correções críticas

### 2. Nomes de Modelos

- Anthropic **NÃO** suporta alias `latest`
- Sempre usar versão específica com data (ex: `claude-sonnet-4-20250514`)
- Consultar documentação oficial: https://docs.anthropic.com/en/docs/about-claude/models

### 3. Proteção de Clientes

- **NUNCA** expor erros técnicos para clientes
- Sempre implementar circuit breaker em produção
- Modo manutenção é essencial para testes seguros

### 4. Validação Local vs Produção

- Sempre testar localmente antes de deploy (quando possível)
- Usar modo manutenção com whitelist para testes em produção
- Monitorar logs ativamente nos primeiros 30 minutos

## Comandos Úteis

### Deploy Seguro

```bash
# 1. Verifica mudanças
git status

# 2. Commit
git add -A
git commit -m "fix: descrição da correção"
git push origin main

# 3. Configura variáveis
railway variables set CHAVE="valor"

# 4. Clear cache (via dashboard)
railway open

# 5. Monitora
railway logs --lines 100
```

### Rollback de Emergência

```bash
# 1. Ativa manutenção
railway variables set MAINTENANCE_MODE=true

# 2. Reverte código
git revert HEAD
git push origin main

# 3. Aguarda deploy
sleep 180

# 4. Valida
railway logs --lines 100

# 5. Desativa manutenção se OK
railway variables set MAINTENANCE_MODE=false
```

---

**Code is law. Security is protocol. NΞØ Agent is LIVE.** 🔐⚡🦅

**Última atualização:** 2026-02-03  
**Status:** ✅ Operacional  
**Modelo:** Claude Sonnet 4 (claude-sonnet-4-20250514)
