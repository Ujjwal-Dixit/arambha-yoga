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
  VisibilityFields,
  describeWindow,
  inputClass,
  useRunner,
} from "@/components/admin/ui";
import { deletePoster, movePoster, savePoster, setPosterPublished } from "@/app/admin/content-actions";
import { EMPTY_POSTER, POSTER_LIMITS, validatePoster, type PosterInput } from "@/lib/content";
import { promotionStatus } from "@/lib/promotions";

export type AdminPoster = PosterInput & { id: number };

export default function PostersManager({ posters, today }: { posters: AdminPoster[]; today: string }) {
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const { busy, error, setError, run } = useRunner();

  return (
    <section>
      <PageHeader
        title="Offer Posters"
        description={
          <>
            Poster images in the slider beside the main heading on the home page. Live
            posters rotate in the order below; clicking one takes visitors to the enquiry form.
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
              New poster
            </AddButton>
          )
        }
      />

      {error && <ErrorNote className="mb-5">{error}</ErrorNote>}

      {editing === "new" && (
        <div className="mb-6">
          <PosterEditor id={null} initial={EMPTY_POSTER} onClose={() => setEditing(null)} />
        </div>
      )}

      {posters.length === 0 && editing !== "new" ? (
        <EmptyState icon="🖼️" title="No offer posters yet">
          The poster slider stays hidden until a poster is live.
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {posters.map((p, i) => {
            if (editing === p.id) {
              return (
                <li key={p.id}>
                  <PosterEditor id={p.id} initial={p} onClose={() => setEditing(null)} />
                </li>
              );
            }
            const status = promotionStatus(p, today);
            return (
              <li
                key={p.id}
                className={`bg-white rounded-2xl border border-parchment p-4 sm:p-5 flex gap-4 ${status === "live" ? "" : "opacity-80"}`}
              >
                <ReorderButtons
                  name={p.alt}
                  index={i}
                  count={posters.length}
                  busy={busy}
                  onMove={(d) => run(() => movePoster(p.id, d))}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.imageUrl}
                  alt=""
                  className="w-20 h-28 shrink-0 rounded-lg object-cover border border-parchment bg-cream"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <StatusBadge status={status} />
                    <span className="text-xs text-charcoal/55">Shown: {describeWindow(p)}</span>
                  </div>
                  <p className="text-sm text-charcoal/75 line-clamp-2">{p.alt}</p>
                  <RowActions
                    noun="poster"
                    published={p.published}
                    busy={busy}
                    onEdit={() => {
                      setEditing(p.id);
                      setError(null);
                    }}
                    onTogglePublished={() => run(() => setPosterPublished(p.id, !p.published))}
                    onDelete={() => run(() => deletePoster(p.id))}
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

function PosterEditor({ id, initial, onClose }: { id: number | null; initial: PosterInput; onClose: () => void }) {
  const [form, setForm] = useState<PosterInput>({ ...initial });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof PosterInput>(key: K, value: PosterInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const check = validatePoster(form);
    if (!check.ok) {
      setErrors(check.errors);
      return;
    }
    setSaving(true);
    try {
      const result = await savePoster(id, form);
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
    <EditorCard title={id === null ? "New offer poster" : "Edit offer poster"} onSubmit={handleSubmit}>
      <div className="space-y-5">
        <Field label="Poster image" error={undefined} group>
          <ImageUpload
            folder="posters"
            value={form}
            error={errors.imageUrl}
            aspectHint="Portrait posters work best (around 2 : 3, like a phone-sized flyer)."
            onChange={(img) => {
              setForm((f) => ({ ...f, ...img }));
              setErrors((e) => ({ ...e, imageUrl: undefined }));
            }}
          />
        </Field>

        <Field
          label="What the poster says"
          hint={`${form.alt.length}/${POSTER_LIMITS.alt}`}
          error={errors.alt}
        >
          <textarea
            value={form.alt}
            maxLength={POSTER_LIMITS.alt}
            rows={2}
            onChange={(e) => set("alt", e.target.value)}
            placeholder="e.g. Dussehra offer — 40% off the annual package, now ₹12,000. Valid till Dussehra."
            className={`${inputClass} resize-none ${errors.alt ? "border-red-300" : ""}`}
          />
          <span className="block mt-1 text-[11px] text-charcoal/45">
            Read aloud to visitors using screen readers and used by Google — it can&apos;t see text inside images.
          </span>
        </Field>

        <VisibilityFields
          startsOn={form.startsOn}
          endsOn={form.endsOn}
          published={form.published}
          errors={errors}
          onChange={(key, value) => {
            setForm((f) => ({ ...f, [key]: value }));
            setErrors((e) => ({ ...e, [key]: undefined }));
          }}
        />
      </div>

      <FormFooter
        saving={saving}
        onCancel={onClose}
        error={error}
        submitLabel={id === null ? "Add poster" : "Save changes"}
      />
    </EditorCard>
  );
}
