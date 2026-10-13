"use server";

import { eq } from "drizzle-orm";
import {
  SIGNED_OUT,
  attempt,
  isAdmin,
  isDirection,
  moveRow,
  topSortOrder,
  validId,
  type ActionResult,
} from "@/lib/admin/actions";
import { validateGallery, validatePoster, validateReview, validateSchedule } from "@/lib/content";
import { getDb } from "@/lib/db";
import { classSlots, galleryPhotos, offerPosters, testimonials } from "@/lib/db/schema";
import { deleteImage, isAllowedImageUrl } from "@/lib/storage";
import { DAY_TYPES } from "@/lib/schedule";

/**
 * Offer posters, gallery photos, reviews and the class timetable. Every action
 * re-checks the session itself — see lib/admin/actions.ts.
 */

const FIX_FIELDS = "Please fix the highlighted fields.";
const BAD_IMAGE: ActionResult = {
  ok: false,
  error: "That image didn't upload properly. Please choose it again.",
  errors: { imageUrl: "Please upload the image again" },
};

/* Offer posters --------------------------------------------------------- */

export async function savePoster(id: number | null, input: unknown): Promise<ActionResult> {
  if (!(await isAdmin())) return SIGNED_OUT;
  if (id !== null && !validId(id)) return { ok: false, error: "Unknown poster." };

  const result = validatePoster(input);
  if (!result.ok) return { ok: false, error: FIX_FIELDS, errors: result.errors };
  if (!isAllowedImageUrl(result.data.imageUrl)) return BAD_IMAGE;
  const values = {
    ...result.data,
    startsOn: result.data.startsOn || null,
    endsOn: result.data.endsOn || null,
  };

  let replaced: string | null = null;
  const outcome = await attempt(async () => {
    const db = getDb();
    if (id === null) {
      await db.insert(offerPosters).values({ ...values, sortOrder: await topSortOrder(offerPosters) });
      return;
    }
    const [old] = await db.select({ url: offerPosters.imageUrl }).from(offerPosters).where(eq(offerPosters.id, id));
    await db.update(offerPosters).set({ ...values, updatedAt: new Date() }).where(eq(offerPosters.id, id));
    if (old && old.url !== values.imageUrl) replaced = old.url;
  });
  if (outcome.ok && replaced) await deleteImage(replaced);
  return outcome;
}

export async function deletePoster(id: number): Promise<ActionResult> {
  if (!(await isAdmin())) return SIGNED_OUT;
  if (!validId(id)) return { ok: false, error: "Unknown poster." };
  let url: string | null = null;
  const outcome = await attempt(async () => {
    const [row] = await getDb()
      .delete(offerPosters)
      .where(eq(offerPosters.id, id))
      .returning({ url: offerPosters.imageUrl });
    url = row?.url ?? null;
  });
  if (outcome.ok && url) await deleteImage(url);
  return outcome;
}

export async function setPosterPublished(id: number, published: boolean): Promise<ActionResult> {
  if (!(await isAdmin())) return SIGNED_OUT;
  if (!validId(id) || typeof published !== "boolean") return { ok: false, error: "Unknown poster." };
  return attempt(async () => {
    await getDb()
      .update(offerPosters)
      .set({ published, updatedAt: new Date() })
      .where(eq(offerPosters.id, id));
  });
}

export async function movePoster(id: number, direction: "up" | "down"): Promise<ActionResult> {
  if (!(await isAdmin())) return SIGNED_OUT;
  if (!validId(id) || !isDirection(direction)) return { ok: false, error: "Unknown poster." };
  return attempt(() => moveRow(offerPosters, id, direction));
}

/* Gallery --------------------------------------------------------------- */

export async function saveGalleryPhoto(id: number | null, input: unknown): Promise<ActionResult> {
  if (!(await isAdmin())) return SIGNED_OUT;
  if (id !== null && !validId(id)) return { ok: false, error: "Unknown photo." };

  const result = validateGallery(input);
  if (!result.ok) return { ok: false, error: FIX_FIELDS, errors: result.errors };
  if (!isAllowedImageUrl(result.data.imageUrl)) return BAD_IMAGE;
  const values = result.data;

  let replaced: string | null = null;
  const outcome = await attempt(async () => {
    const db = getDb();
    if (id === null) {
      await db.insert(galleryPhotos).values({ ...values, sortOrder: await topSortOrder(galleryPhotos) });
      return;
    }
    const [old] = await db.select({ url: galleryPhotos.imageUrl }).from(galleryPhotos).where(eq(galleryPhotos.id, id));
    await db.update(galleryPhotos).set({ ...values, updatedAt: new Date() }).where(eq(galleryPhotos.id, id));
    if (old && old.url !== values.imageUrl) replaced = old.url;
  });
  if (outcome.ok && replaced) await deleteImage(replaced);
  return outcome;
}

export async function deleteGalleryPhoto(id: number): Promise<ActionResult> {
  if (!(await isAdmin())) return SIGNED_OUT;
  if (!validId(id)) return { ok: false, error: "Unknown photo." };
  let url: string | null = null;
  const outcome = await attempt(async () => {
    const [row] = await getDb()
      .delete(galleryPhotos)
      .where(eq(galleryPhotos.id, id))
      .returning({ url: galleryPhotos.imageUrl });
    url = row?.url ?? null;
  });
  if (outcome.ok && url) await deleteImage(url);
  return outcome;
}

export async function setGalleryPublished(id: number, published: boolean): Promise<ActionResult> {
  if (!(await isAdmin())) return SIGNED_OUT;
  if (!validId(id) || typeof published !== "boolean") return { ok: false, error: "Unknown photo." };
  return attempt(async () => {
    await getDb()
      .update(galleryPhotos)
      .set({ published, updatedAt: new Date() })
      .where(eq(galleryPhotos.id, id));
  });
}

export async function moveGalleryPhoto(id: number, direction: "up" | "down"): Promise<ActionResult> {
  if (!(await isAdmin())) return SIGNED_OUT;
  if (!validId(id) || !isDirection(direction)) return { ok: false, error: "Unknown photo." };
  return attempt(() => moveRow(galleryPhotos, id, direction));
}

/* Reviews --------------------------------------------------------------- */

export async function saveReview(id: number | null, input: unknown): Promise<ActionResult> {
  if (!(await isAdmin())) return SIGNED_OUT;
  if (id !== null && !validId(id)) return { ok: false, error: "Unknown review." };

  const result = validateReview(input);
  if (!result.ok) return { ok: false, error: FIX_FIELDS, errors: result.errors };
  const values = result.data;

  return attempt(async () => {
    const db = getDb();
    if (id === null) {
      await db.insert(testimonials).values({ ...values, sortOrder: await topSortOrder(testimonials) });
    } else {
      await db.update(testimonials).set({ ...values, updatedAt: new Date() }).where(eq(testimonials.id, id));
    }
  });
}

export async function deleteReview(id: number): Promise<ActionResult> {
  if (!(await isAdmin())) return SIGNED_OUT;
  if (!validId(id)) return { ok: false, error: "Unknown review." };
  return attempt(async () => {
    await getDb().delete(testimonials).where(eq(testimonials.id, id));
  });
}

export async function setReviewPublished(id: number, published: boolean): Promise<ActionResult> {
  if (!(await isAdmin())) return SIGNED_OUT;
  if (!validId(id) || typeof published !== "boolean") return { ok: false, error: "Unknown review." };
  return attempt(async () => {
    await getDb()
      .update(testimonials)
      .set({ published, updatedAt: new Date() })
      .where(eq(testimonials.id, id));
  });
}

export async function moveReview(id: number, direction: "up" | "down"): Promise<ActionResult> {
  if (!(await isAdmin())) return SIGNED_OUT;
  if (!validId(id) || !isDirection(direction)) return { ok: false, error: "Unknown review." };
  return attempt(() => moveRow(testimonials, id, direction));
}

/* Timetable ------------------------------------------------------------- */

/** Replaces the whole timetable in one transaction. */
export async function saveSchedule(input: unknown): Promise<ActionResult> {
  if (!(await isAdmin())) return SIGNED_OUT;
  const result = validateSchedule(input);
  if (!result.ok) return { ok: false, error: FIX_FIELDS, errors: result.errors };
  const rows = DAY_TYPES.flatMap((dayType) =>
    result.data[dayType].map((time) => ({ dayType, time }))
  );
  return attempt(async () => {
    await getDb().transaction(async (tx) => {
      await tx.delete(classSlots);
      if (rows.length) await tx.insert(classSlots).values(rows);
    });
  });
}
