# 🔐 NEO PROTOCOL - BACKUP CRIADO

**Data:** 30 Janeiro 2026  
**Status:** ✅ **BACKUP CRIPTOGRAFADO CRIADO**

---

## ✅ O QUE FOI FEITO

1. ✅ Backup criptografado criado com OpenSSL (AES-256)
2. ✅ Senha de teste verificada (recuperação OK)
3. ✅ Arquivo protegido em `.neo-identities/`

---

## 🔑 SENHA DO BACKUP DE TESTE

```
Senha: teste123
```

**⚠️ ATENÇÃO:** Esta é apenas uma senha de TESTE!

Para produção, você deve:

1. Criar novo backup com senha forte
2. Guardar senha em local seguro
3. Deletar backup de teste

---

## 🚀 CRIAR BACKUP REAL (COM SENHA FORTE)

### Método 1: Script Automático

```bash
cd .neo-identities
./backup-keys.sh
# Vai pedir senha forte
# Digite 16+ caracteres: letras, números, símbolos
```

### Método 2: Manual com OpenSSL

```bash
cd .neo-identities

# Criar backup
openssl enc -aes-256-cbc -salt \
  -in .env \
  -out neo-keys-backup-$(date +%Y%m%d-%H%M%S).enc \
  -pbkdf2

# Vai pedir senha: digite uma FORTE!
# Exemplo: MyN3o!K3ys#2026$Pr0t0c0l@S3cur3
```

---

## 📥 RECUPERAR BACKUP

### Quando precisar das keys:

```bash
# Descriptografar
openssl enc -aes-256-cbc -d \
  -in neo-keys-backup-YYYYMMDD-HHMMSS.enc \
  -out .env \
  -pbkdf2

# Digite a senha que você usou
# Arquivo .env será restaurado
```

### Testar recuperação:

```bash
cd ..
pnpm tsx scripts/test-neo-identities.ts

# Deve mostrar:
# ✅ mio-core: Assinatura válida
# ... (9x)
# 🎉 Todas as identidades estão válidas!
```

---

## 🗑️ DELETAR .ENV LOCAL (APÓS BACKUP)

**⚠️ IMPORTANTE:** Só delete depois de verificar que o backup funciona!

### Método Seguro (Sobrescreve com zeros):

```bash
# Linux
shred -u .neo-identities/.env

# macOS (instalar srm primeiro)
brew install srm
srm .neo-identities/.env

# Alternativa simples
rm -P .neo-identities/.env  # macOS
rm .neo-identities/.env     # Fallback
```

---

## 📦 ONDE GUARDAR O BACKUP

### Locais Seguros:

1. ✅ **1Password** (Secure Note)
   - Upload do arquivo `.enc`
   - Ou copiar conteúdo do .env
   
2. ✅ **USB Criptografado**
   - BitLocker (Windows)
   - FileVault (macOS)
   - LUKS (Linux)

3. ✅ **Cloud Privado**
   - Google Drive (pasta privada)
   - Dropbox (criptografado)
   - iCloud (pasta segura)

4. ✅ **Cofre Físico**
   - Papel com keys impressas
   - USB em cofre
   - Caixa de segurança

### Regra 3-2-1:

```
3 cópias
2 mídias diferentes
1 off-site (fora do local)
```

**Exemplo:**
- 1Password (cloud)
- USB criptografado (físico)
- Papel em cofre (backup extremo)

---

## 🔐 SENHAS FORTES

### Como criar:

```bash
# Gerar senha aleatória forte
openssl rand -base64 32

# Exemplo de output:
# 7vQ9K2mN8pL3xR4jH6nW5sT1uY0zV8aC9bE2fG4hI=
```

### Requisitos:
- ✅ 16+ caracteres
- ✅ Letras maiúsculas e minúsculas
- ✅ Números
- ✅ Símbolos (!@#$%^&*)
- ✅ Fácil de lembrar para você
- ✅ Difícil de adivinhar

### Exemplos:
```
MyN3o!Pr0t0c0l#2026$S3cur3  (Bom)
Correct-Horse-Battery-Staple-2026!  (Melhor - passphrase)
7vQ9K2mN8pL3xR4jH6nW5sT1uY  (Mais forte - aleatória)
```

---

## ✅ CHECKLIST

```
[ ] Backup criado e testado
[ ] Senha forte definida
[ ] Backup guardado em 3 locais
[ ] Senha anotada em local seguro
[ ] .env local deletado
[ ] Recuperação testada
[ ] Identidades testadas (test-neo-identities.ts)
```

---

## 🆘 PROBLEMAS?

### "Esqueci a senha do backup"

❌ **Não há como recuperar sem a senha!**

Solução:
```bash
# Gerar novas identidades
pnpm tsx scripts/generate-neo-identities.ts

# Fazer novo backup
cd .neo-identities
./backup-keys.sh
```

### "Perdi o arquivo de backup"

❌ **Sem backup = sem keys!**

Se ainda tiver `.env`:
```bash
# Fazer backup AGORA
cd .neo-identities
./backup-keys.sh
```

Se não tiver `.env` nem backup:
```bash
# Gerar novas identidades
pnpm tsx scripts/generate-neo-identities.ts
```

---

## 📚 ARQUIVOS CRIADOS

```
.neo-identities/
├── neo-keys-backup-20260130-010831.enc  ✅ Backup teste
├── backup-keys.sh                       ✅ Script de backup
├── BACKUP_GUIDE.md                      ✅ Guia completo
└── BACKUP_INSTRUCTIONS.md               ✅ Este arquivo
```

---

## 🎯 PRÓXIMOS PASSOS

1. **Criar backup real com senha forte**
   ```bash
   cd .neo-identities
   ./backup-keys.sh
   ```

2. **Guardar em 3 locais seguros**

3. **Deletar .env local**
   ```bash
   shred -u .env  # ou srm .env
   ```

4. **Testar recuperação**
   ```bash
   # Recuperar
   openssl enc -aes-256-cbc -d -in backup.enc -out .env -pbkdf2
   
   # Testar
   pnpm tsx ../scripts/test-neo-identities.ts
   ```

---

**🔐 Segurança é prioridade! Não pule o backup.**

