/**
 * Promotion rules shared by the public site, the admin dashboard and the
 * server actions. Nothing here touches the database, so it is safe to import
 * from client components — the form validates with the same rules the server
 * enforces.
 */

export const TAG_COLORS = {
  sage: { label: "Sage", className: "bg-sage text-white" },
  earth: { label: "Earth", className: "bg-earth text-white" },
  forest: { label: "Forest", className: "bg-forest text-white" },
  amber: { label: "Amber", className: "bg-amber-500 text-white" },
} as const;

export type TagColor = keyof typeof TAG_COLORS;

export function tagClass(color: string): string {
  return (TAG_COLORS[color as TagColor] ?? TAG_COLORS.sage).className;
}

/** What the public card needs. */
export type PromotionCardData = {
  tag: string;
  tagColor: string;
  title: string;
  description: string;
  dateText: string;
  timeText: string;
  icon: string;
  highlight: boolean;
};

/** What the admin form edits. */
export type PromotionInput = PromotionCardData & {
  published: boolean;
  startsOn: string; // "" or YYYY-MM-DD
  endsOn: string; // "" or YYYY-MM-DD
};

export const EMPTY_PROMOTION: PromotionInput = {
  tag: "",
  tagColor: "sage",
  title: "",
  description: "",
  dateText: "",
  timeText: "",
  icon: "",
  highlight: false,
  published: true,
  startsOn: "",
  endsOn: "",
};

export const LIMITS = {
  tag: 24,
  title: 80,
  description: 240,
  dateText: 60,
  timeText: 60,
  icon: 8,
} as const;

export type ValidationResult =
  | { ok: true; data: PromotionInput }
  | { ok: false; errors: Partial<Record<keyof PromotionInput, string>> };

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Accepts untrusted input (a server action argument) and normalises it. */
export function validatePromotion(raw: unknown): ValidationResult {
  const obj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const str = (key: string) =>
    typeof obj[key] === "string" ? (obj[key] as string).trim() : "";

  const data: PromotionInput = {
    tag: str("tag"),
    tagColor: str("tagColor"),
    title: str("title"),
    description: str("description"),
    dateText: str("dateText"),
    timeText: str("timeText"),
    icon: str("icon"),
    highlight: obj.highlight === true,
    published: obj.published === true,
    startsOn: str("startsOn"),
    endsOn: str("endsOn"),
  };

  const errors: Partial<Record<keyof PromotionInput, string>> = {};
  const required: (keyof typeof LIMITS)[] = ["tag", "title", "description", "dateText", "timeText"];
  for (const key of required) {
    if (!data[key]) errors[key] = "Required";
  }
  for (const key of Object.keys(LIMITS) as (keyof typeof LIMITS)[]) {
    if (data[key].length > LIMITS[key]) errors[key] = `Keep it under ${LIMITS[key]} characters`;
  }
  if (!(data.tagColor in TAG_COLORS)) errors.tagColor = "Pick a colour";
  if (data.startsOn && !ISO_DATE.test(data.startsOn)) errors.startsOn = "Invalid date";
  if (data.endsOn && !ISO_DATE.test(data.endsOn)) errors.endsOn = "Invalid date";
  if (data.startsOn && data.endsOn && data.endsOn < data.startsOn) {
    errors.endsOn = "Must be on or after the start date";
  }

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

export type PromotionStatus = "draft" | "scheduled" | "live" | "expired";

/** `today` is YYYY-MM-DD in IST; plain string comparison works for ISO dates. */
export function promotionStatus(
  p: { published: boolean; startsOn: string | null; endsOn: string | null },
  today: string
): PromotionStatus {
  if (!p.published) return "draft";
  if (p.startsOn && p.startsOn > today) return "scheduled";
  if (p.endsOn && p.endsOn < today) return "expired";
  return "live";
}
