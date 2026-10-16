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
import { getDb } from "@/lib/db";
import { promotions } from "@/lib/db/schema";
import { validatePromotion } from "@/lib/promotions";

/**
 * Promotion cards on the home page. Every action re-checks the session
 * itself — see lib/admin/actions.ts.
 */

export type { ActionResult };

/** Creates a promotion when `id` is null, otherwise updates it. */
export async function savePromotion(id: number | null, input: unknown): Promise<ActionResult> {
  if (!(await isAdmin())) return SIGNED_OUT;
  if (id !== null && !validId(id)) return { ok: false, error: "Unknown promotion." };

  const result = validatePromotion(input);
  if (!result.ok) {
    return { ok: false, error: "Please fix the highlighted fields.", errors: result.errors };
  }
  const values = {
    ...result.data,
    startsOn: result.data.startsOn || null,
    endsOn: result.data.endsOn || null,
  };

  return attempt(async () => {
    const db = getDb();
    if (id === null) {
      // New promotions go to the top of the list.
      await db.insert(promotions).values({ ...values, sortOrder: await topSortOrder(promotions) });
    } else {
      await db
        .update(promotions)
        .set({ ...values, updatedAt: new Date() })
        .where(eq(promotions.id, id));
    }
  });
}

export async function deletePromotion(id: number): Promise<ActionResult> {
  if (!(await isAdmin())) return SIGNED_OUT;
  if (!validId(id)) return { ok: false, error: "Unknown promotion." };
  return attempt(async () => {
    await getDb().delete(promotions).where(eq(promotions.id, id));
  });
}

export async function setPublished(id: number, published: boolean): Promise<ActionResult> {
  if (!(await isAdmin())) return SIGNED_OUT;
  if (!validId(id) || typeof published !== "boolean") {
    return { ok: false, error: "Unknown promotion." };
  }
  return attempt(async () => {
    await getDb()
      .update(promotions)
      .set({ published, updatedAt: new Date() })
      .where(eq(promotions.id, id));
  });
}

/** Moves a promotion one place up or down. */
export async function movePromotion(id: number, direction: "up" | "down"): Promise<ActionResult> {
  if (!(await isAdmin())) return SIGNED_OUT;
  if (!validId(id) || !isDirection(direction)) return { ok: false, error: "Unknown promotion." };
  return attempt(() => moveRow(promotions, id, direction));
}
