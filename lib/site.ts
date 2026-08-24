/**
 * Single source of truth for the studio's contact details.
 *
 * To point the site at a different number (e.g. for testing), create a
 * `.env.local` file in the project root:
 *
 *     NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210
 *
 * Use the full international number, digits only, no "+" or spaces.
 * `.env.local` is gitignored, so a test number can never be committed.
 * Restart `npm run dev` after changing it — Next inlines env vars at build time.
 *
 * With no env var set, it falls back to the studio's real number below.
 */

const FALLBACK_NUMBER = "919553809135";

const digits =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.replace(/\D/g, "") || FALLBACK_NUMBER;

/** "919553809135" -> "+91 95538 09135" */
function formatIndianPhone(value: string): string {
  const local = value.startsWith("91") ? value.slice(2) : value;
  return local.length === 10
    ? `+91 ${local.slice(0, 5)} ${local.slice(5)}`
    : `+${value}`;
}

export const site = {
  name: "Arambha Yoga & Wellness",

  /** Digits only, for wa.me links. */
  whatsappNumber: digits,
  /** Human-readable, e.g. "+91 95538 09135". */
  phoneDisplay: formatIndianPhone(digits),
  /** For tel: links. */
  phoneHref: `tel:+${digits}`,
  /** Opens a WhatsApp chat with the studio. */
  whatsappHref: `https://wa.me/${digits}`,


  instagramHandle: "@arambha.yoga",
  instagramUrl: "https://www.instagram.com/arambha.yoga",
} as const;
