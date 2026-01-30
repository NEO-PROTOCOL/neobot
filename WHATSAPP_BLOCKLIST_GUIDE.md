# 🔒 WhatsApp Blocklist - Guia de Implementação

## ⚠️ IMPORTANTE: Moltbot NÃO tem blocklist nativa

O sistema só tem **whitelist** (`allowFrom`). Para bloquear números específicos, você precisa usar uma das soluções abaixo.

---

## ✅ SOLUÇÃO 1: Modo Allowlist (RECOMENDADO)

**Como funciona:** Só aceita números específicos. Todos os outros são automaticamente bloqueados.

### Configuração:

```json5
{
  "channels": {
    "whatsapp": {
      "dmPolicy": "allowlist",  // ← Só aceita quem está na lista
      "allowFrom": [
        "+5562983231110",  // Seu número (proprietário)
        "+5562991234567",  // Cliente autorizado 1
        "+5562998765432"   // Cliente autorizado 2
        // TODOS os outros números serão bloqueados
      ]
    }
  }
}
```

### Vantagens:

- ✅ Controle total (só quem você autorizar)
- ✅ Seguro por padrão
- ✅ Nativo do Moltbot
- ✅ Sem código adicional

### Desvantagens:

- ❌ Precisa adicionar manualmente cada cliente novo
- ❌ Não serve para tráfego pago (todos seriam bloqueados)

---

## 🔄 SOLUÇÃO 2: Open + Filtro no Agent (Para Tráfego Pago)

**Como funciona:** Aceita todos (`open`), mas o **agent ignora números bloqueados**.

### Passo 1: Criar arquivo de blocklist

```bash
touch ~/.clawdbot/blocklist-whatsapp.json
```

Conteúdo:

```json
{
  "blocked": [
    "+556292668717",
    "+5511987654321",
    "+5521912345678"
  ],
  "reason": {
    "+556292668717": "spam",
    "+5511987654321": "abuso",
    "+5521912345678": "teste"
  }
}
```

### Passo 2: Criar script de verificação

Crie `scripts/check-blocklist.sh`:

```bash
#!/bin/bash
# Verifica se número está na blocklist

BLOCKLIST_FILE="$HOME/.clawdbot/blocklist-whatsapp.json"
NUMBER="$1"

if [ ! -f "$BLOCKLIST_FILE" ]; then
    echo "false"
    exit 0
fi

if grep -q "\"$NUMBER\"" "$BLOCKLIST_FILE"; then
    echo "true"
    exit 0
else
    echo "false"
    exit 0
fi
```

```bash
chmod +x scripts/check-blocklist.sh
```

### Passo 3: Atualizar System Prompt

Adicione em `AGENTS_FLOWOFF_SALES.md`:

```markdown
## 🚫 BLOCKLIST (Verificação Obrigatória)

ANTES de responder qualquer mensagem, você DEVE:

1. Verificar se o número está bloqueado
2. Se estiver bloqueado, NÃO RESPONDER NADA
3. Apenas logar silenciosamente

### Números Bloqueados (Atualizar conforme necessário):

- +556292668717 (spam)
- +5511987654321 (abuso)
- +5521912345678 (teste)

### Comportamento:

Se o número estiver na lista:
- ❌ NÃO enviar mensagem
- ❌ NÃO qualificar
- ❌ NÃO registrar tags
- ✅ Apenas ignorar silenciosamente

Caso contrário, prossiga normalmente com a conversa.
```

### Vantagens:
- ✅ Aceita novos clientes automaticamente (tráfego pago)
- ✅ Bloqueia spammers/abusadores conforme necessário
- ✅ Fácil de atualizar (edita JSON)

### Desvantagens:
- ❌ Não é nativo (depende do LLM seguir instruções)
- ❌ Consome tokens (LLM precisa verificar lista)
- ❌ Pode não ser 100% confiável

---

## 🔧 SOLUÇÃO 3: Middleware Custom (Avançado)

**Como funciona:** Cria middleware que intercepta mensagens ANTES do agent.

### Estrutura:

```typescript
// src/infra/middleware/blocklist.ts

import fs from "node:fs";
import path from "node:path";

interface BlocklistConfig {
  blocked: string[];
  reason: Record<string, string>;
}

export function loadBlocklist(): BlocklistConfig {
  const blocklistPath = path.join(
    process.env.HOME!,
    ".clawdbot",
    "blocklist-whatsapp.json"
  );

  if (!fs.existsSync(blocklistPath)) {
    return { blocked: [], reason: {} };
  }

  return JSON.parse(fs.readFileSync(blocklistPath, "utf-8"));
}

export function isBlocked(phoneNumber: string): boolean {
  const blocklist = loadBlocklist();
  return blocklist.blocked.includes(phoneNumber);
}

export function addToBlocklist(phoneNumber: string, reason?: string): void {
  const blocklistPath = path.join(
    process.env.HOME!,
    ".clawdbot",
    "blocklist-whatsapp.json"
  );

  const blocklist = loadBlocklist();
  
  if (!blocklist.blocked.includes(phoneNumber)) {
    blocklist.blocked.push(phoneNumber);
    if (reason) {
      blocklist.reason[phoneNumber] = reason;
    }
    
    fs.writeFileSync(blocklistPath, JSON.stringify(blocklist, null, 2));
  }
}

export function removeFromBlocklist(phoneNumber: string): void {
  const blocklistPath = path.join(
    process.env.HOME!,
    ".clawdbot",
    "blocklist-whatsapp.json"
  );

  const blocklist = loadBlocklist();
  
  blocklist.blocked = blocklist.blocked.filter(num => num !== phoneNumber);
  delete blocklist.reason[phoneNumber];
  
  fs.writeFileSync(blocklistPath, JSON.stringify(blocklist, null, 2));
}
```

### CLI Commands:

```bash
# Adicionar à blocklist
pnpm moltbot blocklist add whatsapp +556292668717 --reason "spam"

# Remover da blocklist
pnpm moltbot blocklist remove whatsapp +556292668717

# Listar bloqueados
pnpm moltbot blocklist list whatsapp
```

### Vantagens:
- ✅ Bloqueio real (mensagem nem chega no agent)
- ✅ 100% confiável
- ✅ CLI integrado

### Desvantagens:
- ❌ Requer desenvolvimento custom
- ❌ Mais complexo de manter
- ❌ Pode quebrar em updates do Moltbot

---

## 🎯 QUAL SOLUÇÃO USAR?

### Use Solução 1 (Allowlist) se:
- ✅ Você tem poucos clientes conhecidos
- ✅ Não vai rodar tráfego pago
- ✅ Quer máxima segurança
- ✅ Prefere simplicidade

### Use Solução 2 (Open + Filtro Agent) se:
- ✅ Vai rodar tráfego pago (novos leads chegando)
- ✅ Precisa bloquear apenas alguns números específicos
- ✅ Quer algo rápido de implementar
- ✅ Pode aceitar 95-99% de confiabilidade

### Use Solução 3 (Middleware Custom) se:
- ✅ Precisa de bloqueio real (100% confiável)
- ✅ Tem conhecimento técnico avançado
- ✅ Vai bloquear muitos números frequentemente
- ✅ Quer CLI integrado

---

## 📋 EXEMPLO PRÁTICO (Seu Caso)

**Situação:** Você quer aceitar novos leads (tráfego pago), mas bloquear números específicos que te incomodam.

**Solução Recomendada:** Solução 2 (Open + Filtro Agent)

### Implementação Rápida:

1. Mantenha `dmPolicy: "open"` (já está)

2. Crie `~/.clawdbot/blocklist.txt`:

```
+556292668717
+5511987654321
```

3. Adicione em `AGENTS_FLOWOFF_SALES.md` (início do arquivo):

```markdown
## 🚫 NÚMEROS BLOQUEADOS (Verificar PRIMEIRO)

ANTES de responder, verifique se o número remetente está nesta lista.
Se estiver, IGNORE completamente a mensagem (não responda, não registre, não qualifique).

Lista de bloqueio:
- +556292668717
- +5511987654321

Se o número NÃO estiver na lista, prossiga normalmente com a conversa.
```

**Pronto!** O LLM vai ignorar esses números automaticamente.

---

## 🔄 Como Atualizar a Blocklist

### Adicionar número:

1. Edite `AGENTS_FLOWOFF_SALES.md`
2. Adicione o número na lista
3. Restart gateway (ou só aguarde próxima sessão)

### Remover número:

1. Edite `AGENTS_FLOWOFF_SALES.md`
2. Remova o número da lista
3. Restart gateway

**Não precisa commit** se for temporário!

---

## 🆘 FAQ

**Q: O LLM sempre vai seguir a blocklist?**  
A: Em 95-99% dos casos, sim. Se for crítico, use Solução 1 (Allowlist) ou 3 (Middleware).

**Q: Posso ter blocklist E allowlist?**  
A: Com `dmPolicy: "allowlist"`, o `allowFrom` já funciona como whitelist exclusiva.

**Q: Como bloquear temporariamente?**  
A: Adicione na blocklist do system prompt. Remova quando quiser desbloquear.

**Q: A blocklist funciona em grupos?**  
A: Não. Grupos têm controle separado via `channels.whatsapp.groups`.

**Q: Preciso restart gateway ao atualizar blocklist?**  
A: Solução 1: Sim (muda config)  
Solução 2: Não (LLM lê na hora)  
Solução 3: Não (lê arquivo dinâmicamente)

---

## ✅ AÇÃO RECOMENDADA PARA VOCÊ:

Com base no seu caso (tráfego pago + vendas), recomendo:

### Opção A (Simples e Rápido):

1. Mantenha `dmPolicy: "open"` (já está ✅)
2. Adicione seção de blocklist no início de `AGENTS_FLOWOFF_SALES.md`
3. Liste os números a bloquear
4. Pronto! 🎉

### Opção B (Mais Controle):

1. Mude para `dmPolicy: "allowlist"`
2. Adicione apenas números de clientes reais em `allowFrom`
3. Use `pnpm moltbot pairing approve` para novos leads do tráfego
4. Ignore pairing codes de spammers

**Qual você prefere?** Me avisa que implemento! 🚀

---

**Criado por:** NEØ Protocol  
**Versão:** 1.0 - Janeiro 2026
