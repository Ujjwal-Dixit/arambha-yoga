import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

/**
 * One client per server process. In dev, hot reloads re-run this module, so
 * the client is parked on globalThis to avoid leaking a connection pool each
 * time a file is saved.
 *
 * `prepare: false` is required by Neon's pooled (PgBouncer) connection string,
 * which is what Vercel's Neon integration puts in DATABASE_URL.
 */
const globalForDb = globalThis as unknown as {
  db?: ReturnType<typeof drizzle<typeof schema>>;
};

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getDb() {
  if (globalForDb.db) return globalForDb.db;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  const client = postgres(url, { prepare: false, max: 5 });
  const db = drizzle(client, { schema });
  globalForDb.db = db;
  return db;
}
