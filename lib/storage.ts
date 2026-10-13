import { randomUUID } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { del, put } from "@vercel/blob";

/**
 * Where admin-uploaded images go.
 *
 * Production: Vercel Blob. Connecting a Blob store to the Vercel project sets
 * BLOB_READ_WRITE_TOKEN automatically. Vercel's filesystem is read-only and
 * wiped on every deploy, so there is no local fallback there.
 *
 * Local development without a token: files are written to public/uploads
 * (gitignored) so the dashboard can be tried end to end.
 */

export const IMAGE_FOLDERS = ["posters", "gallery"] as const;
export type ImageFolder = (typeof IMAGE_FOLDERS)[number];

export const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/** Comfortably under Vercel's 4.5 MB request limit; the dashboard resizes first. */
export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const BLOB_HOST = /^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\//i;
const LOCAL_UPLOAD = /^\/uploads\/(posters|gallery)\/[a-z0-9-]+\.(jpg|png|webp)$/;
/** Images that shipped with the site before the dashboard managed them. */
const BUNDLED = /^\/(offers|gallery)\/[\w.-]+\.(jpg|jpeg|png|webp)$/i;

function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function storageAvailable(): boolean {
  return blobConfigured() || process.env.NODE_ENV !== "production";
}

/** Only URLs this site produced may be saved against a record. */
export function isAllowedImageUrl(url: string): boolean {
  return BLOB_HOST.test(url) || LOCAL_UPLOAD.test(url) || BUNDLED.test(url);
}

export async function saveImage(file: Blob, folder: ImageFolder): Promise<string> {
  const ext = IMAGE_TYPES[file.type];
  if (!ext) throw new Error(`Unsupported image type: ${file.type}`);
  const name = `${randomUUID()}.${ext}`;

  if (blobConfigured()) {
    const blob = await put(`${folder}/${name}`, file, {
      access: "public",
      contentType: file.type,
    });
    return blob.url;
  }
  if (process.env.NODE_ENV === "production") {
    throw new Error("Image storage is not configured (BLOB_READ_WRITE_TOKEN).");
  }
  const dir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${folder}/${name}`;
}

/**
 * Removes an uploaded image once nothing points at it. Bundled images are left
 * alone, and a failure is only logged: an orphaned file is harmless, while
 * failing the delete would leave the record stuck in the dashboard.
 */
export async function deleteImage(url: string): Promise<void> {
  try {
    if (BLOB_HOST.test(url)) {
      await del(url);
    } else if (LOCAL_UPLOAD.test(url)) {
      await unlink(path.join(process.cwd(), "public", url));
    }
  } catch (err) {
    console.error("[storage] couldn't delete", url, err);
  }
}
