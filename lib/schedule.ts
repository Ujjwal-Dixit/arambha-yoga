/**
 * Class schedule rules — shared by the enquiry form, the API route and the
 * admin timetable editor so the browser and the server can never disagree
 * about what is bookable. The slots themselves live in the database
 * (class_slots) and are edited from the admin dashboard.
 */

export type DayType = "weekday" | "saturday" | "sunday";

export const DAY_TYPES: readonly DayType[] = ["weekday", "saturday", "sunday"];

export const DAY_LABELS: Record<DayType, string> = {
  weekday: "Monday – Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

/** Slot times per day type, 24-hour "HH:MM". An empty list means closed. */
export type Schedule = Record<DayType, string[]>;

/** Used when no database is configured, and as the seed timetable. */
export const DEFAULT_SCHEDULE: Schedule = {
  weekday: ["05:30", "06:30", "07:30", "08:30", "17:00", "18:00"],
  saturday: ["07:30"],
  sunday: [],
};

export const MAX_SLOTS_PER_DAY = 16;

const HH_MM = /^([01]\d|2[0-3]):[0-5]\d$/;

export function isValidTime(time: string): boolean {
  return HH_MM.test(time);
}

/** "06:30" → "6:30 AM". This label is what the form shows and submits. */
export function formatSlot(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const suffix = h < 12 ? "AM" : "PM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${suffix}`;
}

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

/** Display labels of the bookable slots for a day type. */
export function slotsFor(schedule: Schedule, dayType: DayType | null): string[] {
  return dayType ? schedule[dayType].map(formatSlot) : [];
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
