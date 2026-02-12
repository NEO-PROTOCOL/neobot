# 🚨 FlowPay Railway Troubleshooting

**Data:** 30 Janeiro 2026, 22:00  
**Problema:** Erro de autenticação após re-deploy

---

## ❌ Problema Atual

**Teste retorna:**
```json
{
  "success": false,
  "error": "Erro de autenticação na API. Verifique suas credenciais.",
  "type": "EXTERNAL_API_ERROR"
}
```

**Isso significa:** As variáveis não foram carregadas pelo backend Railway.

---

## ✅ Checklist de Verificação

### 1. Confirmar que Re-deploy Completou

**No Railway Dashboard:**

1. Acesse: https://railway.app
2. Projeto: FlowPay
3. Vá em **Deployments**
4. Verifique o status do último deploy:
   - ✅ **Success** (verde) = Deploy completo
   - 🟡 **Building** (amarelo) = Ainda processando
   - ❌ **Failed** (vermelho) = Erro no deploy

**Se ainda está "Building":** Aguarde mais 2-3 minutos.

---

### 2. Verificar Variáveis no Railway

**Ir para Variables Tab:**
1. Railway Dashboard → FlowPay
2. Clique em **Variables**
3. Confirme que TODAS estão lá:

```bash
✅ WOOVI_API_KEY = Q2xpZW50X0lkX1hYWFhYWFhYOnNlY3JldF9YWFhYWFhYWA==

✅ WOOVI_WEBHOOK_SECRET = openpix_XXXXXXXXXXXXXXXXXXXXXXXXXXXXX

✅ TOKEN_SECRET = your_random_secret_min_64_chars_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

**⚠️ ATENÇÃO aos nomes:**
- Deve ser `TOKEN_SECRET` (NÃO `JWT_SECRET`)
- Deve ser `WOOVI_API_KEY` (NÃO `FLOWPAY_API_KEY`)
- Deve ser `WOOVI_WEBHOOK_SECRET`

---

### 3. Verificar Logs do Deploy

**Ver logs de build/runtime:**
1. Railway → Deployments → Latest
2. Clique em **View Logs**
3. Procure por:

**✅ Logs esperados:**
```
Server started on port 3000
Environment variables loaded
Listening on 0.0.0.0:3000
```

**❌ Logs de erro:**
```
Missing WOOVI_API_KEY
Error: Cannot read environment variable
Authentication failed
```

**Se houver erro:** Copie a mensagem de erro completa.

---

### 4. Force Restart (Se necessário)

**Se o deploy mostrar "Success" mas ainda não funciona:**

1. Railway → FlowPay
2. Clique em **Settings** (no topo)
3. Procure por **"Restart Service"** ou **"Restart"**
4. Clique e aguarde 2-3 minutos

**Ou via CLI:**
```bash
railway login
railway restart
```

---

## 🔍 Diagnóstico Detalhado

### Teste 1: Service UP?

```bash
curl -I https://flowpay-production-10d8.up.railway.app/
```

**Esperado:**
```
HTTP/2 200 
```

**Se 503/502:** Serviço está down, precisa restart.

---

### Teste 2: Create Charge

```bash
curl -X POST https://flowpay-production-10d8.up.railway.app/api/create-charge \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "0x0000000000000000000000000000000000000000",
    "valor": 1.00,
    "moeda": "BRL",
    "id_transacao": "test-'$(date +%s)'",
    "product_id": "neobot-test"
  }'
```

**❌ Erro atual:**
```json
{
  "success": false,
  "error": "Erro de autenticação na API"
}
```

**✅ Esperado (quando funcionar):**
```json
{
  "success": true,
  "pix_data": {
    "qr_code": "https://api.woovi.com/qr/v1/...",
    "br_code": "00020126...",
    "value": 1.00,
    "status": "pending"
  }
}
```

---

## 🛠️ Soluções Possíveis

### Solução 1: Re-adicionar Variáveis

**Se as variáveis estiverem erradas:**

1. Railway → Variables
2. **Delete** as 3 variáveis
3. **Adicione novamente** (copie exatamente):

```bash
# Nome: WOOVI_API_KEY
# Valor:
Q2xpZW50X0lkX1hYWFhYWFhYOnNlY3JldF9YWFhYWFhYWA==

# Nome: WOOVI_WEBHOOK_SECRET
# Valor:
openpix_XXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# Nome: TOKEN_SECRET
# Valor:
your_random_secret_min_64_chars_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

4. Clique em **Deploy** novamente
5. Aguarde 3-5 minutos

---

### Solução 2: Verificar Backend Code

**O backend Railway precisa ter este código:**

```javascript
// server.js ou app.js
const wooviApiKey = process.env.WOOVI_API_KEY;
const tokenSecret = process.env.TOKEN_SECRET;
const webhookSecret = process.env.WOOVI_WEBHOOK_SECRET;

if (!wooviApiKey) {
  console.error('❌ WOOVI_API_KEY não encontrada');
  process.exit(1);
}

console.log('✅ Environment variables loaded');
```

**Se o backend não está lendo as variáveis corretamente:**
- Precisa verificar o código do backend no Railway

---

### Solução 3: Check Railway Region

**Se o deploy está OK mas não responde:**

1. Railway → Settings
2. Verifique **Region**: Deve ser `us-west1` ou similar
3. Se mudou, pode causar delay

**Aguarde 5-10 minutos** para propagação.

---

## 📊 Status das Variáveis

| Variável | Local (.env) | Railway | Código |
|----------|--------------|---------|--------|
| `TOKEN_SECRET` | ✅ Linha 9 | ❓ A verificar | ✅ unlock.ts linha 220 |
| `WOOVI_API_KEY` | ✅ Linha 2 | ❓ A verificar | ✅ status.ts linha 46 |
| `WOOVI_WEBHOOK_SECRET` | ✅ Linha 3 | ❓ A verificar | ✅ unlock.ts linha 232 |

**Legenda:**
- ✅ = Configurado
- ❓ = Precisa verificar
- ❌ = Faltando

---

## 🎯 Próxima Ação Recomendada

### Opção 1: Verificar Logs (Mais Rápido)

1. Railway → Deployments → Latest
2. **View Logs**
3. Procure por erros ou variáveis faltando
4. Me envie o log se encontrar erro

### Opção 2: Screenshot das Variables

1. Railway → Variables
2. Tire um **screenshot** (pode desfocar os valores)
3. Confirme que os **nomes** estão corretos:
   - `TOKEN_SECRET` (não `JWT_SECRET`)
   - `WOOVI_API_KEY`
   - `WOOVI_WEBHOOK_SECRET`

### Opção 3: Force Restart + Wait

1. Railway → Settings → **Restart Service**
2. Aguarde **5 minutos completos**
3. Teste novamente:
   ```bash
   ./scripts/flowpay/test-integration.sh
   ```

---

## 🔗 Links Úteis

- [Railway Dashboard](https://railway.app)
- [Railway Docs - Variables](https://docs.railway.app/develop/variables)
- [Railway Docs - Troubleshooting](https://docs.railway.app/troubleshoot/fixing-common-errors)

---

## 📝 Checklist Rápido

Antes de testar novamente:

- [ ] Deploy mostrou "Success" (verde)?
- [ ] Passou mais de 3 minutos desde o re-deploy?
- [ ] As 3 variáveis estão no Railway?
- [ ] Os nomes das variáveis estão corretos? (TOKEN_SECRET, não JWT_SECRET)
- [ ] Fez force restart?
- [ ] Aguardou 5 minutos após restart?

Se TODOS estiverem ✅ e ainda não funcionar:
→ Verifique os logs do deploy para mensagem de erro específica.

---

**Status:** ⏳ Aguardando verificação  
**Última tentativa:** 30/01/2026 22:00  
**Próximo teste:** Após verificação das variáveis
