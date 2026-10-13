import { NextResponse } from "next/server";
import { getAdminEmail } from "@/lib/auth";
import {
  IMAGE_FOLDERS,
  IMAGE_TYPES,
  MAX_IMAGE_BYTES,
  saveImage,
  storageAvailable,
  type ImageFolder,
} from "@/lib/storage";

export const runtime = "nodejs";

function fail(error: string, status: number) {
  return NextResponse.json({ ok: false, error }, { status });
}

/**
 * Stores one image from the admin dashboard and returns its URL. The record
 * that uses it is saved separately by a server action, which re-checks the URL.
 */
export async function POST(request: Request) {
  if (!(await getAdminEmail())) {
    return fail("Your session has expired. Please sign in again.", 401);
  }
  if (!storageAvailable()) {
    return fail("Image uploads aren't set up yet — connect a Vercel Blob store.", 503);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail("That upload didn't come through. Please try again.", 400);
  }

  const file = form.get("file");
  const folder = form.get("folder");
  if (!(file instanceof Blob) || !IMAGE_FOLDERS.includes(folder as ImageFolder)) {
    return fail("Invalid upload.", 400);
  }
  if (!(file.type in IMAGE_TYPES)) {
    return fail("Please upload a JPG, PNG or WebP image.", 415);
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return fail("That image is too large. Please use one under 4 MB.", 413);
  }

  try {
    const url = await saveImage(file, folder as ImageFolder);
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    console.error("[upload] failed:", err);
    return fail("Couldn't save the image. Please try again.", 500);
  }
}
