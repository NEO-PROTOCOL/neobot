# Login Automático via Variáveis de Ambiente

O neo-ig-cli suporta login automático usando variáveis de ambiente, facilitando o uso em ambientes de servidor e containers Docker.

## Como Funciona

Quando as variáveis `INSTAGRAM_USERNAME` e `INSTAGRAM_PASSWORD` estão definidas, o comando `neo auth login` (ou `neeo auth login`) tenta fazer login automaticamente sem pedir credenciais.

## Configuração

### 1. Arquivo `.env` (Local/Docker)

Crie um arquivo `.env` na raiz do projeto:

```env
INSTAGRAM_USERNAME=seu_usuario_aqui
INSTAGRAM_PASSWORD=sua_senha_aqui
```

**⚠️ IMPORTANTE:**
- O arquivo `.env` está no `.gitignore` e **nunca** deve ser commitado
- Use este método apenas para desenvolvimento local ou servidores privados

### 2. Docker Compose

O `docker-compose.yml` já está configurado para ler o arquivo `.env`:

```bash
# Criar .env
cat > .env << EOF
INSTAGRAM_USERNAME=seu_usuario
INSTAGRAM_PASSWORD=sua_senha
NODE_ENV=production
EOF

# Iniciar com Docker Compose
docker-compose up -d
```

### 3. Docker Direto

```bash
docker run -it \
  --name neo-ig-cli \
  -v neo-ig-data:/app/data \
  -e INSTAGRAM_USERNAME=seu_usuario \
  -e INSTAGRAM_PASSWORD=sua_senha \
  neo-ig-cli:latest
```

### 4. Railway

No Railway, configure as variáveis em **Secrets** (não em Variables):

1. Acesse seu projeto no Railway
2. Vá em **Variables** → **New Variable**
3. Adicione:
   - `INSTAGRAM_USERNAME` = seu usuário
   - `INSTAGRAM_PASSWORD` = sua senha
4. Marque como **Secret** (não aparecerá nos logs)

## Comportamento

### Login Automático Bem-Sucedido

Se as credenciais estiverem corretas e não houver 2FA ou challenge:

```
✅ Logged in automatically as @seu_usuario
```

### Casos Especiais

#### 2FA (Autenticação de Dois Fatores)

Se sua conta tiver 2FA ativado:

```
⚠️ 2FA required. Automatic login cannot proceed. Please use manual login.
```

**Solução:** Use login manual ou configure um código de backup.

#### Challenge (Verificação de Segurança)

Se o Instagram solicitar verificação:

```
⚠️ Challenge required. Automatic login cannot proceed. Please use manual login.
```

**Solução:** Faça login manual uma vez para resolver o challenge, depois a sessão será salva.

#### Credenciais Incorretas

Se as credenciais estiverem erradas:

```
❌ Automatic login failed: [erro]. Falling back to manual login.
```

**Solução:** Verifique as variáveis de ambiente.

## Segurança

### ⚠️ Boas Práticas

1. **Nunca commite `.env`**
   - O arquivo já está no `.gitignore`
   - Verifique antes de fazer commit

2. **Use Secrets em Produção**
   - Railway: Use "Secrets" ao invés de "Variables"
   - Docker: Use Docker Secrets ou variáveis de ambiente do sistema
   - Kubernetes: Use Secrets

3. **Permissões de Arquivo**
   ```bash
   # Restringir acesso ao .env
   chmod 600 .env
   ```

4. **Rotação de Senhas**
   - Se suspeitar de comprometimento, altere a senha imediatamente
   - Atualize as variáveis de ambiente

5. **Logs**
   - As credenciais **não** aparecem nos logs
   - Apenas o username é logado (sem senha)

## Exemplos de Uso

### Desenvolvimento Local

```bash
# Criar .env
echo "INSTAGRAM_USERNAME=meu_usuario" > .env
echo "INSTAGRAM_PASSWORD=minha_senha" >> .env

# Executar
neo auth login
# Login automático acontece!
```

### Docker Compose

```yaml
# docker-compose.yml
services:
  neo-ig-cli:
    env_file:
      - .env  # Lê INSTAGRAM_USERNAME e INSTAGRAM_PASSWORD
```

### Script de Deploy

```bash
#!/bin/bash
# deploy.sh

export INSTAGRAM_USERNAME="${INSTAGRAM_USERNAME}"
export INSTAGRAM_PASSWORD="${INSTAGRAM_PASSWORD}"

docker-compose up -d
```

### Railway (via CLI)

```bash
railway variables set INSTAGRAM_USERNAME=seu_usuario
railway variables set INSTAGRAM_PASSWORD=sua_senha --secret
```

## Troubleshooting

### Login não está acontecendo automaticamente

**Verifique:**
1. As variáveis estão definidas?
   ```bash
   echo $INSTAGRAM_USERNAME
   echo $INSTAGRAM_PASSWORD
   ```

2. O arquivo `.env` está no lugar certo?
   - Deve estar na raiz do projeto
   - Mesmo diretório do `package.json`

3. Docker está lendo o `.env`?
   ```bash
   docker-compose config  # Mostra variáveis que serão usadas
   ```

### Erro de permissão

```bash
# Ajustar permissões do .env
chmod 600 .env
```

### Variáveis não aparecem no container

```bash
# Verificar variáveis no container
docker-compose exec neo-ig-cli env | grep INSTAGRAM
```

## Fallback

Se o login automático falhar por qualquer motivo (2FA, challenge, credenciais incorretas), o sistema automaticamente cai para o modo de login manual, permitindo que você insira as credenciais interativamente.

## Próximos Passos

Após o login automático bem-sucedido:
- A sessão é salva automaticamente
- Próximos logins usarão a sessão salva (mais rápido)
- Você pode usar outros comandos normalmente: `neo feed`, `neo chat`, etc.

