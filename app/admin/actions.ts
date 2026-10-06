"use server";

import { asc, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAdminEmail } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { promotions } from "@/lib/db/schema";
import { validatePromotion, type PromotionInput } from "@/lib/promotions";

/**
 * Every action re-checks the session itself. Server actions are public HTTP
 * endpoints — the admin page being protected does not protect these.
 */

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string; errors?: Partial<Record<keyof PromotionInput, string>> };

const SIGNED_OUT: ActionResult = {
  ok: false,
  error: "Your session has expired. Please sign in again.",
};

function validId(id: unknown): id is number {
  return typeof id === "number" && Number.isInteger(id) && id > 0;
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/admin");
}

async function attempt(work: () => Promise<void>): Promise<ActionResult> {
  try {
    await work();
    refresh();
    return { ok: true };
  } catch (err) {
    console.error("[admin] action failed:", err);
    return { ok: false, error: "Something went wrong saving that. Please try again." };
  }
}

/** Creates a promotion when `id` is null, otherwise updates it. */
export async function savePromotion(id: number | null, input: unknown): Promise<ActionResult> {
  if (!(await getAdminEmail())) return SIGNED_OUT;
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
      const [{ min }] = await db
        .select({ min: sql<number | null>`min(${promotions.sortOrder})` })
        .from(promotions);
      await db.insert(promotions).values({ ...values, sortOrder: (min ?? 1) - 1 });
    } else {
      await db
        .update(promotions)
        .set({ ...values, updatedAt: new Date() })
        .where(eq(promotions.id, id));
    }
  });
}

export async function deletePromotion(id: number): Promise<ActionResult> {
  if (!(await getAdminEmail())) return SIGNED_OUT;
  if (!validId(id)) return { ok: false, error: "Unknown promotion." };
  return attempt(async () => {
    await getDb().delete(promotions).where(eq(promotions.id, id));
  });
}

export async function setPublished(id: number, published: boolean): Promise<ActionResult> {
  if (!(await getAdminEmail())) return SIGNED_OUT;
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

/** Moves a promotion one place up or down, renumbering the whole list. */
export async function movePromotion(id: number, direction: "up" | "down"): Promise<ActionResult> {
  if (!(await getAdminEmail())) return SIGNED_OUT;
  if (!validId(id) || (direction !== "up" && direction !== "down")) {
    return { ok: false, error: "Unknown promotion." };
  }
  return attempt(async () => {
    await getDb().transaction(async (tx) => {
      const rows = await tx
        .select({ id: promotions.id })
        .from(promotions)
        .orderBy(asc(promotions.sortOrder), desc(promotions.id));
      const ids = rows.map((r) => r.id);
      const from = ids.indexOf(id);
      const to = direction === "up" ? from - 1 : from + 1;
      if (from === -1 || to < 0 || to >= ids.length) return;
      [ids[from], ids[to]] = [ids[to], ids[from]];
      for (const [index, rowId] of ids.entries()) {
        await tx.update(promotions).set({ sortOrder: index }).where(eq(promotions.id, rowId));
      }
    });
  });
}
