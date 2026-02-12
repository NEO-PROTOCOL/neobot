# WhatsApp test guide — NEØ / Moltbot

Quick steps to **test your registered WhatsApp** and see available features. Run these on your machine (gateway must be running).

---

## 1. Prerequisites

- WhatsApp already linked: `pnpm neobot channels login` (scan QR if needed).
- Gateway running: `pnpm neobot gateway --port 18789` (in a separate terminal).

---

## 2. Health and status

```bash
# Overall health (includes channel status)
pnpm neobot health

# Deeper channel probe (WhatsApp Web + others)
pnpm neobot status --deep
```

---

## 3. Send a test message to your WhatsApp

Replace `+55XXXXXXXXX` with your number (E.164, e.g. your registered WhatsApp).

```bash
# One channel (WhatsApp only): no --channel needed
pnpm neobot message send --target +55XXXXXXXXX --message "Test from NEØ — if you see this, WhatsApp is working."

# If you have multiple channels, specify WhatsApp
pnpm neobot message send --channel whatsapp --target +55XXXXXXXXX --message "Hello from NEØ."
```

---

## 4. Other message features (WhatsApp)

| Feature | Example |
|--------|---------|
| **Text** | `--message "Your text"` |
| **Media** | `--message "Caption" --media photo.jpg` |
| **Reply** | `--reply-to <message-id>` (from inbox) |
| **Reaction** | `pnpm neobot message react --channel whatsapp --target +55... --message-id <id> --emoji "✅"` |
| **GIF playback** | `--gif-playback` (when sending a GIF) |

---

## 5. NEØ protocol info (CLI)

```bash
pnpm neobot neo:info
```

---

## 6. Functionality overview (WhatsApp channel)

- **Inbox:** Gateway receives messages from WhatsApp (Baileys).
- **Routing:** Replies go back to WhatsApp; allowlist/pairing controls who can talk.
- **Send:** `message send` via CLI (or agent with `--deliver`).
- **Reactions:** `message react` (emoji on a message).
- **Media:** Send images/docs with `--media`.
- **Config:** Optional `/config set|unset` from chat if `configWrites` enabled.

Full reference: [docs/channels/whatsapp.md](channels/whatsapp.md).

---

## 7. Quick test checklist

1. [ ] Terminal 1: `pnpm neobot gateway --port 18789`
2. [ ] Terminal 2: `pnpm neobot health` → expect healthy.
3. [ ] Terminal 2: `pnpm neobot message send --channel whatsapp --target +55YOUR_NUMBER --message "NEØ test OK"`
4. [ ] Check your WhatsApp; you should receive the message.
5. [ ] Reply in WhatsApp; gateway should receive (check gateway logs or inbox if you have a UI).

If step 3 fails: ensure WhatsApp is linked (`channels login`), gateway is running, and `--target` is E.164 (e.g. `+5521999999999`).
