# 🔐 NEO Protocol - Guia de Backup de Keys

**⚠️ CRÍTICO:** As private keys em `.env` precisam de backup AGORA!

---

## 🚀 OPÇÃO 1: Backup Criptografado (Mais Rápido)

### Execute o script:

```bash
cd .neo-identities
./backup-keys.sh
```

**O que ele faz:**

1. ✅ Criptografa `.env` com senha forte (AES-256)
2. ✅ Cria arquivo `neo-keys-backup-YYYYMMDD-HHMMSS.gpg`
3. ✅ Pergunta se quer deletar `.env` original
4. ✅ Deleta com segurança (`shred` ou `srm`)

**Recuperar depois:**

```bash
gpg --decrypt neo-keys-backup-*.gpg > .env
```

---

## 📱 OPÇÃO 2: 1Password (Mais Seguro a Longo Prazo)

### Setup 1Password:

```bash
# 1. Abrir 1Password app (GUI)
open -a "1Password"

# 2. Criar item manualmente:
#    - New Item → Secure Note
#    - Title: "NEO Protocol Keys"
#    - Colar conteúdo de .env

# 3. Deletar .env local
cd .neo-identities
shred -u .env  # Linux
# ou
srm .env       # macOS (instalar: brew install srm)
```

### Se quiser usar CLI depois:

```bash
# Login 1Password CLI
op signin

# Criar item
op item create \
  --category=Login \
  --title="NEO Protocol Keys" \
  --vault="Personal" \
  "Private Keys[password]=$(cat .env)"

# Deletar .env
rm .env
```

---

## 📋 OPÇÃO 3: Copiar Manualmente

### Para onde copiar:

```bash
# 1. Ver conteúdo
cat .env

# 2. Copiar para clipboard
cat .env | pbcopy  # macOS
# ou
cat .env | xclip   # Linux

# 3. Colar em:
#    ✅ 1Password (Secure Note)
#    ✅ Bitwarden
#    ✅ LastPass
#    ✅ Arquivo criptografado (USB)
#    ✅ Papel físico (guarde em cofre!)

# 4. Deletar .env
shred -u .env  # Linux
srm .env       # macOS
```

---

## ⚠️ IMPORTANTE

### ❌ NUNCA faça isso:

```bash
# ❌ NÃO envie por email
# ❌ NÃO poste em chat (Slack, Discord, etc)
# ❌ NÃO commite no git
# ❌ NÃO guarde em texto plano na nuvem
# ❌ NÃO compartilhe por mensagem
```

### ✅ SEMPRE faça isso:

```bash
# ✅ Use criptografia (GPG, OpenSSL)
# ✅ Senha forte (16+ caracteres)
# ✅ Múltiplos backups (3-2-1 rule)
# ✅ Delete .env local após backup
# ✅ Teste recuperação imediatamente
```

---

## 🔄 Regra 3-2-1 de Backup

```
3 cópias dos dados
2 mídias diferentes
1 cópia off-site (fora do local)
```

**Exemplo ideal:**
1. ✅ 1Password (cloud + sync)
2. ✅ Arquivo GPG em USB criptografado
3. ✅ Papel físico em cofre

---

## 🧪 Testar Recuperação

### Depois de fazer backup

```bash
# 1. Renomear .env original
mv .env .env.original

# 2. Tentar recuperar do backup
gpg --decrypt neo-keys-backup-*.gpg > .env

# 3. Testar identidades
cd ..
pnpm tsx scripts/test-neo-identities.ts

# 4. Se passou, deletar .env.original
shred -u .env.original
```

---

## 📊 Checklist

```
[ ] Escolhi método de backup
[ ] Criei backup criptografado
[ ] Testei recuperação
[ ] Guardei em local seguro
[ ] Fiz segundo backup (redundância)
[ ] Deletei .env local
[ ] Anotei senha do backup
[ ] Testei identidades funcionam
```

---

## 🆘 Recuperação de Emergência

### Se perdeu o backup:

⚠️ **NÃO HÁ COMO RECUPERAR private keys perdidas!**

Você precisará:
```bash
# 1. Gerar novas identidades
pnpm tsx scripts/generate-neo-identities.ts

# 2. Fazer novo backup
cd .neo-identities
./backup-keys.sh

# 3. Atualizar todas as skills publicadas
#    (re-assinar com novas identidades)
```

---

## 📞 Suporte

Se tiver dúvidas sobre backup:
1. Leia documentação 1Password: https://support.1password.com
2. Guia GPG: https://gnupg.org/documentation/
3. NEO Protocol docs: `NEO_IDENTITIES_GENERATED.md`

---

**🔐 Lembre-se:** Private keys são como senhas de banco. Perder = perder acesso permanente!
