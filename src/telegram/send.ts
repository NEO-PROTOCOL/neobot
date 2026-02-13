export async function sendMessageTelegram(_to: string, _content: string, _opts?: any) {
  return { messageId: 0, chatId: "" };
}
export async function deleteMessageTelegram(_chatId: string | number, _messageId: number, _opts?: any) {}
export async function editMessageTelegram(_chatId: string | number, _messageId: number, _content: string, _opts?: any) {
  return { messageId: 0, chatId: "" };
}
export async function reactMessageTelegram(_chatId: string | number, _messageId: number, _emoji: string, _opts?: any) {
  return { ok: true };
}
export async function sendStickerTelegram(_to: string, _fileId: string, _opts?: any) {
  return { messageId: 0, chatId: "" };
}
