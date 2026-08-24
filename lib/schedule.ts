/**
 * Class schedule rules — shared by the enquiry form and the API route so the
 * browser and the server can never disagree about what is bookable.
 */

export const WEEKDAY_SLOTS = [
  "5:30 AM",
  "6:30 AM",
  "7:30 AM",
  "8:30 AM",
  "5:00 PM",
  "6:00 PM",
] as const;

export const SATURDAY_SLOTS = ["7:30 AM"] as const;

export type DayType = "weekday" | "saturday" | "sunday";

/** Today in IST as YYYY-MM-DD. en-CA formats as ISO, which <input type="date"> wants. */
export function todayInIST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

export function getDayType(dateStr: string): DayType | null {
  if (!dateStr) return null;
  // Append T00:00:00 so JS parses it in local time, not UTC
  const day = new Date(dateStr + "T00:00:00").getDay(); // 0=Sun, 6=Sat
  if (Number.isNaN(day)) return null;
  if (day === 0) return "sunday";
  if (day === 6) return "saturday";
  return "weekday";
}

export function slotsFor(dayType: DayType | null): readonly string[] {
  if (dayType === "weekday") return WEEKDAY_SLOTS;
  if (dayType === "saturday") return SATURDAY_SLOTS;
  return [];
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
