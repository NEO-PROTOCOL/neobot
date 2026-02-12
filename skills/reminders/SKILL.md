---
name: reminders
description: Sistema de lembretes pessoais via Telegram
---

# Reminders Skill

Sistema simplificado para criar lembretes pessoais que serão enviados via Telegram.

## Uso

```bash
pnpm tsx skills/reminders/remind.ts "texto do lembrete" "quando"
```

## Exemplos

### Lembrete em 30 minutos
```bash
pnpm tsx skills/reminders/remind.ts "Ir à academia" "in 30 minutes"
```

### Lembrete amanhã às 9h
```bash
pnpm tsx skills/reminders/remind.ts "Reunião importante" "tomorrow at 9am"
```

### Lembrete diário (cron)
```bash
pnpm tsx skills/reminders/remind.ts "Tomar vitamina" "0 8 * * *"
```

### Lembrete em português
```bash
pnpm tsx skills/reminders/remind.ts "Ligar para mãe" "em 2 horas"
```

## Configuração

O sistema usa automaticamente seu Chat ID configurado em:
- Variável de ambiente: `MY_TELEGRAM_CHAT_ID`
- Fallback: `[CHAT_ID]` (seu ID padrão)

## Formatos de Tempo Aceitos

- `"in X minutes"` - Daqui a X minutos
- `"in X hours"` - Daqui a X horas
- `"in X days"` - Daqui a X dias
- `"em X minutos"` - Português também funciona
- `"tomorrow at HH:mm"` - Amanhã em horário específico
- `"0 9 * * *"` - Expressão cron (todo dia às 9h)

## Como Funciona

1. Você cria um lembrete com texto e horário
2. O sistema agenda a tarefa no cron
3. No horário marcado, você recebe uma mensagem no Telegram
4. A mensagem vem com o emoji 🔔 e o texto que você definiu
