"use client";

import { useState } from "react";
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
import { deleteReview, moveReview, saveReview, setReviewPublished } from "@/app/admin/content-actions";
import { EMPTY_REVIEW, REVIEW_LIMITS, validateReview, type ReviewInput } from "@/lib/content";

export type AdminReview = ReviewInput & { id: number };

export default function ReviewsManager({ reviews }: { reviews: AdminReview[] }) {
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const { busy, error, setError, run } = useRunner();

  return (
    <section>
      <PageHeader
        title="Reviews"
        description={
          <>
            Student reviews in &ldquo;Voices from Our Community&rdquo; on the home page, shown in the order below.
            Copy them word for word from Google.
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
              Add review
            </AddButton>
          )
        }
      />

      {error && <ErrorNote className="mb-5">{error}</ErrorNote>}

      {editing === "new" && (
        <div className="mb-6">
          <ReviewEditor id={null} initial={EMPTY_REVIEW} onClose={() => setEditing(null)} />
        </div>
      )}

      {reviews.length === 0 && editing !== "new" ? (
        <EmptyState icon="💬" title="No reviews yet">
          The reviews section stays hidden until one is published.
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {reviews.map((r, i) => {
            if (editing === r.id) {
              return (
                <li key={r.id}>
                  <ReviewEditor id={r.id} initial={r} onClose={() => setEditing(null)} />
                </li>
              );
            }
            return (
              <li
                key={r.id}
                className={`bg-white rounded-2xl border border-parchment p-4 sm:p-5 flex gap-4 ${r.published ? "" : "opacity-80"}`}
              >
                <ReorderButtons
                  name={r.name}
                  index={i}
                  count={reviews.length}
                  busy={busy}
                  onMove={(d) => run(() => moveReview(r.id, d))}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="font-semibold text-forest">{r.name}</h2>
                    {r.context && <span className="text-xs text-charcoal/50">{r.context}</span>}
                    <StatusBadge status={r.published ? "live" : "draft"} />
                  </div>
                  <p className="text-sm text-charcoal/70 line-clamp-2">{r.quote}</p>
                  <RowActions
                    noun="review"
                    published={r.published}
                    busy={busy}
                    onEdit={() => {
                      setEditing(r.id);
                      setError(null);
                    }}
                    onTogglePublished={() => run(() => setReviewPublished(r.id, !r.published))}
                    onDelete={() => run(() => deleteReview(r.id))}
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

function ReviewEditor({ id, initial, onClose }: { id: number | null; initial: ReviewInput; onClose: () => void }) {
  const [form, setForm] = useState<ReviewInput>({ ...initial });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof ReviewInput>(key: K, value: ReviewInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const check = validateReview(form);
    if (!check.ok) {
      setErrors(check.errors);
      return;
    }
    setSaving(true);
    try {
      const result = await saveReview(id, form);
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
    <EditorCard title={id === null ? "Add a review" : "Edit review"} onSubmit={handleSubmit}>
      <div className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <Field label="Name" error={errors.name}>
            <input
              value={form.name}
              maxLength={REVIEW_LIMITS.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="As shown on Google"
              className={`${inputClass} ${errors.name ? "border-red-300" : ""}`}
            />
          </Field>
          <Field label="Detail under the name" hint="Optional" error={errors.context}>
            <input
              value={form.context}
              maxLength={REVIEW_LIMITS.context}
              onChange={(e) => set("context", e.target.value)}
              placeholder="e.g. Beginner, Postnatal practice"
              className={`${inputClass} ${errors.context ? "border-red-300" : ""}`}
            />
          </Field>
        </div>

        <Field label="Review" hint={`${form.quote.length}/${REVIEW_LIMITS.quote}`} error={errors.quote}>
          <textarea
            value={form.quote}
            maxLength={REVIEW_LIMITS.quote}
            rows={6}
            onChange={(e) => set("quote", e.target.value)}
            placeholder="Paste the full review text from Google."
            className={`${inputClass} resize-y ${errors.quote ? "border-red-300" : ""}`}
          />
          <span className="block mt-1 text-[11px] text-charcoal/45">
            Long reviews show the first few lines with a &ldquo;Read more&rdquo; link.
          </span>
        </Field>

        <Toggle
          checked={form.published}
          onChange={(v) => set("published", v)}
          label="Published"
          hint="Unpublished reviews stay here but don't appear on the site"
        />
      </div>

      <FormFooter saving={saving} onCancel={onClose} error={error} submitLabel={id === null ? "Add review" : "Save changes"} />
    </EditorCard>
  );
}
