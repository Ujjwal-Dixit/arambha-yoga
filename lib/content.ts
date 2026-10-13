/**
 * Rules for the content the dashboard manages besides promotions: offer
 * posters, gallery photos, reviews and the class timetable. Nothing here
 * touches the database, so the forms validate with exactly the rules the
 * server actions enforce.
 */

import {
  DAY_TYPES,
  MAX_SLOTS_PER_DAY,
  isValidTime,
  type Schedule,
} from "@/lib/schedule";

type Errors = Record<string, string>;

export type Validated<T> = { ok: true; data: T } | { ok: false; errors: Errors };

/** Reads untrusted input (a server action argument) as trimmed fields. */
function reader(raw: unknown) {
  const obj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    str: (key: string) => (typeof obj[key] === "string" ? (obj[key] as string).trim() : ""),
    bool: (key: string) => obj[key] === true,
    int: (key: string) =>
      typeof obj[key] === "number" && Number.isInteger(obj[key]) ? (obj[key] as number) : NaN,
  };
}

function result<T>(data: T, errors: Errors): Validated<T> {
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

function checkDateWindow(startsOn: string, endsOn: string, errors: Errors) {
  if (startsOn && !ISO_DATE.test(startsOn)) errors.startsOn = "Invalid date";
  if (endsOn && !ISO_DATE.test(endsOn)) errors.endsOn = "Invalid date";
  if (startsOn && endsOn && endsOn < startsOn) errors.endsOn = "Must be on or after the start date";
}

/** An uploaded image: its URL plus pixel size (measured in the browser). */
export type ImageFields = { imageUrl: string; width: number; height: number };

function checkImage(r: ReturnType<typeof reader>, errors: Errors): ImageFields {
  const image = { imageUrl: r.str("imageUrl"), width: r.int("width"), height: r.int("height") };
  const sane = (n: number) => n >= 1 && n <= 20000;
  if (!image.imageUrl || !sane(image.width) || !sane(image.height)) {
    errors.imageUrl = "Please upload an image";
  }
  return image;
}

/* Offer posters --------------------------------------------------------- */

export const POSTER_LIMITS = { alt: 200 } as const;

export type PosterInput = ImageFields & {
  alt: string;
  published: boolean;
  startsOn: string; // "" or YYYY-MM-DD
  endsOn: string;
};

export const EMPTY_POSTER: PosterInput = {
  imageUrl: "",
  width: 0,
  height: 0,
  alt: "",
  published: true,
  startsOn: "",
  endsOn: "",
};

export function validatePoster(raw: unknown): Validated<PosterInput> {
  const r = reader(raw);
  const errors: Errors = {};
  const data: PosterInput = {
    ...checkImage(r, errors),
    alt: r.str("alt"),
    published: r.bool("published"),
    startsOn: r.str("startsOn"),
    endsOn: r.str("endsOn"),
  };
  if (!data.alt) errors.alt = "Required — describe the offer in a sentence";
  else if (data.alt.length > POSTER_LIMITS.alt) errors.alt = `Keep it under ${POSTER_LIMITS.alt} characters`;
  checkDateWindow(data.startsOn, data.endsOn, errors);
  return result(data, errors);
}

/* Gallery --------------------------------------------------------------- */

export const GALLERY_LIMITS = { caption: 120 } as const;

export type GalleryInput = ImageFields & { caption: string; published: boolean };

export const EMPTY_GALLERY: GalleryInput = {
  imageUrl: "",
  width: 0,
  height: 0,
  caption: "",
  published: true,
};

export function validateGallery(raw: unknown): Validated<GalleryInput> {
  const r = reader(raw);
  const errors: Errors = {};
  const data: GalleryInput = {
    ...checkImage(r, errors),
    caption: r.str("caption"),
    published: r.bool("published"),
  };
  if (!data.caption) errors.caption = "Required";
  else if (data.caption.length > GALLERY_LIMITS.caption) {
    errors.caption = `Keep it under ${GALLERY_LIMITS.caption} characters`;
  }
  return result(data, errors);
}

/* Reviews --------------------------------------------------------------- */

export const REVIEW_LIMITS = { name: 60, context: 40, quote: 1500 } as const;

export type ReviewInput = { name: string; context: string; quote: string; published: boolean };

export const EMPTY_REVIEW: ReviewInput = { name: "", context: "", quote: "", published: true };

export function validateReview(raw: unknown): Validated<ReviewInput> {
  const r = reader(raw);
  const errors: Errors = {};
  const data: ReviewInput = {
    name: r.str("name"),
    context: r.str("context"),
    quote: r.str("quote"),
    published: r.bool("published"),
  };
  if (!data.name) errors.name = "Required";
  if (!data.quote) errors.quote = "Required";
  for (const key of Object.keys(REVIEW_LIMITS) as (keyof typeof REVIEW_LIMITS)[]) {
    if (data[key].length > REVIEW_LIMITS[key]) {
      errors[key] = `Keep it under ${REVIEW_LIMITS[key]} characters`;
    }
  }
  return result(data, errors);
}

/* Timetable ------------------------------------------------------------- */

/** Normalises a whole timetable: valid "HH:MM" only, de-duplicated, sorted. */
export function validateSchedule(raw: unknown): Validated<Schedule> {
  const obj = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const errors: Errors = {};
  const data: Schedule = { weekday: [], saturday: [], sunday: [] };
  for (const day of DAY_TYPES) {
    const list = Array.isArray(obj[day]) ? (obj[day] as unknown[]) : [];
    const times = list.filter((t): t is string => typeof t === "string").map((t) => t.trim());
    if (times.some((t) => !isValidTime(t))) errors[day] = "Every slot needs a valid time";
    const unique = [...new Set(times.filter(isValidTime))].sort();
    if (unique.length > MAX_SLOTS_PER_DAY) errors[day] = `At most ${MAX_SLOTS_PER_DAY} slots a day`;
    data[day] = unique;
  }
  return result(data, errors);
}
