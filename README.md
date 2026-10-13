# Arambha Yoga & Wellness

The studio website (Next.js 14, Tailwind 4) with an owner dashboard at `/admin`.

## What the owner can manage at `/admin`

| Tab | Controls |
|---|---|
| Promotions | "Upcoming Classes" cards on the home page |
| Offer Posters | Poster images in the "Current Offers" panel beside the main heading |
| Gallery | Photos in the "Life at Arambha" slideshow |
| Reviews | "Voices from Our Community" (copied from Google reviews) |
| Class Timings | Time slots on the enquiry form, per day; a day with no slots is closed |

Promotions and posters can be scheduled with "show from" / "hide after" dates
(India time). Everything can be reordered, unpublished or deleted. Changes
appear on the site immediately.

Sign-in is with Google, limited to the addresses in `ADMIN_EMAILS`.

## How it fits together

- **Database** — Postgres via Drizzle (`lib/db/schema.ts`). Migrations live in
  `drizzle/` and run automatically before every build (`npm run build`).
- **Images** — uploads go to Vercel Blob (`lib/storage.ts`). They're resized in
  the browser first (max 2000 px). Without a Blob token in local development,
  they're written to `public/uploads/` instead.
- **Enquiries** — the form posts to `/api/enquiry`, which checks the slot
  against the timetable and sends the studio a Telegram message
  (`lib/telegram.ts`).

## Local development

```bash
npm install
cp .env.example .env.local   # or ask for the values; see "Environment variables"
npm run db:migrate           # create / update tables in your local Postgres
npm run dev
```

After changing `lib/db/schema.ts`: `npm run db:generate`, review the SQL in
`drizzle/`, then `npm run db:migrate`.

## Environment variables

| Variable | Where it comes from |
|---|---|
| `DATABASE_URL`, `DATABASE_URL_UNPOOLED` | Set by Vercel's Neon integration |
| `BLOB_READ_WRITE_TOKEN` | Set by connecting a Vercel Blob store |
| `NEXTAUTH_URL` | The site's URL, e.g. `https://arambhayoga.com` |
| `NEXTAUTH_SECRET` | `openssl rand -base64 32` — a different one per environment |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google Cloud OAuth client (below) |
| `ADMIN_EMAILS` | Comma-separated Google accounts allowed into `/admin` |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | The bot that receives enquiries |

## Deploying to Vercel

1. Import the Git repository in Vercel (framework: Next.js; keep the default
   build command — it runs the migrations).
2. **Storage → Neon Postgres**: create a database and connect it to the project
   for all environments. This sets `DATABASE_URL` / `DATABASE_URL_UNPOOLED`.
3. **Storage → Blob**: create a store with **public** access and connect it to
   the project. This sets `BLOB_READ_WRITE_TOKEN`.
4. **Settings → Environment Variables**: add the rest from the table above.
5. Deploy. The first build creates the tables and fills them with the site's
   current content.
6. **Settings → Domains**: add the studio's domain and set the DNS records
   Vercel shows. Then set `NEXTAUTH_URL` to that domain and redeploy.

## Google sign-in

In [Google Cloud Console](https://console.cloud.google.com/), ideally in a
project owned by the studio's Google account:

1. **Google Auth Platform → Branding**: app name, support email, and the
   studio's domain under authorised domains.
2. **Audience**: External, then **Publish app**. The app only asks for name and
   email, so Google doesn't need to review it.
3. **Clients → Create client → Web application**:
   - Authorised JavaScript origins: `https://<domain>`
   - Authorised redirect URIs: `https://<domain>/api/auth/callback/google`
   - Add `http://localhost:3000` and
     `http://localhost:3000/api/auth/callback/google` for local development.
4. Put the client ID and secret into Vercel's environment variables.

Sign-in only works on URLs registered in step 3, so use the production domain
(Vercel's preview URLs change on every deploy).
