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

/** Poster images shown in the "Current Offers" panel beside the home hero. */
export const offerPosters = pgTable("offer_posters", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  /** Describes the offer for screen readers and search engines. */
  alt: text("alt").notNull(),
  published: boolean("published").notNull().default(true),
  /** Same IST date window as promotions. */
  startsOn: date("starts_on", { mode: "string" }),
  endsOn: date("ends_on", { mode: "string" }),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type OfferPosterRow = typeof offerPosters.$inferSelect;

/** "Life at Arambha" carousel. */
export const galleryPhotos = pgTable("gallery_photos", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  caption: text("caption").notNull(),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type GalleryPhotoRow = typeof galleryPhotos.$inferSelect;

/** Student reviews ("Voices from Our Community"), copied from Google. */
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  /** Optional line under the name, e.g. "Beginner". */
  context: text("context").notNull().default(""),
  quote: text("quote").notNull(),
  published: boolean("published").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type TestimonialRow = typeof testimonials.$inferSelect;

/** Bookable time slots on the enquiry form. A day type with no rows is closed. */
export const classSlots = pgTable("class_slots", {
  id: serial("id").primaryKey(),
  /** "weekday" (Mon–Fri), "saturday" or "sunday". */
  dayType: text("day_type").notNull(),
  /** 24-hour "HH:MM"; shown as e.g. "6:30 AM". */
  time: text("time").notNull(),
});

export type ClassSlotRow = typeof classSlots.$inferSelect;
