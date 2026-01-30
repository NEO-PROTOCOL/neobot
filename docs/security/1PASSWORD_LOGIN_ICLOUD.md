# 🔐 1Password 8 - Login com iCloud

## ✅ 1Password 8 Instalado!

O app está aberto. Agora vamos fazer login com sua conta iCloud.

---

## 📱 PASSO A PASSO (Login):

### Tela Inicial do 1Password 8

Você deve ver uma das seguintes telas:

#### Cenário A: Primeira vez

```text
┌─────────────────────────────────────┐
│  Welcome to 1Password               │
│                                     │
│  [Get Started]                      │
│  [Already have an account?]         │
└─────────────────────────────────────┘
```

**Action:** Click "Already have an account?"

#### Cenário B: Migração do 1Password 7

```text
┌─────────────────────────────────────┐
│  Migrate from 1Password 7           │
│                                     │
│  [Migrate Now]                      │
│  [Sign In Instead]                  │
└─────────────────────────────────────┘
```

**Action:** Click "Sign In Instead"

---

### Passo 1: Escolher Método de Login

```text
┌─────────────────────────────────────┐
│  Sign In to 1Password               │
│                                     │
│  ○ Sign in with 1Password account   │
│  ○ Sign in with Apple ID            │
│                                     │
│  [Continue]                         │
└─────────────────────────────────────┘
```

**Como você pagou via iCloud:**
- ✅ Selecione: **"Sign in with Apple ID"**
- Click **[Continue]**

---

### Passo 2: Autenticação Apple ID

```text
┌─────────────────────────────────────┐
│  Sign in with Apple                 │
│                                     │
│  Enter your Apple ID                │
│                                     │
│  Email: [_________________]         │
│  Password: [_________________]      │
│                                     │
│  [Continue]                         │
└─────────────────────────────────────┘
```

**Action:**
1. Digite seu Apple ID (email iCloud)
2. Digite a senha
3. Click **[Continue]**

---

### Passo 3: Autenticação 2FA (se habilitado)

```text
┌─────────────────────────────────────┐
│  Two-Factor Authentication          │
│                                     │
│  Enter the 6-digit code from your  │
│  other Apple device                 │
│                                     │
│  Code: [___][___][___][___][___][___]│
│                                     │
│  [Verify]                           │
└─────────────────────────────────────┘
```

**Action:**
1. Pegue código no iPhone/iPad
2. Digite o código
3. Click **[Verify]**

---

### Passo 4: Criar Master Password

```text
┌─────────────────────────────────────┐
│  Create Master Password             │
│                                     │
│  This password unlocks 1Password    │
│  on this device                     │
│                                     │
│  Master Password: [_________________]│
│  Confirm: [_________________]       │
│                                     │
│  [Create]                           │
└─────────────────────────────────────┘
```

**IMPORTANTE:**
- ✅ Crie uma senha FORTE
- ✅ ANOTE em lugar seguro
- ✅ Esta senha NÃO pode ser recuperada
- ⚠️ Se esquecer, perde TUDO

**Sugestão de senha forte:**
```
Exemplo: Mello@NeoBot2026!Protocol#Secure
(Min 16 chars, maiúsculas, minúsculas, números, símbolos)
```

---

### Passo 5: Configurar Touch ID (Opcional)

```text
┌─────────────────────────────────────┐
│  Set Up Touch ID                    │
│                                     │
│  Use Touch ID to unlock 1Password   │
│  instead of typing your master      │
│  password                           │
│                                     │
│  [Enable Touch ID]                  │
│  [Skip]                             │
└─────────────────────────────────────┘
```

**Recomendação:**
- ✅ Click **[Enable Touch ID]**
- Facilita muito o uso diário

---

### Passo 6: ✅ Sucesso!

```text
┌─────────────────────────────────────┐
│  You're all set!                    │
│                                     │
│  1Password is ready to use          │
│                                     │
│  [Get Started]                      │
└─────────────────────────────────────┘
```

**Parabéns! 🎉**

---

## 🔧 CONFIGURAR CLI INTEGRATION

Agora que está logado, habilite o CLI:

### Passo 1: Abrir Settings

```text
Menu Bar: 1Password → Settings...
Ou: ⌘, (Command + Vírgula)
```

### Passo 2: Aba Developer

```text
┌─────────────────────────────────────┐
│  Settings                           │
│  ├─ General                         │
│  ├─ Accounts                        │
│  ├─ Security                        │
│  ├─ Browser                         │
│  └─ Developer ← AQUI                │
└─────────────────────────────────────┘
```

### Passo 3: Enable CLI

```text
┌─────────────────────────────────────┐
│  Developer                          │
│                                     │
│  ✅ Connect with 1Password CLI      │
│     Allow the 1Password CLI to      │
│     access this app                 │
│                                     │
│  ✅ Use Touch ID for CLI            │
│     Authenticate CLI requests       │
│     with Touch ID                   │
│                                     │
└─────────────────────────────────────┘
```

**Actions:**
1. ✅ Marque: **"Connect with 1Password CLI"**
2. ✅ Marque: **"Use Touch ID for CLI"** (recomendado)

---

## 🧪 TESTAR CONEXÃO

Volte ao terminal e teste:

```bash
# 1. Listar contas
op account list

# Esperado:
# URL: https://start.1password.com
# EMAIL: seu@email.com
# USER ID: XXXXX
# STATUS: active

# 2. Ver quem está logado
op whoami

# Esperado:
# Nome e email da conta

# 3. Listar vaults
op vault list

# Esperado:
# ID   NAME        TYPE
# xxxx Private     USER_CREATED
# xxxx Shared      USER_CREATED
```

---

## 🎯 PRÓXIMOS PASSOS

Depois de conectar:

### 1. Criar Vault para NeoBot

```bash
# Via CLI
op vault create "NeoBot Secrets"

# Ou via App (mais fácil)
# Click "+" → New Vault → "NeoBot Secrets"
```

### 2. Adicionar primeiro secret

**Via App (recomendado para primeira vez):**

```text
1. Click "+" (New Item)
2. Category: Login
3. Title: Anthropic API Key
4. Username: neobot
5. Password: [cole sua API key]
6. Vault: NeoBot Secrets
7. Save
```

### 3. Testar recuperação via CLI

```bash
# Get password
op item get "Anthropic API Key" \
  --vault="NeoBot Secrets" \
  --fields password

# Export para variável
export ANTHROPIC_API_KEY=$(op item get "Anthropic API Key" \
  --vault="NeoBot Secrets" \
  --fields password)

# Verificar
echo $ANTHROPIC_API_KEY | head -c 20
# Deve mostrar: sk-ant-api03-...
```

---

## 🆘 Troubleshooting

### Não aparece opção "Sign in with Apple ID"

Isso significa que sua assinatura não está vinculada ao Apple ID.

**Solução:**
1. Use "Sign in with 1Password account"
2. Você recebeu email com:
   - Sign-in address (algo como: xyz.1password.com)
   - Secret Key (28 caracteres)
   - Emergency Kit (PDF)

### Erro: "Invalid credentials"

**Verifique:**
- Email está correto?
- Senha está correta?
- Tem 2FA habilitado no Apple ID?

### Erro: "Cannot create master password"

**Causa:** Senha muito fraca

**Solução:**
- Min 16 caracteres
- Maiúsculas + minúsculas
- Números + símbolos

### CLI ainda não conecta

```bash
# 1. Reiniciar 1Password
killall "1Password"
open -a "1Password"

# 2. Re-enable CLI
# Settings → Developer → Toggle off e on novamente

# 3. Reiniciar terminal
# Feche e abra novo terminal

# 4. Testar
op account list
```

---

## 📊 Verificação Final

```text
Checklist:
─────────────────────────────────────
[ ] 1Password 8 instalado
[ ] Logado com Apple ID/1Password account
[ ] Master password criado e anotado
[ ] Touch ID habilitado (opcional)
[ ] Settings → Developer → CLI enabled
[ ] CLI conectado (op account list funciona)
[ ] Vault "NeoBot Secrets" criado
[ ] Primeiro secret adicionado
[ ] Secret recuperado via CLI com sucesso
```

---

## 🎉 Pronto para Produção!

Quando tudo estiver funcionando:

```bash
# Migrar todos secrets do .env
./scripts/migrate-to-1password.sh

# Criar script de load
./scripts/load-secrets-1password.sh

# Testar gateway
source scripts/load-secrets-1password.sh
pnpm moltbot gateway

# Se tudo OK, deletar .env
mv .env .env.backup
# Test everything
rm .env.backup
```

---

## 📞 Me avise quando:

✅ Conseguir logar no app
✅ CLI conectar (op account list funciona)
✅ Primeiro secret adicionado

Aí te ajudo com a migração completa! 🚀

---

▓▓▓ NΞØ MELLØ
────────────────────────────────────────
Core Architect · NΞØ Protocol
neo@neoprotocol.space

"One step at a time to maximum security."
────────────────────────────────────────
