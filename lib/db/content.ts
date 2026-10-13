import { and, asc, desc, eq, gte, isNull, lte, or } from "drizzle-orm";
import { getDb, isDbConfigured } from "./index";
import {
  classSlots,
  galleryPhotos,
  offerPosters,
  testimonials,
  type GalleryPhotoRow,
  type OfferPosterRow,
  type TestimonialRow,
} from "./schema";
import { DEFAULT_SCHEDULE, todayInIST, type Schedule } from "@/lib/schedule";

/**
 * Site content managed from the admin dashboard. Like promotions: with no
 * database configured the site still renders (sections hide themselves, the
 * enquiry form falls back to the default timetable), but a configured database
 * that fails throws, so a revalidation keeps serving the last good page.
 */

function noDb(what: string) {
  console.warn(`[content] DATABASE_URL not set — ${what}`);
}

/* Offer posters --------------------------------------------------------- */

const posterOrder = [asc(offerPosters.sortOrder), desc(offerPosters.id)];

export async function getLiveOfferPosters(): Promise<OfferPosterRow[]> {
  if (!isDbConfigured()) {
    noDb("showing no offer posters");
    return [];
  }
  const today = todayInIST();
  return getDb()
    .select()
    .from(offerPosters)
    .where(
      and(
        eq(offerPosters.published, true),
        or(isNull(offerPosters.startsOn), lte(offerPosters.startsOn, today)),
        or(isNull(offerPosters.endsOn), gte(offerPosters.endsOn, today))
      )
    )
    .orderBy(...posterOrder);
}

export async function getAllOfferPosters(): Promise<OfferPosterRow[]> {
  return getDb().select().from(offerPosters).orderBy(...posterOrder);
}

/* Gallery --------------------------------------------------------------- */

const galleryOrder = [asc(galleryPhotos.sortOrder), desc(galleryPhotos.id)];

export async function getPublishedGallery(): Promise<GalleryPhotoRow[]> {
  if (!isDbConfigured()) {
    noDb("showing no gallery");
    return [];
  }
  return getDb()
    .select()
    .from(galleryPhotos)
    .where(eq(galleryPhotos.published, true))
    .orderBy(...galleryOrder);
}

export async function getAllGallery(): Promise<GalleryPhotoRow[]> {
  return getDb().select().from(galleryPhotos).orderBy(...galleryOrder);
}

/* Testimonials ---------------------------------------------------------- */

const reviewOrder = [asc(testimonials.sortOrder), desc(testimonials.id)];

export async function getPublishedTestimonials(): Promise<TestimonialRow[]> {
  if (!isDbConfigured()) {
    noDb("showing no reviews");
    return [];
  }
  return getDb()
    .select()
    .from(testimonials)
    .where(eq(testimonials.published, true))
    .orderBy(...reviewOrder);
}

export async function getAllTestimonials(): Promise<TestimonialRow[]> {
  return getDb().select().from(testimonials).orderBy(...reviewOrder);
}

/* Class timetable ------------------------------------------------------- */

/** Slots per day type, each list sorted by time ("HH:MM" sorts as text). */
export async function getSchedule(): Promise<Schedule> {
  if (!isDbConfigured()) {
    noDb("using the default class timetable");
    return DEFAULT_SCHEDULE;
  }
  const rows = await getDb().select().from(classSlots).orderBy(asc(classSlots.time));
  const schedule: Schedule = { weekday: [], saturday: [], sunday: [] };
  for (const row of rows) {
    if (row.dayType in schedule) schedule[row.dayType as keyof Schedule].push(row.time);
  }
  return schedule;
}
