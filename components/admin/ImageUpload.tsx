"use client";

import { useRef, useState } from "react";
import type { ImageFields } from "@/lib/content";

/** Long edge after resizing — plenty for a full-width photo on a 27" screen. */
const MAX_EDGE = 2000;
const QUALITY = 0.86;

/**
 * Shrinks a photo in the browser before upload. Phone photos are often
 * 5–12 MB; this brings them well under the server's 4 MB limit and keeps the
 * public pages fast. PNGs (often posters with text) stay PNG to stay sharp.
 */
async function resize(file: File): Promise<{ blob: Blob; width: number; height: number }> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("This browser couldn't read that image. Please use a JPG or PNG.");
  }
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const type = file.type === "image/png" ? "image/png" : "image/jpeg";
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, QUALITY));
  if (!blob) throw new Error("Couldn't process that image. Please try another.");
  return { blob, width, height };
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
      const res = await fetch("/api/admin/upload", { method: "POST", body });
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
