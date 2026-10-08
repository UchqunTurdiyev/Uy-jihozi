type Button = { text: string; url: string };

export const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export async function sendTelegram(text: string, button?: Button) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn("[Telegram] bot token yoki chat ID yo'q");
    return false;
  }

  const send = async (withButton: boolean) => {
    const payload: Record<string, unknown> = {
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    };
    if (withButton && button) payload.reply_markup = { inline_keyboard: [[button]] };
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    return res.ok;
  };

  try {
    // Tugma (masalan localhost manzilda) rad etilsa — tugmasiz qayta yuboriladi
    return (await send(true)) || (await send(false));
  } catch (e) {
    console.error("[Telegram] xato:", e);
    return false;
  }
}
