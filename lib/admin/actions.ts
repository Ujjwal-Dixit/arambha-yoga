import { asc, desc, sql } from "drizzle-orm";
import type { AnyPgColumn, PgTable } from "drizzle-orm/pg-core";
import { revalidatePath } from "next/cache";
import { getAdminEmail } from "@/lib/auth";
import { getDb } from "@/lib/db";

/**
 * Building blocks for the dashboard's server actions (the "use server" files
 * under app/admin). Every action must call requireAdmin() itself: server
 * actions are public HTTP endpoints, so the admin page being protected does
 * not protect them.
 */

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string; errors?: Record<string, string> };

export const SIGNED_OUT: ActionResult = {
  ok: false,
  error: "Your session has expired. Please sign in again.",
};

export async function isAdmin(): Promise<boolean> {
  return Boolean(await getAdminEmail());
}

export function validId(id: unknown): id is number {
  return typeof id === "number" && Number.isInteger(id) && id > 0;
}

/** The home page and every dashboard tab read this content. */
function refresh() {
  revalidatePath("/");
  revalidatePath("/admin", "layout");
}

export async function attempt(work: () => Promise<void>): Promise<ActionResult> {
  try {
    await work();
    refresh();
    return { ok: true };
  } catch (err) {
    console.error("[admin] action failed:", err);
    return { ok: false, error: "Something went wrong saving that. Please try again." };
  }
}

type Orderable = PgTable & { id: AnyPgColumn; sortOrder: AnyPgColumn };

/** Sort order that puts a new row at the top of the list. */
export async function topSortOrder(table: Orderable): Promise<number> {
  const [{ min }] = await getDb()
    .select({ min: sql<number | null>`min(${table.sortOrder})` })
    .from(table);
  return (min ?? 1) - 1;
}

/** Moves a row one place up or down, renumbering the whole list. */
export async function moveRow(
  table: Orderable,
  id: number,
  direction: "up" | "down"
): Promise<void> {
  await getDb().transaction(async (tx) => {
    const rows = await tx
      .select({ id: table.id })
      .from(table)
      .orderBy(asc(table.sortOrder), desc(table.id));
    const ids = rows.map((r) => r.id as number);
    const from = ids.indexOf(id);
    const to = direction === "up" ? from - 1 : from + 1;
    if (from === -1 || to < 0 || to >= ids.length) return;
    [ids[from], ids[to]] = [ids[to], ids[from]];
    for (const [index, rowId] of ids.entries()) {
      await tx.execute(
        sql`update ${table} set ${sql.identifier(table.sortOrder.name)} = ${index} where ${table.id} = ${rowId}`
      );
    }
  });
}

export function isDirection(d: unknown): d is "up" | "down" {
  return d === "up" || d === "down";
}
