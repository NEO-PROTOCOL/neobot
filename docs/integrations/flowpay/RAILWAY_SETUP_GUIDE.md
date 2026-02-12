# FlowPay Railway - Guia Visual de Configuração

Passo a passo com imagens de como configurar as variáveis de ambiente no Railway.

---

## 🎯 O Que Você Vai Configurar

**3 variáveis obrigatórias** para o FlowPay funcionar:

| Variável | Valor | Onde Obter |
|----------|-------|------------|
| `WOOVI_API_KEY` | `Q2xpZW50X0lkXzk2MDRkYTJm...` | Dashboard Woovi → API → Production Keys |
| `WOOVI_WEBHOOK_SECRET` | `openpix_o2jGDXpNroaj...` | Dashboard Woovi → Webhooks → Secret |
| `JWT_SECRET` | `6efddab08745069cd...` | Mesmo valor do Neobot `.env` |

---

## 📋 Passo a Passo

### 1. Acessar Railway

```
URL: https://railway.app
Login com sua conta
```

**Navegar para o projeto**:
```
Dashboard → Projects → FlowPay (ou flowpay-production-10d8)
```

---

### 2. Abrir Variables

Na página do projeto FlowPay:

```
┌─────────────────────────────────────┐
│ FlowPay                             │
├─────────────────────────────────────┤
│ ⚙️  Settings                         │
│ 📊 Deployments                      │
│ 📝 Logs                             │
│ 🔧 Variables  ← CLIQUE AQUI         │
│ 💾 Data                             │
└─────────────────────────────────────┘
```

Ou navegue:
```
Projeto → Settings → Environment
```

---

### 3. Adicionar Primeira Variável: WOOVI_API_KEY

**Clique em**: `+ New Variable` ou `Add Variable`

```
┌─────────────────────────────────────────────────┐
│  Add Environment Variable                       │
├─────────────────────────────────────────────────┤
│  Variable Name:                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ WOOVI_API_KEY                             │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Variable Value:                                │
│  ┌───────────────────────────────────────────┐ │
│  │ Q2xpZW50X0lkXzk2MDRkYTJmLTQ0N2EtNGJjMi │ │
│  │ 1iNjYxLWQwNzBlOGNjNWVkZTpDbGllbnRfU2Vj │ │
│  │ cmV0X0g5M3ZsbEsrTjNvSWJ0bEFkVWJ1T0hDbE │ │
│  │ xUano5WWRiNmpTNHlORzVsaU09             │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  [ Cancel ]            [ Add Variable ]         │
└─────────────────────────────────────────────────┘
```

**Cole o valor completo** (toda a string Base64 da Woovi)

---

### 4. Adicionar Segunda Variável: WOOVI_WEBHOOK_SECRET

**Clique novamente em**: `+ New Variable`

```
┌─────────────────────────────────────────────────┐
│  Add Environment Variable                       │
├─────────────────────────────────────────────────┤
│  Variable Name:                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ WOOVI_WEBHOOK_SECRET                      │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Variable Value:                                │
│  ┌───────────────────────────────────────────┐ │
│  │ openpix_XXXXXXXXXXXXXXXXXXXXXXXXXXXXX │ │
│  │ DpFgj36R75sA=                             │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  [ Cancel ]            [ Add Variable ]         │
└─────────────────────────────────────────────────┘
```

**Cole o valor do HMAC Secret** da Woovi

---

### 5. Adicionar Terceira Variável: JWT_SECRET

**Clique novamente em**: `+ New Variable`

```
┌─────────────────────────────────────────────────┐
│  Add Environment Variable                       │
├─────────────────────────────────────────────────┤
│  Variable Name:                                 │
│  ┌───────────────────────────────────────────┐ │
│  │ JWT_SECRET                                │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  Variable Value:                                │
│  ┌───────────────────────────────────────────┐ │
│  │ 6efddab08745069cd6157087ef8a3b01c6343dd3 │ │
│  │ da7754b311180045b8855423c2c28d2a69c0893b │ │
│  │ 52ff0c1344ac87cf15c2daa7d1a58f4971226e59 │ │
│  │ 296f0ed8                                  │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  [ Cancel ]            [ Add Variable ]         │
└─────────────────────────────────────────────────┘
```

**IMPORTANTE**: Use o **MESMO valor** do seu arquivo `.env`:
```bash
# Copie daqui:
cat /Users/nettomello/CODIGOS/neobot/.env | grep FLOWPAY_JWT_SECRET
```

---

### 6. Verificar Variáveis Adicionadas

Após adicionar as 3 variáveis, você deve ver:

```
┌─────────────────────────────────────────────────┐
│  Environment Variables                          │
├─────────────────────────────────────────────────┤
│  ✅ WOOVI_API_KEY           Q2xpZW50X0lkXz... │
│  ✅ WOOVI_WEBHOOK_SECRET    openpix_o2jGDX... │
│  ✅ JWT_SECRET              6efddab087450... │
│                                                 │
│  [ + New Variable ]                             │
└─────────────────────────────────────────────────┘
```

---

### 7. Aguardar Re-deploy Automático

O Railway irá **automaticamente**:

```
┌─────────────────────────────────────┐
│  ⏳ Deploying...                    │
│                                     │
│  Status: Building                   │
│  Time: 00:45                        │
│                                     │
│  [████████░░] 80%                   │
└─────────────────────────────────────┘
```

Aguarde **~2 minutos** até ver:

```
┌─────────────────────────────────────┐
│  ✅ Deployed                        │
│                                     │
│  Status: Active                     │
│  URL: flowpay-production-10d8.      │
│       up.railway.app                │
│                                     │
│  Deploy Time: 1m 45s                │
└─────────────────────────────────────┘
```

---

## 🧪 Testar Após Deploy

### Teste 1: Verificar Service Status

```bash
curl https://flowpay-production-10d8.up.railway.app/
```

**Esperado**: HTML da página principal (200 OK)

### Teste 2: Criar Cobrança

```bash
curl -X POST https://flowpay-production-10d8.up.railway.app/api/create-charge \
  -H "Content-Type: application/json" \
  -d '{
    "wallet": "0x0000000000000000000000000000000000000000",
    "valor": 1.00,
    "moeda": "BRL",
    "id_transacao": "test-'$(date +%s)'",
    "product_id": "integration-test"
  }' | jq .
```

**Esperado ANTES** (sem variáveis):
```json
{
  "success": false,
  "error": "Erro de autenticação na API. Verifique suas credenciais."
}
```

**Esperado DEPOIS** (com variáveis):
```json
{
  "success": true,
  "pix_data": {
    "qr_code": "https://api.woovi.com/openpix/charge/...",
    "br_code": "00020126580014br.gov.bcb.pix...",
    "correlation_id": "test-1738264800",
    "value": 1.00,
    "expires_at": "2026-01-30T...",
    "status": "ACTIVE"
  }
}
```

---

## 📊 Verificar Logs

### Via Dashboard

```
Railway → FlowPay → Deployments → Latest → View Logs
```

**Procure por**:
```
✅ Server started on port 3000
✅ WOOVI_API_KEY loaded
✅ JWT_SECRET configured
✅ Webhook secret configured
```

### Via CLI

```bash
# Instalar Railway CLI se ainda não tem
npm install -g @railway/cli

# Login
railway login

# Ver logs em tempo real
railway logs --follow
```

---

## 🔍 Troubleshooting

### Problema: "Variables not taking effect"

**Causa**: Railway ainda está deployando a versão antiga

**Solução**:
1. Force um novo deploy: Settings → Service → Redeploy
2. Ou espere mais 1-2 minutos

### Problema: "Cannot find variable"

**Causa**: Nome da variável incorreto

**Solução**:
Confirme que os nomes estão **EXATOS**:
- ✅ `WOOVI_API_KEY` (sem espaços)
- ✅ `WOOVI_WEBHOOK_SECRET` (sem espaços)
- ✅ `JWT_SECRET` (sem espaços)

❌ `woovi_api_key` (minúsculas - ERRADO)
❌ `WOOVI API KEY` (com espaço - ERRADO)

### Problema: "Value too long"

**Causa**: Copiar/colar pode ter quebrado a linha

**Solução**:
1. Cole o valor em um editor de texto primeiro
2. Remova quebras de linha
3. Copie a string contínua
4. Cole no Railway

---

## ✅ Checklist Final

Após configurar, verifique:

- [ ] 3 variáveis visíveis no Railway Variables
- [ ] Deploy completou com sucesso (status: Active)
- [ ] Logs mostram "Server started"
- [ ] Teste de curl retorna `success: true`
- [ ] QR code PIX está sendo gerado

Se **TODAS** as checkboxes estiverem marcadas:
🎉 **Configuração Railway completa!**

---

## 📞 Suporte

**Se algo não funcionar**:

1. **Verificar logs do Railway**:
   ```bash
   railway logs --tail 100
   ```

2. **Re-verificar valores**:
   - Woovi API Key está correta?
   - HMAC Secret está correto?
   - JWT Secret é o mesmo do Neobot?

3. **Testar manualmente**:
   ```bash
   cd /Users/nettomello/CODIGOS/neobot
   ./scripts/flowpay/test-integration.sh
   ```

4. **Consultar docs**:
   - `docs/integrations/flowpay/WOOVI_OFFICIAL_SETUP.md`
   - `docs/integrations/flowpay/ENV_VARIABLES_GUIDE.md`

---

**Última atualização**: 30 Jan 2026  
**Status**: 📸 Guia Visual Completo
