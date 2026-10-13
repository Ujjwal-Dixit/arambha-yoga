"use client";

import { useRef, useState } from "react";
import type { ImageFields } from "@/lib/content";

/** Long edge after resizing — plenty for a full-width photo on a 27" screen. */
const MAX_EDGE = 2000;
const QUALITY = 0.86;
/**
 * Vercel rejects request bodies over 4.5 MB before they reach the upload
 * route, and the browser only reports "Failed to fetch". Stay well under it.
 */
const MAX_UPLOAD_BYTES = 3.5 * 1024 * 1024;

function encode(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Couldn't process that image. Please try another."))),
      type,
      quality
    )
  );
}

/**
 * Shrinks a photo in the browser before upload. Phone photos are often
 * 5–12 MB; this brings them under the upload limit and keeps the public pages
 * fast. PNGs (often posters with text) stay PNG when that fits; a 2000 px PNG
 * can be 5–10 MB, so otherwise they become a high-quality JPEG, and as a last
 * resort the image is scaled down until it fits.
 */
async function resize(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("This browser couldn't read that image. Please use a JPG or PNG.");
  }
  const canvas = document.createElement("canvas");
  function draw(edge: number) {
    const scale = Math.min(1, edge / Math.max(bitmap.width, bitmap.height));
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d")!;
    // JPEG has no transparency: give see-through PNGs a white background.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  }

  try {
    let edge = MAX_EDGE;
    draw(edge);
    let blob = await encode(canvas, file.type === "image/png" ? "image/png" : "image/jpeg", QUALITY);
    if (blob.size > MAX_UPLOAD_BYTES && blob.type === "image/png") {
      blob = await encode(canvas, "image/jpeg", 0.9);
    }
    while (blob.size > MAX_UPLOAD_BYTES && edge > 800) {
      edge = Math.round(edge * 0.8);
      draw(edge);
      blob = await encode(canvas, "image/jpeg", QUALITY);
    }
    if (blob.size > MAX_UPLOAD_BYTES) throw new Error("That image is too large. Please try a smaller one.");
    return { blob, width: canvas.width, height: canvas.height };
  } finally {
    bitmap.close();
  }
}

export default function ImageUpload({
  folder,
  value,
  onChange,
  error,
  aspectHint,
}: {
  folder: "posters" | "gallery";
  value: ImageFields;
  onChange: (image: ImageFields) => void;
  error?: string;
  aspectHint: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploadError(null);
    if (!file.type.startsWith("image/")) {
      setUploadError("That file isn't an image.");
      return;
    }
    setUploading(true);
    try {
      const { blob, width, height } = await resize(file);
      const body = new FormData();
      body.append("file", blob, file.name);
      body.append("folder", folder);
      let res: Response;
      try {
        res = await fetch("/api/admin/upload", { method: "POST", body });
      } catch {
        throw new Error("The upload didn't go through. Check your connection and try again.");
      }
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error || "Upload failed. Please try again.");
      onChange({ imageUrl: data.url, width, height });
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (input.current) input.current.value = "";
    }
  }

  const shown = uploadError || error;

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 items-start">
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={uploading}
          className={`relative w-40 h-40 shrink-0 rounded-xl border-2 border-dashed overflow-hidden flex items-center justify-center text-center transition-colors ${
            shown ? "border-red-300" : "border-parchment hover:border-sage"
          } bg-cream/50`}
        >
          {value.imageUrl ? (
            // Plain <img>: the preview may be a just-uploaded local file that
            // next/image hasn't seen; this is admin-only, so no optimisation needed.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value.imageUrl} alt="" className="absolute inset-0 w-full h-full object-contain" />
          ) : (
            <span className="text-xs text-charcoal/50 px-3">
              <span className="block text-2xl mb-1">🖼️</span>
              Choose an image
            </span>
          )}
          {uploading && (
            <span className="absolute inset-0 bg-white/80 flex items-center justify-center text-sm font-medium text-forest">
              Uploading…
            </span>
          )}
        </button>
        <div className="text-xs text-charcoal/55 space-y-2 pt-1">
          <p>{aspectHint}</p>
          <p>JPG, PNG or WebP. Large photos are resized automatically.</p>
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={uploading}
            className="font-medium text-forest hover:text-sage disabled:opacity-50"
          >
            {value.imageUrl ? "Replace image" : "Upload image"}
          </button>
        </div>
      </div>
      <input
        ref={input}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {shown && <p className="mt-2 text-xs text-red-600">{shown}</p>}
    </div>
  );
}
