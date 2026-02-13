# 📱 Guia Completo de Comandos - Instagram CLI

## 🎯 Visão Geral

O **Instagram CLI** é uma ferramenta poderosa para acessar o Instagram diretamente do terminal, eliminando distrações e permitindo navegação 100% por teclado. Perfeito para estudantes e profissionais que querem maximizar produtividade.

> ⚠️ **Aviso Importante**: Este projeto não é afiliado ao Instagram/Meta e pode violar seus termos de serviço. Use por sua conta e risco.

---

## 🚀 Instalação e Configuração

### Instalação Rápida

#### NPM Global (Recomendado)
```bash
npm install -g @i7m/instagram-cli
```

### Primeiro Uso
```bash
# Ver comandos disponíveis
instagram-cli --help

# Login no Instagram
instagram-cli auth login

# Verificar se está logado
instagram-cli auth whoami
```

---

## 📋 Comandos Principais

### 🔐 Autenticação e Sistema de Contas

**🔐 Login:**
- **Comando:** `instagram-cli auth login`
- **Descrição:** Fazer login no Instagram
- **Exemplo:** `instagram-cli auth login`

**🚪 Logout:**
- **Comando:** `instagram-cli auth logout`
- **Descrição:** Fazer logout e remover sessão
- **Exemplo:** `instagram-cli auth logout`

**🔄 Trocar Conta:**
- **Comando:** `instagram-cli auth switch <username>`
- **Descrição:** Trocar entre contas salvas
- **Exemplo:** `instagram-cli auth switch usuario2`

**👤 Conta Atual:**
- **Comando:** `instagram-cli auth whoami`
- **Descrição:** Ver conta atual logada
- **Exemplo:** `instagram-cli auth whoami`

#### 📋 **Como Funciona o Sistema de Contas:**

- **Multi-contas:** Você pode salvar várias contas Instagram
- **Conta ativa:** Sempre há uma conta "ativa" sendo usada
- **Whoami:** Mostra a conta atual com @ (ex: `@neoflowoff.eth`)
- **Switch:** Troca entre contas já salvas
- **Login:** Adiciona nova conta ao sistema

#### ⚠️ **Regras Importantes:**

- Use **SEM @** nos comandos de chat (`-u usuario`)
- Use **COM @** apenas no login e whoami
- Chat sempre usa sua **conta ativa** para falar com outros usuários

### 📱 Conteúdo Principal (APENAS VISUALIZAÇÃO)

> ⚠️ **IMPORTANTE:** O Instagram CLI atualmente **SÓ permite visualizar conteúdo**, não criar posts!

**📄 Feed:**
- **Comando:** `instagram-cli feed`
- **Descrição:** Ver posts do seu feed
- **Exemplo:** `instagram-cli feed`

**📖 Stories:**
- **Comando:** `instagram-cli stories`
- **Descrição:** Ver stories (BETA)
- **Exemplo:** `instagram-cli stories`

**💬 Chat:**
- **Comando:** `instagram-cli chat [username]`
- **Descrição:** Abrir interface de chat
- **Exemplo:** `instagram-cli chat usuario`

**🔔 Notificações:**
- **Comando:** `instagram-cli notify [username]`
- **Descrição:** Ver notificações/inbox
- **Exemplo:** `instagram-cli notify`

### ⚙️ Configuração e Utilitários

**⚙️ Configurações:**
- **Comando:** `instagram-cli config`
- **Descrição:** Listar todas configurações
- **Exemplo:** `instagram-cli config`

**🔧 Definir Config:**
- **Comando:** `instagram-cli config <key> <value>`
- **Descrição:** Definir configuração
- **Exemplo:** `instagram-cli config image.protocol ascii`

**🧹 Limpeza:**
- **Comando:** `instagram-cli cleanup [type]`
- **Descrição:** Limpar cache/sessões/logs
- **Exemplo:** `instagram-cli cleanup all`

### 🆘 Ajuda
| Comando | Descrição |
|---------|-----------|
| `instagram-cli --help` | Ver todos os comandos disponíveis |
| `instagram-cli help <comando>` | Ajuda específica de um comando |

#### 📝 **Referência Rápida: @ ou sem @ ?**

**👤 Whoami:**
- **Comando:** `auth whoami`
- **Usa @:** ✅ **SIM**
- **Exemplo Correto:** Mostra: `@usuario`
- **Exemplo Errado:** -

**🔐 Login:**
- **Comando:** `auth login`
- **Usa @:** ✅ **SIM**
- **Exemplo Correto:** Login pede username
- **Exemplo Errado:** -

**💬 Chat:**

- **Comando:** `chat -u`
- **Usa @:** ❌ **NÃO**
- **Exemplo Correto:** `chat -u usuario`
- **Exemplo Errado:** `chat -u @usuario`

**📄 Feed:**

- **Comando:** `feed`
- **Usa @:** ❌ **NÃO**
- **Exemplo Correto:** `feed`
- **Exemplo Errado:** -

**📖 Stories:**

- **Comando:** `stories`
- **Usa @:** ❌ **NÃO**
- **Exemplo Correto:** `stories`
- **Exemplo Errado:** -

---

## ❌ FUNCIONALIDADES NÃO DISPONÍVEIS

### 🚫 **Não é possível:**

- **Postar fotos/vídeos no feed** - Apenas visualização
- **Criar stories** - Apenas visualização
- **Criar reels** - Apenas visualização
- **Editar perfil** - Apenas visualização
- **Seguir/deixar de seguir** - Apenas visualização
- **Curtir posts** - Apenas visualização

### ✅ **Apenas disponível:**

- **Visualizar feed** (`instagram-cli feed`)
- **Visualizar stories** (`instagram-cli stories`)
- **Conversar no chat** (`instagram-cli chat usuario`)
- **Ver notificações** (`instagram-cli notify`)
- **Enviar arquivos no chat** (`:upload` dentro do chat)

### 💡 **Alternativas para Postar Conteúdo:**

**🌐 Web:**

- Acesse: https://www.instagram.com
- Faça upload normalmente pelo navegador

**📱 App Oficial:**

- Use o app do Instagram no celular
- Todas as funcionalidades de criação disponíveis

**🤖 Para Multiagente - Possibilidades:**

#### **Opção 1: Usar API Direta do Instagram**

```python
# Exemplo com instagram-private-api
from instagram_private_api import Client

cl = Client(username, password)
cl.photo_upload('imagem.jpg', caption='Post automático!')
```

#### **Opção 2: Comando CLI Já Implementado! ✅**

```bash
# Comando já criado e compilado no projeto!
./dist/cli.js post photo imagem.jpg --caption "Legenda da foto"

# Exemplos práticos:
./dist/cli.js post photo minha_foto.jpg --caption "Post gerado por IA! 🤖"
./dist/cli.js post photo /caminho/para/imagem.png -c "Conteúdo incrível"
./dist/cli.js post photo arte.png --caption "Arte digital #AI #Arte"
```

**Como usar:**

1. Certifique-se de estar logado: `./dist/cli.js auth whoami`
2. Execute o comando: `./dist/cli.js post photo <arquivo> --caption "<legenda>"`
3. O post será publicado no seu feed!

**Nota:** Vídeos serão implementados em breve. Por enquanto, apenas fotos.

#### **Opção 3: Usar Webhooks/Browser Automation**

- Selenium ou Puppeteer para automatizar Instagram Web
- Mais lento mas mais compatível

### 🚀 **Para Agentes de IA/Multiagente:**

#### **Cenário Atual:**

- ✅ **Ler feed:** `instagram-cli feed`
- ✅ **Ver stories:** `instagram-cli stories`
- ✅ **Chat:** `instagram-cli chat usuario`
- ❌ **Postar conteúdo:** Não disponível

#### **Como Implementar Postagem:**

**1. API Direta (Recomendado):**
```python
import asyncio
from instagram_private_api import Client

async def post_content(image_path, caption):
    cl = Client(username, password)
    await cl.photo_upload(image_path, caption)

# Para agente usar:
await post_content("minha_foto.jpg", "Post gerado por IA!")
```

**2. Extensão do CLI:**

```typescript
// Adicionar em source/commands/post.tsx
export default function Post({args, options}) {
    // Implementar lógica de post
}
```

**🤖 Futuro:**

- Postar pelo CLI pode ser adicionado em versões futuras
- Contribua no [GitHub](https://github.com/supreme-gg-gg/instagram-cli) se interessado!

---

## 💬 Sistema de Chat (Funcionalidades Avançadas)

### Iniciando Chat

#### 📋 **Como Funciona:**

- **Conta ativa:** Você sempre conversa usando sua conta atual (veja `instagram-cli auth whoami`)
- **Usuário alvo:** A pessoa com quem você quer conversar (digite apenas o username, sem @)
- **Busca:** O sistema busca por username OU título da conversa

#### ✅ **Formas Corretas:**

```bash
# Abrir lista de conversas existentes
instagram-cli chat

# Conversar com usuário específico (SOMENTE username, sem @)
instagram-cli chat -u usuario_alvo

# Buscar conversa por título
instagram-cli chat -t "título da conversa"
```

#### ❌ **ERROS COMUNS:**

```bash
# NÃO use ambas as flags juntas
instagram-cli chat -u usuario -t "titulo"  # ❌ ERRO

# NÃO use @ no username
instagram-cli chat -u @usuario  # ❌ Use apenas "usuario"

# NÃO use <> (confunde o terminal)
instagram-cli chat -u <usuario>  # ❌ Use apenas -u usuario
```

### 🛠️ Comandos Dentro do Chat

#### Seleção de Mensagens

**🎯 Selecionar:**

- **Comando:** `:select`
- **Descrição:** Entrar no modo de seleção de mensagens

**😊 Reagir:**

- **Comando:** `:react <emoji \| :emoji_name:>`
- **Descrição:** Reagir a mensagem selecionada

**💬 Responder:**

- **Comando:** `:reply <text>`
- **Descrição:** Responder à mensagem selecionada

**🗑️ Apagar:**

- **Comando:** `:unsend`
- **Descrição:** Apagar mensagem selecionada

#### Upload e Mídia (APENAS NO CHAT)

**📎 Enviar Arquivo:**

- **Comando:** `:upload <path>`
- **Descrição:** Enviar imagem/vídeo **no chat** (não posta no feed!)
- **Exemplo:** `:upload /caminho/para/foto.jpg`

#### Navegação Avançada

**⬆️ Cima:**

- **Comando:** `:k`
- **Descrição:** Rolar para cima (75% da tela)

**⬆️⬆️ Início:**

- **Comando:** `:K`
- **Descrição:** Ir para o início das mensagens

**⬇️ Baixo:**

- **Comando:** `:j`
- **Descrição:** Rolar para baixo (75% da tela)

**⬇️⬇️ Final:**

- **Comando:** `:J`
- **Descrição:** Ir para o final das mensagens

**❓ Ajuda:**

- **Comando:** `:help`
- **Descrição:** Mostrar comandos disponíveis

#### Emojis e Texto Rico

```bash
# Emojis por nome
:thumbsup: 👍
:heart: ❤️
:laughing: 😂

# Navegação por teclado (Vim-style)
j = baixo
k = cima
Enter = confirmar
Esc = cancelar/voltar
```

#### Inclusão de Arquivos

```bash
# Incluir arquivos na mensagem
#caminho/para/arquivo.txt
#caminho/para/imagem.png

# Use tab para autocompletar caminhos
```

---

## ⚙️ Configurações Avançadas

### Protocolos de Imagem

**🟦 HalfBlock:**

- **Protocolo:** `"halfBlock"`
- **Descrição:** Padrão, boa qualidade
- **Recomendado para:** Terminais modernos

**🔤 ASCII:**

- **Protocolo:** `"ascii"`
- **Descrição:** Texto puro
- **Recomendado para:** Terminais antigos

**⠋ Braille:**

- **Protocolo:** `"braille"`
- **Descrição:** Alta resolução
- **Recomendado para:** Terminais com suporte

**🐱 Kitty:**

- **Protocolo:** `"kitty"`
- **Descrição:** Protocolo Kitty
- **Recomendado para:** Terminal Kitty

**🍎 iTerm2:**

- **Protocolo:** `"iterm2"`
- **Descrição:** Protocolo iTerm2
- **Recomendado para:** iTerm2

**📺 SIXEL:**

- **Protocolo:** `"sixel"`
- **Descrição:** Protocolo SIXEL
- **Recomendado para:** Terminais com suporte

```bash
# Ver configuração atual
instagram-cli config

# Alterar protocolo
instagram-cli config image.protocol Kitty
```

### Layout do Feed

```bash
# Ver layout atual
instagram-cli config feed.feedType

# Alterar layout
instagram-cli config feed.feedType timeline  # ou "list"
```

### Arquivo de Configuração

Localização: `~/.instagram-cli/config.ts.yaml`

```yaml
image:
  protocol: "halfBlock"
feed:
  feedType: "list"
```

---

## 🧹 Limpeza e Manutenção

### Tipos de Limpeza

```bash
# Limpar tudo
instagram-cli cleanup all

# Limpar apenas sessões
instagram-cli cleanup sessions

# Limpar apenas cache
instagram-cli cleanup cache

# Limpar apenas logs
instagram-cli cleanup logs
```

---

## 🌟 Recursos Especiais

### 🎨 Interface Visual

- **React-based UI** com Ink framework
- **Navegação 100% teclado** (sem mouse!)
- **Renderização de imagens** no terminal
- **Protocolo MQTT** para mensagens em tempo real
- **Suporte multiplataforma** (Windows, Linux, macOS)

### 🚀 Performance

- **Mais rápido** que navegador ou app mobile
- **Menos distrações** - foco total na conversa
- **VSCode Integrated Terminal** compatível
- **Consumo mínimo** de recursos

### 🔒 Segurança

- Credenciais salvas **localmente**
- Sem dados enviados para servidores externos
- Logs locais para debugging
- Suporte a múltiplas contas

---

## 📚 Exemplos Práticos (Para Estudantes de Marketing)

### 1. Monitoramento de Marca

```bash
# Ver notificações e interações
instagram-cli notify

# Acompanhar menções
instagram-cli chat cliente_importante
```

### 2. Gestão de Conteúdo

```bash
# Ver performance do feed
instagram-cli feed

# Responder rapidamente a stories
instagram-cli stories
```

### 3. Comunicação Eficiente

```bash
# Chat com equipe
instagram-cli chat colega_marketing

# Enviar materiais
:upload /projetos/campanha_natal.pdf
```

### 4. Produtividade Máxima

```bash
# Sem distrações visuais
# Navegação por teclado
# Respostas rápidas
# Foco no conteúdo
```

### 5. Cenário Real - Multi-contas

```bash
# Cenário: Você tem @neoflowoff.eth e quer falar com ju.tattoo

# 1. Verificar conta atual
instagram-cli auth whoami
# → Currently active account: @neoflowoff.eth

# 2. Conversar usando sua conta atual
instagram-cli chat -u ju.tattoo

# 3. Se quiser usar outra conta (se existir)
instagram-cli auth switch outra_conta
instagram-cli chat -u outra conta
```

---

## 🐛 Troubleshooting

### Problemas Comuns

**"Comando não encontrado"**

```bash
# Instalar novamente
npm install -g @i7m/instagram-cli
```

**"Problemas com imagens"**
```bash
# Alterar protocolo de imagem
instagram-cli config image.protocol ascii
```

**"Login falhando"**

- Verificar credenciais
- Tentar novamente
- Verificar logs: `~/.instagram-cli/logs/`

**"Cannot use both --title and --username flags simultaneously"**

- Use apenas `-u` OU apenas `-t`, não ambos juntos
- Correto: `instagram-cli chat -u usuario`
- Errado: `instagram-cli chat -u usuario -t "titulo"`

**"No session found for [usuario]"**

- Você está tentando usar uma conta que não existe
- Verifique se fez login com essa conta primeiro
- Use `instagram-cli auth whoami` para ver contas disponíveis

**Erro de sintaxe `<>` no terminal**

- Não use `<>` nos comandos (confunde o zsh/bash)
- Correto: `instagram-cli chat -u usuario`
- Errado: `instagram-cli chat -u <usuario>`

### Logs de Debug

```bash
# Ver logs recentes
tail -f ~/.instagram-cli/logs/*.log
```

---

## 🎯 Dicas para Marketing Students

1. **Use para monitorar campanhas** - Verifique engajamento rapidamente
2. **Mantenha foco** - Sem distrações visuais do Instagram
3. **Responda rapidamente** - Navegação por teclado é mais eficiente
4. **Gerencie múltiplas contas** - Perfeito para agências
5. **Integre no workflow** - Use no VSCode durante trabalho

### Atalhos Essenciais

- `instagram-cli chat` - Comunicação direta
- `instagram-cli notify` - Acompanhar interações
- `instagram-cli feed` - Ver conteúdo da marca
- `:upload` - Compartilhar materiais
- `:j/:k` - Navegação rápida

---

**🎉 Pronto para ser mais produtivo no Instagram! Use `instagram-cli --help` para começar.**
