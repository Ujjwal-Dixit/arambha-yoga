import {
  boolean,
  date,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  tag: text("tag").notNull(),
  tagColor: text("tag_color").notNull().default("sage"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  /** Free text shown on the card, e.g. "Starts 5 Nov 2026". */
  dateText: text("date_text").notNull(),
  /** Free text shown on the card, e.g. "6:30 AM – 7:30 AM". */
  timeText: text("time_text").notNull(),
  icon: text("icon").notNull().default(""),
  highlight: boolean("highlight").notNull().default(false),
  published: boolean("published").notNull().default(true),
  /** Hidden before this day (IST). Null shows it immediately. */
  startsOn: date("starts_on", { mode: "string" }),
  /** Hidden after this day (IST). Null keeps it up until removed. */
  endsOn: date("ends_on", { mode: "string" }),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type PromotionRow = typeof promotions.$inferSelect;
