# Comandos Disponíveis - IG_CLI

## 📚 Instagrapi - Comandos Principais

### 🔐 Autenticação

- `login(username, password)` - Fazer login no Instagram
- `logout()` - Fazer logout
- `relogin()` - Fazer login novamente
- `pre_login_flow()` - Fluxo pré-login

### 👤 Conta

- `account_info()` - Informações da conta
- `account_edit(biography, ...)` - Editar perfil
- `account_change_picture(path)` - Alterar foto de perfil
- `account_set_private()` - Tornar conta privada
- `account_set_public()` - Tornar conta pública

### 📸 Mídia - Fotos

- `photo_upload(path, caption="", ...)` - Upload de foto
- `photo_download(media_pk, folder="")` - Download de foto
- `photo_delete(media_pk)` - Deletar foto

### 🎥 Mídia - Vídeos

- `video_upload(path, caption="", ...)` - Upload de vídeo
- `video_download(media_pk, folder="")` - Download de vídeo
- `video_delete(media_pk)` - Deletar vídeo

### 📚 Mídia - Álbuns

- `album_upload(paths, caption="", ...)` - Upload de álbum
- `album_download(media_pk, folder="")` - Download de álbum

### 🎬 Mídia - Reels/Clips

- `clip_upload(path, caption="", ...)` - Upload de reel/clip
- `clip_download(media_pk, folder="")` - Download de reel/clip

### 📺 Mídia - IGTV

- `igtv_upload(path, title="", caption="", ...)` - Upload de IGTV
- `igtv_download(media_pk, folder="")` - Download de IGTV

### 📱 Mídia - Stories

- `story_upload(path, ...)` - Upload de story
- `story_download(story_pk, filename="", folder="")` - Download de story
- `story_delete(story_pk)` - Deletar story
- `story_seen(story_pks)` - Marcar story como visto

### 📊 Mídia - Geral

- `media_info(media_pk)` - Informações da mídia
- `media_like(media_pk)` - Curtir mídia
- `media_unlike(media_pk)` - Descurtir mídia
- `media_delete(media_pk)` - Deletar mídia
- `media_edit(media_pk, caption="", ...)` - Editar mídia
- `media_comment(media_pk, text)` - Comentar em mídia
- `media_comments(media_pk, amount=...)` - Listar comentários
- `media_likers(media_pk)` - Listar quem curtiu

### 👥 Usuários

- `user_info(username)` - Informações do usuário
- `user_followers(user_id, amount=...)` - Listar seguidores
- `user_following(user_id, amount=...)` - Listar seguindo
- `user_follow(user_id)` - Seguir usuário
- `user_unfollow(user_id)` - Deixar de seguir
- `user_feed(user_id, amount=...)` - Feed do usuário
- `user_stories(user_id)` - Stories do usuário

### #️⃣ Hashtags

- `hashtag_info(name)` - Informações da hashtag
- `hashtag_medias(name, amount=...)` - Mídias da hashtag
- `hashtag_follow(name)` - Seguir hashtag
- `hashtag_unfollow(name)` - Deixar de seguir hashtag

### 📍 Localização

- `location_info(location_pk)` - Informações da localização
- `location_medias(location_pk, amount=...)` - Mídias da localização

### 💬 Comentários

- `comment_like(comment_pk)` - Curtir comentário
- `comment_unlike(comment_pk)` - Descurtir comentário
- `comment_delete(comment_pk)` - Deletar comentário
- `comment_bulk_delete(comment_pks)` - Deletar múltiplos comentários

### 📨 Mensagens Diretas

- `direct_threads()` - Listar conversas
- `direct_thread(thread_id)` - Obter conversa
- `direct_send(user_ids, text)` - Enviar mensagem
- `direct_answer(thread_id, text)` - Responder mensagem

### 🔍 Busca

- `search_users(query)` - Buscar usuários
- `search_tags(query)` - Buscar hashtags
- `search_locations(query)` - Buscar localizações
- `fbsearch_places(query)` - Buscar lugares

### 📚 Coleções

- `collection_create(name)` - Criar coleção
- `collection_delete(collection_pk)` - Deletar coleção
- `collection_medias(collection_pk)` - Mídias da coleção
- `collection_add_media(collection_pk, media_pk)` - Adicionar mídia

---

## ⏰ Schedule - Comandos de Agendamento

### Agendamento Básico

```python
# A cada X segundos/minutos/horas/dias/semanas
schedule.every(10).seconds.do(funcao)
schedule.every(5).minutes.do(funcao)
schedule.every(2).hours.do(funcao)
schedule.every(1).days.do(funcao)
schedule.every(1).weeks.do(funcao)
```

### Agendamento com Horário Específico

```python
# Todo dia às 10:30
schedule.every().day.at("10:30").do(funcao)

# Toda hora aos 30 minutos
schedule.every().hour.at(":30").do(funcao)

# Todo minuto aos 30 segundos
schedule.every().minute.at(":30").do(funcao)
```

### Agendamento por Dia da Semana

```python
schedule.every().monday.do(funcao)
schedule.every().tuesday.do(funcao)
schedule.every().wednesday.do(funcao)
schedule.every().thursday.do(funcao)
schedule.every().friday.do(funcao)
schedule.every().saturday.do(funcao)
schedule.every().sunday.do(funcao)
```

### Intervalos Aleatórios

```python
# Entre 5 e 10 minutos (aleatório)
schedule.every(5).to(10).minutes.do(funcao)
```

### Execução

```python
# Executar tarefas pendentes
schedule.run_pending()

# Executar todas as tarefas
schedule.run_all()

# Loop principal
while True:
    schedule.run_pending()
    time.sleep(1)
```

### Gerenciamento

```python
# Listar todas as tarefas
schedule.get_jobs()

# Remover todas as tarefas
schedule.clear()

# Remover tarefa específica
schedule.cancel_job(job)

# Próxima execução
schedule.next_run

# Segundos até próxima execução
schedule.idle_seconds
```

### Tags

```python
# Adicionar tags
job = schedule.every().day.do(funcao)
job.tag('instagram', 'automacao')

# Filtrar por tag
schedule.get_jobs('instagram')

# Remover por tag
schedule.clear('instagram')
```

---

## 📝 Exemplo de Uso Combinado

```python
from instagrapi import Client
import schedule
import time

# Inicializar cliente
cl = Client()
cl.login("usuario", "senha")

# Função para postar foto
def postar_foto():
    cl.photo_upload("foto.jpg", caption="Post automático!")

# Agendar post diário às 10:00
schedule.every().day.at("10:00").do(postar_foto)

# Loop de execução
while True:
    schedule.run_pending()
    time.sleep(1)
```

---

**Total de métodos disponíveis no instagrapi: 380+*

Para ver todos os comandos disponíveis, execute:

```bash
python discover_commands.py
```

Author: MELLØ // NODE NEØ

