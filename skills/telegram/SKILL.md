---
name: telegram
description: Send and receive messages on Telegram.
---

# Telegram Skill

Use this skill to interact with Telegram.

## Tools

### `telegram_send`

Sends a message to a user or chat.

**Parameters:**
- `to` (string): The chat ID or @username.
- `message` (string): The message text.

**Usage:**
```bash
node skills/telegram/scripts/telegram.sh --to @anacarolinamaia --message "Olá!"
```
