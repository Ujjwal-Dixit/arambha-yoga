"use client";

import { useState } from "react";
import PromotionCard from "@/components/PromotionCard";
import {
  deletePromotion,
  movePromotion,
  savePromotion,
  setPublished,
  type ActionResult,
} from "@/app/admin/actions";
import {
  EMPTY_PROMOTION,
  LIMITS,
  TAG_COLORS,
  promotionStatus,
  tagClass,
  validatePromotion,
  type PromotionInput,
  type PromotionStatus,
  type TagColor,
} from "@/lib/promotions";

export type AdminPromotion = PromotionInput & { id: number };

type FieldErrors = Partial<Record<keyof PromotionInput, string>>;

const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-parchment bg-cream/50 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage transition";

const STATUS: Record<PromotionStatus, { label: string; className: string }> = {
  live: { label: "Live", className: "bg-sage-light/60 text-forest" },
  scheduled: { label: "Scheduled", className: "bg-sky-50 text-sky-700" },
  expired: { label: "Expired", className: "bg-parchment text-charcoal/55" },
  draft: { label: "Draft", className: "bg-amber-50 text-amber-700" },
};

const ICON_SUGGESTIONS = ["🌅", "🧘", "🪢", "🎁", "⏰", "🌿", "✨", "🎉", "📅", "🌙"];

function fmt(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function describeWindow(p: { startsOn: string; endsOn: string }) {
  if (p.startsOn && p.endsOn) return `${fmt(p.startsOn)} – ${fmt(p.endsOn)}`;
  if (p.startsOn) return `From ${fmt(p.startsOn)}`;
  if (p.endsOn) return `Until ${fmt(p.endsOn)}`;
  return "No end date";
}

/* ------------------------------------------------------------------------ */

export default function PromotionsManager({
  promotions,
  today,
}: {
  promotions: AdminPromotion[];
  /** YYYY-MM-DD in IST, from the server, so statuses match what visitors see. */
  today: string;
}) {
  const [editing, setEditing] = useState<number | "new" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState<number | null>(null);

  // Server actions revalidate /admin, so `promotions` arrives fresh after each
  // one — there is no local copy of the list to keep in sync.
  async function run(action: () => Promise<ActionResult>) {
    setBusy(true);
    setError(null);
    try {
      const result = await action();
      if (!result.ok) setError(result.error);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  const counts = promotions.reduce(
    (acc, p) => {
      acc[promotionStatus(p, today)]++;
      return acc;
    },
    { live: 0, scheduled: 0, expired: 0, draft: 0 } as Record<PromotionStatus, number>
  );

  return (
    <section>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-forest">Promotions</h1>
          <p className="text-sm text-charcoal/60 mt-1.5 max-w-xl">
            Offers and events shown in the &ldquo;What&apos;s On&rdquo; strip on the home page.
            Live promotions appear in the order below.
          </p>
        </div>
        {editing !== "new" && (
          <button
            type="button"
            onClick={() => {
              setEditing("new");
              setError(null);
            }}
            disabled={busy}
            className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-forest text-white text-sm font-medium hover:bg-forest-mid transition-colors shadow-lg shadow-forest/20 disabled:opacity-60"
          >
            <span className="text-lg leading-none">+</span> New promotion
          </button>
        )}
      </div>

      {/* Summary */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.keys(STATUS) as PromotionStatus[]).map((s) => (
          <span key={s} className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS[s].className}`}>
            {counts[s]} {STATUS[s].label}
          </span>
        ))}
      </div>

      {error && (
        <p role="alert" className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </p>
      )}

      {editing === "new" && (
        <div className="mb-6">
          <PromotionEditor
            id={null}
            initial={EMPTY_PROMOTION}
            onClose={() => setEditing(null)}
          />
        </div>
      )}

      {promotions.length === 0 && editing !== "new" ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-earth/40">
          <div className="text-4xl mb-3">🌿</div>
          <p className="font-display text-xl text-forest mb-1">No promotions yet</p>
          <p className="text-sm text-charcoal/55">
            The &ldquo;What&apos;s On&rdquo; strip stays hidden until something is live.
          </p>
        </div>
      ) : (
        <ul className="space-y-3">
          {promotions.map((p, i) => {
            if (editing === p.id) {
              return (
                <li key={p.id}>
                  <PromotionEditor id={p.id} initial={p} onClose={() => setEditing(null)} />
                </li>
              );
            }
            const status = promotionStatus(p, today);
            return (
              <li
                key={p.id}
                className={`bg-white rounded-2xl border border-parchment p-4 sm:p-5 flex gap-4 ${
                  status === "live" ? "" : "opacity-80"
                }`}
              >
                {/* Reorder */}
                <div className="flex flex-col gap-1 shrink-0">
                  <IconButton
                    label={`Move "${p.title}" up`}
                    disabled={busy || i === 0}
                    onClick={() => run(() => movePromotion(p.id, "up"))}
                    path="M5 15l7-7 7 7"
                  />
                  <IconButton
                    label={`Move "${p.title}" down`}
                    disabled={busy || i === promotions.length - 1}
                    onClick={() => run(() => movePromotion(p.id, "down"))}
                    path="M19 9l-7 7-7-7"
                  />
                </div>

                <div className="text-2xl shrink-0 w-8 text-center pt-0.5" aria-hidden="true">
                  {p.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="font-display font-semibold text-forest text-lg leading-snug">
                      {p.title}
                    </h2>
                    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS[status].className}`}>
                      {STATUS[status].label}
                    </span>
                    {p.highlight && (
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-sage text-forest-mid">
                        Highlighted
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-charcoal/55 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${tagClass(p.tagColor)}`}>
                      {p.tag}
                    </span>
                    <span>Shown: {describeWindow(p)}</span>
                  </p>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm">
                    {confirmingDelete === p.id ? (
                      <>
                        <span className="text-red-700">Delete this promotion?</span>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() =>
                            run(async () => {
                              const r = await deletePromotion(p.id);
                              setConfirmingDelete(null);
                              return r;
                            })
                          }
                          className="font-medium text-red-700 hover:underline disabled:opacity-50"
                        >
                          Yes, delete
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmingDelete(null)}
                          className="text-charcoal/60 hover:text-forest"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => {
                            setEditing(p.id);
                            setError(null);
                          }}
                          className="font-medium text-forest hover:text-sage disabled:opacity-50"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => run(() => setPublished(p.id, !p.published))}
                          className="text-charcoal/60 hover:text-forest disabled:opacity-50"
                        >
                          {p.published ? "Unpublish" : "Publish"}
                        </button>
                        <button
                          type="button"
                          disabled={busy}
                          onClick={() => setConfirmingDelete(p.id)}
                          className="text-charcoal/60 hover:text-red-700 disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function IconButton({
  label,
  path,
  onClick,
  disabled,
}: {
  label: string;
  path: string;
  onClick: () => void;
  disabled: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className="w-7 h-7 rounded-lg border border-parchment text-forest flex items-center justify-center hover:bg-cream transition-colors disabled:opacity-30 disabled:pointer-events-none"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
      </svg>
    </button>
  );
}

/* ------------------------------------------------------------------------ */

function PromotionEditor({
  id,
  initial,
  onClose,
}: {
  id: number | null;
  initial: PromotionInput;
  onClose: () => void;
}) {
  const [form, setForm] = useState<PromotionInput>({
    tag: initial.tag,
    tagColor: initial.tagColor,
    title: initial.title,
    description: initial.description,
    dateText: initial.dateText,
    timeText: initial.timeText,
    icon: initial.icon,
    highlight: initial.highlight,
    published: initial.published,
    startsOn: initial.startsOn,
    endsOn: initial.endsOn,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  function set<K extends keyof PromotionInput>(key: K, value: PromotionInput[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const check = validatePromotion(form);
    if (!check.ok) {
      setErrors(check.errors);
      return;
    }

    setSaving(true);
    try {
      const result = await savePromotion(id, form);
      if (result.ok) {
        onClose();
        return;
      }
      setError(result.error);
      if (result.errors) setErrors(result.errors);
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  }

  const text = (key: keyof typeof LIMITS) => ({
    value: form[key],
    maxLength: LIMITS[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(key, e.target.value),
    className: `${inputClass} ${errors[key] ? "border-red-300" : ""}`,
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border-2 border-sage/40 shadow-lg shadow-forest/5 p-5 sm:p-7"
    >
      <h2 className="font-display text-2xl font-bold text-forest mb-6">
        {id === null ? "New promotion" : "Edit promotion"}
      </h2>

      <div className="grid lg:grid-cols-[1fr_260px] gap-8">
        <div className="space-y-5">
          <Field label="Title" error={errors.title}>
            <input {...text("title")} placeholder="e.g. Morning Flow — November Batch" />
          </Field>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Tag" hint="The small label on the card" error={errors.tag}>
              <input {...text("tag")} placeholder="e.g. New Batch" />
            </Field>
            <Field label="Tag colour" error={errors.tagColor} group>
              <div className="flex flex-wrap gap-2 pt-1">
                {(Object.keys(TAG_COLORS) as TagColor[]).map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => set("tagColor", c)}
                    aria-pressed={form.tagColor === c}
                    className={`text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full ${TAG_COLORS[c].className} ${
                      form.tagColor === c ? "ring-2 ring-offset-2 ring-forest" : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    {TAG_COLORS[c].label}
                  </button>
                ))}
              </div>
            </Field>
          </div>

          <Field
            label="Description"
            hint={`${form.description.length}/${LIMITS.description}`}
            error={errors.description}
          >
            <textarea {...text("description")} rows={3} className={`${text("description").className} resize-none`} placeholder="One or two short sentences." />
          </Field>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Date line" hint="Shown next to the calendar icon" error={errors.dateText}>
              <input {...text("dateText")} placeholder="e.g. Starts 5 Nov 2026" />
            </Field>
            <Field label="Time line" hint="Shown next to the clock icon" error={errors.timeText}>
              <input {...text("timeText")} placeholder="e.g. 6:30 AM – 7:30 AM" />
            </Field>
          </div>

          <Field label="Icon" hint="An emoji" error={errors.icon} group>
            <div className="flex flex-wrap items-center gap-2">
              <input
                {...text("icon")}
                aria-label="Icon"
                className={`${text("icon").className.replace("w-full", "w-20")} text-center text-lg`}
              />
              {ICON_SUGGESTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => set("icon", emoji)}
                  aria-label={`Use ${emoji}`}
                  className={`w-9 h-9 rounded-lg text-lg hover:bg-cream transition-colors ${form.icon === emoji ? "bg-sage-light/50" : ""}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </Field>

          {/* Visibility */}
          <fieldset className="rounded-2xl bg-cream/60 border border-parchment p-4 sm:p-5 space-y-4">
            <legend className="px-1 text-xs font-semibold tracking-widest uppercase text-charcoal/50">
              When to show it
            </legend>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="Show from" hint="Leave blank to show now" error={errors.startsOn}>
                <input type="date" value={form.startsOn} onChange={(e) => set("startsOn", e.target.value)} className={inputClass} />
              </Field>
              <Field label="Hide after" hint="Leave blank to keep it up" error={errors.endsOn}>
                <input type="date" value={form.endsOn} min={form.startsOn || undefined} onChange={(e) => set("endsOn", e.target.value)} className={inputClass} />
              </Field>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
              <Toggle checked={form.published} onChange={(v) => set("published", v)} label="Published" hint="Unpublished promotions are saved as drafts" />
              <Toggle checked={form.highlight} onChange={(v) => set("highlight", v)} label="Highlight" hint="Green border to draw the eye" />
            </div>
          </fieldset>
        </div>

        {/* Live preview */}
        <div>
          <p className="text-xs font-semibold tracking-widest uppercase text-charcoal/40 mb-3">Preview</p>
          <div className="lg:sticky lg:top-24 max-w-[260px] pointer-events-none">
            <PromotionCard
              promotion={{
                ...form,
                tag: form.tag || "Tag",
                title: form.title || "Promotion title",
                description: form.description || "A short description of the offer or event.",
                dateText: form.dateText || "Date",
                timeText: form.timeText || "Time",
              }}
            />
          </div>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-7 pt-6 border-t border-parchment">
        <button
          type="button"
          onClick={onClose}
          disabled={saving}
          className="px-6 py-2.5 rounded-full border border-parchment text-sm font-medium text-charcoal/70 hover:border-forest/30 hover:text-forest transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-7 py-2.5 rounded-full bg-forest text-white text-sm font-medium hover:bg-forest-mid transition-colors shadow-lg shadow-forest/20 disabled:opacity-60"
        >
          {saving ? "Saving…" : id === null ? "Create promotion" : "Save changes"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  error,
  group = false,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  /** Several controls rather than one input — render a group, not a <label>,
   *  so clicking the caption doesn't activate the first button inside. */
  group?: boolean;
  children: React.ReactNode;
}) {
  const Wrapper = group ? "div" : "label";
  return (
    <Wrapper className="block" role={group ? "group" : undefined} aria-label={group ? label : undefined}>
      <span className="flex items-baseline justify-between gap-3 mb-1.5">
        <span className="text-xs font-medium text-forest">{label}</span>
        {hint && <span className="text-[11px] text-charcoal/40">{hint}</span>}
      </span>
      {children}
      {error && <span className="block mt-1 text-xs text-red-600">{error}</span>}
    </Wrapper>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
  hint: string;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 w-4 h-4 accent-forest"
      />
      <span>
        <span className="block text-sm font-medium text-forest">{label}</span>
        <span className="block text-xs text-charcoal/50">{hint}</span>
      </span>
    </label>
  );
}
