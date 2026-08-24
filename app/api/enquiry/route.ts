import { NextResponse } from "next/server";
import { sendEnquiryToStudio } from "@/lib/whatsapp";
import { formatDate, getDayType, slotsFor, todayInIST } from "@/lib/schedule";

export const runtime = "nodejs";

/**
 * Naive per-IP throttle. In-memory, so it resets on redeploy and is per
 * instance — enough to blunt casual abuse, not a real rate limiter. Swap for a
 * shared store once the database lands.
 */
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // crude guard against unbounded growth
  return recent.length > MAX_PER_WINDOW;
}

function bad(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return bad("Too many enquiries — please try again in a minute.", 429);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return bad("Invalid request.");
  }

  const str = (key: string) =>
    typeof body[key] === "string" ? (body[key] as string).trim() : "";

  // Honeypot: a real person never fills a field they cannot see. Return success
  // so bots get no signal that they were caught.
  if (str("website")) return NextResponse.json({ ok: true });

  const name = str("name");
  const phone = str("phone");
  const service = str("service");
  const date = str("date");
  const timeSlot = str("timeSlot");
  const message = str("message");

  if (name.length < 2 || name.length > 80) {
    return bad("Please enter your name.");
  }
  if (phone && !/^[+\d][\d\s()-]{6,19}$/.test(phone)) {
    return bad("That phone number doesn't look right.");
  }
  if (message.length > 500) {
    return bad("Please keep your message under 500 characters.");
  }

  // Re-check the schedule rules server-side: the browser version is a
  // convenience, not a guarantee.
  let preferred = "Not specified";
  if (date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return bad("Invalid date.");
    if (date < todayInIST()) return bad("Please choose a date in the future.");

    const dayType = getDayType(date);
    if (!dayType) return bad("Invalid date.");
    if (dayType === "sunday") return bad("We don't run classes on Sundays.");
    if (timeSlot && !slotsFor(dayType).includes(timeSlot)) {
      return bad("That time slot isn't available on the date you picked.");
    }
    preferred = timeSlot ? `${formatDate(date)} — ${timeSlot}` : formatDate(date);
  }

  const result = await sendEnquiryToStudio({
    name,
    phone,
    service,
    preferred,
    message,
  });

  if (!result.ok) {
    // Surface the failure so the form can offer a direct WhatsApp fallback
    // rather than silently swallowing a lead.
    return NextResponse.json({ ok: false, error: result.error }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
