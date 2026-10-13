"use client";

import { useState } from "react";
import ImageUpload from "@/components/admin/ImageUpload";
import {
  AddButton,
  EditorCard,
  EmptyState,
  ErrorNote,
  Field,
  FormFooter,
  NETWORK_ERROR,
  PageHeader,
  ReorderButtons,
  RowActions,
  StatusBadge,
  Toggle,
  inputClass,
  useRunner,
} from "@/components/admin/ui";
import {
  deleteGalleryPhoto,
  moveGalleryPhoto,
  saveGalleryPhoto,
  setGalleryPublished,
} from "@/app/admin/content-actions";
import { EMPTY_GALLERY, GALLERY_LIMITS, validateGallery, type GalleryInput } from "@/lib/content";

export type AdminGalleryPhoto = GalleryInput & { id: number };

export default function GalleryManager({ photos }: { photos: AdminGalleryPhoto[] }) {
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const { busy, error, setError, run } = useRunner();
  const live = photos.filter((p) => p.published).length;

  return (
    <section>
      <PageHeader
        title="Gallery"
        description={
          <>
            Photos in the &ldquo;Life at Arambha&rdquo; slideshow on the home page, shown in the order below.{" "}
            {live} of {photos.length} published.
          </>
        }
        action={
          editing !== "new" && (
            <AddButton
              disabled={busy}
              onClick={() => {
                setEditing("new");
                setError(null);
              }}
            >
              Add photo
            </AddButton>
          )
        }
      />

      {error && <ErrorNote className="mb-5">{error}</ErrorNote>}

      {editing === "new" && (
        <div className="mb-6">
          <PhotoEditor id={null} initial={EMPTY_GALLERY} onClose={() => setEditing(null)} />
        </div>
      )}

      {photos.length === 0 && editing !== "new" ? (
        <EmptyState icon="📷" title="No photos yet">
          The &ldquo;Life at Arambha&rdquo; section stays hidden until a photo is published.
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {photos.map((p, i) => {
            if (editing === p.id) {
              return (
                <li key={p.id}>
                  <PhotoEditor id={p.id} initial={p} onClose={() => setEditing(null)} />
                </li>
              );
            }
            return (
              <li
                key={p.id}
                className={`bg-white rounded-2xl border border-parchment p-4 sm:p-5 flex gap-4 ${p.published ? "" : "opacity-80"}`}
              >
                <ReorderButtons
                  name={p.caption}
                  index={i}
                  count={photos.length}
                  busy={busy}
                  onMove={(d) => run(() => moveGalleryPhoto(p.id, d))}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.imageUrl}
                  alt=""
                  className="w-28 h-20 shrink-0 rounded-lg object-cover border border-parchment bg-cream"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <StatusBadge status={p.published ? "live" : "draft"} />
                  </div>
                  <p className="text-sm text-charcoal/75 line-clamp-2">{p.caption}</p>
                  <RowActions
                    noun="photo"
                    published={p.published}
                    busy={busy}
                    onEdit={() => {
                      setEditing(p.id);
                      setError(null);
                    }}
                    onTogglePublished={() => run(() => setGalleryPublished(p.id, !p.published))}
                    onDelete={() => run(() => deleteGalleryPhoto(p.id))}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function PhotoEditor({ id, initial, onClose }: { id: number | null; initial: GalleryInput; onClose: () => void }) {
  const [form, setForm] = useState<GalleryInput>({ ...initial });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const check = validateGallery(form);
    if (!check.ok) {
      setErrors(check.errors);
      return;
    }
    setSaving(true);
    try {
      const result = await saveGalleryPhoto(id, form);
      if (result.ok) return onClose();
      setError(result.error);
      if (result.errors) setErrors(result.errors);
    } catch {
      setError(NETWORK_ERROR);
    } finally {
      setSaving(false);
    }
  }

  return (
    <EditorCard title={id === null ? "Add a photo" : "Edit photo"} onSubmit={handleSubmit}>
      <div className="space-y-5">
        <Field label="Photo" group>
          <ImageUpload
            folder="gallery"
            value={form}
            error={errors.imageUrl}
            aspectHint="Any shape works — tall phone photos are shown in full, never cropped."
            onChange={(img) => {
              setForm((f) => ({ ...f, ...img }));
              setErrors((e) => ({ ...e, imageUrl: undefined }));
            }}
          />
        </Field>

        <Field label="Caption" hint={`${form.caption.length}/${GALLERY_LIMITS.caption}`} error={errors.caption}>
          <input
            value={form.caption}
            maxLength={GALLERY_LIMITS.caption}
            onChange={(e) => {
              setForm((f) => ({ ...f, caption: e.target.value }));
              setErrors((er) => ({ ...er, caption: undefined }));
            }}
            placeholder="e.g. Morning batch, after aerial practice"
            className={`${inputClass} ${errors.caption ? "border-red-300" : ""}`}
          />
        </Field>

        <Toggle
          checked={form.published}
          onChange={(v) => setForm((f) => ({ ...f, published: v }))}
          label="Published"
          hint="Unpublished photos stay here but don't appear on the site"
        />
      </div>

      <FormFooter saving={saving} onCancel={onClose} error={error} submitLabel={id === null ? "Add photo" : "Save changes"} />
    </EditorCard>
  );
}
