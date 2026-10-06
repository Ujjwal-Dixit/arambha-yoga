import { and, asc, desc, eq, gte, isNull, lte, or } from "drizzle-orm";
import { getDb, isDbConfigured } from "./index";
import { promotions, type PromotionRow } from "./schema";
import { todayInIST } from "@/lib/schedule";

const ordering = [asc(promotions.sortOrder), desc(promotions.id)];

/** Published promotions whose date window includes today (IST). */
export async function getLivePromotions(): Promise<PromotionRow[]> {
  // Without a database the site still renders — just with no promotions.
  // A configured-but-failing database throws instead, so a revalidation keeps
  // serving the last good page rather than caching an empty section.
  if (!isDbConfigured()) {
    console.warn("[promotions] DATABASE_URL not set — showing no promotions");
    return [];
  }
  const today = todayInIST();
  return getDb()
    .select()
    .from(promotions)
    .where(
      and(
        eq(promotions.published, true),
        or(isNull(promotions.startsOn), lte(promotions.startsOn, today)),
        or(isNull(promotions.endsOn), gte(promotions.endsOn, today))
      )
    )
    .orderBy(...ordering);
}

/** Everything, for the admin dashboard. */
export async function getAllPromotions(): Promise<PromotionRow[]> {
  return getDb().select().from(promotions).orderBy(...ordering);
}
