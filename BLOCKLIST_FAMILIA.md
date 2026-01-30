# 👨‍👩‍👧‍👦 Blocklist de Números Pessoais

**Status:** 🟡 AGUARDANDO LISTA  
**Objetivo:** Desativar FlowCloser para contatos pessoais/família

---

## 📋 LISTA DE NÚMEROS (Preencher)

```bash
# FORMATO: +55 (DDD) 9XXXX-XXXX
# Adicione um número por linha

# Você
+5562983231110

# Família (aguardando)
# +5562XXXXXXXX  # Nome
# +5562XXXXXXXX  # Nome
# +5562XXXXXXXX  # Nome
```

---

## 🎯 COMPORTAMENTO ESPERADO

### Para Números na Blocklist:
```
Lead: "Oi"
Bot: "Oi! 👋"
[SEM system prompt de vendas]
[SEM qualificação]
[SEM pitch]
```

### Para Outros Números:
```
Lead: "Oi"
Bot: "Oi! Sou o assistente da NEØ FlowOFF. 
     Como posso ajudar sua empresa a escalar com tráfego pago?"
[COM system prompt de vendas]
[COM qualificação]
[COM pitch quando apropriado]
```

---

## 🔧 IMPLEMENTAÇÃO (Automática)

Quando você fornecer a lista, vou:

1. **Atualizar `AGENTS_FLOWOFF_SALES.md`:**
```markdown
## 🚫 BLOCKLIST (Números Pessoais)

Se o número do lead estiver nesta lista, responda APENAS "Oi! 👋" e NÃO ative o system prompt de vendas:

- +5562983231110 (Você)
- +5562XXXXXXXX (Esposa)
- +5562XXXXXXXX (Mãe)
...

Para esses números: conversa normal, SEM vendas.
```

2. **Testar com um número da lista**

3. **Commitar as mudanças**

---

## 📝 INSTRUÇÃO PARA A LLM

```markdown
### REGRA CRÍTICA: Verificar Blocklist PRIMEIRO

ANTES de qualquer coisa, verifique se o número está na blocklist:

```typescript
const BLOCKLIST = [
  '+5562983231110',
  '+5562XXXXXXXX',
  // ... outros
];

if (BLOCKLIST.includes(leadNumber)) {
  return "Oi! 👋";
  // NÃO prosseguir com vendas
}
```

Se o número NÃO está na blocklist, prossiga com o system prompt normal.
```

---

## ✅ CHECKLIST

- [ ] Receber lista de números da família
- [ ] Adicionar à blocklist em `AGENTS_FLOWOFF_SALES.md`
- [ ] Testar com número da lista
- [ ] Testar com número fora da lista
- [ ] Commitar alterações
- [ ] ✅ Proteção ativada!

---

## 🎯 QUANDO ESTIVER PRONTO

**Me envie a lista assim:**

```
+5562983231110  Netto (você)
+5562XXXXXXXX   Nome Esposa
+5562XXXXXXXX   Nome Mãe
+5562XXXXXXXX   Nome Pai
...
```

**Vou implementar imediatamente!** 🚀

---

**Status:** Aguardando lista para ativar proteção! 👨‍👩‍👧‍👦
