CREATE TABLE "promotions" (
	"id" serial PRIMARY KEY NOT NULL,
	"tag" text NOT NULL,
	"tag_color" text DEFAULT 'sage' NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"date_text" text NOT NULL,
	"time_text" text NOT NULL,
	"icon" text DEFAULT '' NOT NULL,
	"highlight" boolean DEFAULT false NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"starts_on" date,
	"ends_on" date,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
