/**
 * Sends the studio a Telegram message for each website enquiry, via the
 * Telegram Bot API.
 *
 * Required environment variables (server-side only — never NEXT_PUBLIC_*):
 *
 *   TELEGRAM_BOT_TOKEN   Token from @BotFather, e.g. 123456:ABC-DEF...
 *   TELEGRAM_CHAT_ID     Chat that receives enquiries (a user, group or channel)
 *
 * The bot can only message a chat that has started a conversation with it
 * (or, for a group, that it has been added to).
 */

export type EnquiryPayload = {
  name: string;
  phone: string;
  service: string;
  preferred: string;
  message: string;
};

export type SendResult =
  | { ok: true; skipped?: false }
  | { ok: true; skipped: true; preview: string }
  | { ok: false; error: string };

/** Messages are sent as HTML, so user input must not be able to inject tags. */
function escape(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function line(label: string, value: string): string {
  const clean = value.trim();
  return `<b>${label}:</b> ${clean ? escape(clean) : "—"}`;
}

export async function sendEnquiryToStudio(
  enquiry: EnquiryPayload
): Promise<SendResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  const text = [
    "🧘 <b>New website enquiry</b>",
    "",
    line("Name", enquiry.name),
    line("Phone", enquiry.phone),
    line("Class", enquiry.service),
    line("Preferred", enquiry.preferred),
    line("Message", enquiry.message),
  ].join("\n");

  // Without credentials, log what *would* be sent so the whole user-facing
  // flow can still be exercised end to end locally.
  if (!token || !chatId) {
    console.warn(
      "[telegram] credentials not configured — enquiry NOT sent:\n" + text
    );
    return { ok: true, skipped: true, preview: text };
  }

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      // Telegram's error body names the problem (bad token, unknown chat, …)
      // and never echoes the token, so it is safe to log.
      const detail = await res.text();
      console.error(`[telegram] send failed ${res.status}: ${detail}`);
      return { ok: false, error: `Telegram API returned ${res.status}` };
    }

    return { ok: true };
  } catch (err) {
    console.error("[telegram] send threw:", err);
    return { ok: false, error: "Could not reach the Telegram API" };
  }
}
