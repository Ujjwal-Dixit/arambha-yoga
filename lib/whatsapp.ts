/**
 * Sends the studio a WhatsApp notification via Meta's Cloud API.
 *
 * Required environment variables (server-side only — never NEXT_PUBLIC_*):
 *
 *   WHATSAPP_TOKEN            Permanent access token from Meta
 *   WHATSAPP_PHONE_NUMBER_ID  The sender number's ID (not the number itself)
 *   WHATSAPP_TO               Recipient, digits only, e.g. 919553809135
 *   WHATSAPP_TEMPLATE         Approved template name (default: new_enquiry)
 *   WHATSAPP_TEMPLATE_LANG    Template language code (default: en)
 *
 * The template must take FIVE body variables, in this order:
 *   {{1}} name   {{2}} class   {{3}} preferred date/time   {{4}} phone   {{5}} note
 *
 * Meta rejects template parameters containing newlines, tabs, or empty
 * strings — so each value is sanitised to a single line and blanks become "—".
 */

const GRAPH_VERSION = "v21.0";

export type EnquiryPayload = {
  name: string;
  phone: string;
  service: string;
  preferred: string;
  message: string;
};

/** Collapses whitespace and substitutes a dash for blanks. */
function param(value: string): string {
  const clean = value.replace(/\s+/g, " ").trim();
  return clean.length ? clean.slice(0, 900) : "—";
}

export type SendResult =
  | { ok: true; skipped?: false }
  | { ok: true; skipped: true; preview: string }
  | { ok: false; error: string };

export async function sendEnquiryToStudio(
  enquiry: EnquiryPayload
): Promise<SendResult> {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const to = process.env.WHATSAPP_TO?.replace(/\D/g, "");
  const template = process.env.WHATSAPP_TEMPLATE || "new_enquiry";
  const lang = process.env.WHATSAPP_TEMPLATE_LANG || "en";

  const values = [
    param(enquiry.name),
    param(enquiry.service),
    param(enquiry.preferred),
    param(enquiry.phone),
    param(enquiry.message),
  ];

  // Until Meta credentials exist, log what *would* be sent so the whole
  // user-facing flow can still be exercised end to end locally.
  if (!token || !phoneNumberId || !to) {
    const preview = [
      "New website enquiry",
      `Name: ${values[0]}`,
      `Class: ${values[1]}`,
      `Preferred: ${values[2]}`,
      `Phone: ${values[3]}`,
      `Note: ${values[4]}`,
    ].join("\n");
    console.warn(
      "[whatsapp] credentials not configured — enquiry NOT sent:\n" + preview
    );
    return { ok: true, skipped: true, preview };
  }

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "template",
          template: {
            name: template,
            language: { code: lang },
            components: [
              {
                type: "body",
                parameters: values.map((text) => ({ type: "text", text })),
              },
            ],
          },
        }),
      }
    );

    if (!res.ok) {
      const detail = await res.text();
      console.error(`[whatsapp] send failed ${res.status}: ${detail}`);
      return { ok: false, error: `WhatsApp API returned ${res.status}` };
    }

    return { ok: true };
  } catch (err) {
    console.error("[whatsapp] send threw:", err);
    return { ok: false, error: "Could not reach the WhatsApp API" };
  }
}
