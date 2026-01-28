export async function sendTelegramNotification(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn(
      "⚠️ Notificação via Telegram ignorada: TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID ausentes no .env",
    );
    return;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "Markdown",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ Erro na API do Telegram:", errorData);
    } else {
      console.log("📨 Notificação enviada para o Telegram.");
    }
  } catch (error) {
    console.error("❌ Falha ao enviar notificação para o Telegram:", error);
  }
}
