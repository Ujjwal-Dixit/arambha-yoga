"use client";

import { useState } from "react";
import type { ActionResult } from "@/lib/admin/actions";
import type { PromotionStatus } from "@/lib/promotions";

/** Shared building blocks for the dashboard's managers. */

export const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-parchment bg-cream/50 text-sm text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:ring-2 focus:ring-sage/40 focus:border-sage transition";

export const STATUS: Record<PromotionStatus, { label: string; className: string }> = {
  live: { label: "Live", className: "bg-sage-light/60 text-forest" },
  scheduled: { label: "Scheduled", className: "bg-sky-50 text-sky-700" },
  expired: { label: "Expired", className: "bg-parchment text-charcoal/55" },
  draft: { label: "Draft", className: "bg-amber-50 text-amber-700" },
};

export const NETWORK_ERROR = "Couldn't reach the server. Check your connection and try again.";

/**
 * Runs a list-level action (publish, move, delete). Actions revalidate the
 * dashboard, so fresh props arrive afterwards — no local copy to sync.
 */
export function useRunner() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  async function run(action: () => Promise<ActionResult>) {
    setBusy(true);
    setError(null);
    try {
      const result = await action();
      if (!result.ok) setError(result.error);
    } catch {
      setError(NETWORK_ERROR);
    } finally {
      setBusy(false);
    }
  }
  return { busy, error, setError, run };
}

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-bold text-forest">{title}</h1>
        <p className="text-sm text-charcoal/60 mt-1.5 max-w-xl">{description}</p>
      </div>
      {action}
    </div>
  );
}

export function AddButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="shrink-0 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-forest text-white text-sm font-medium hover:bg-forest-mid transition-colors shadow-lg shadow-forest/20 disabled:opacity-60"
    >
      <span className="text-lg leading-none">+</span> {children}
    </button>
  );
}

export function ErrorNote({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      role="alert"
      className={`px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 ${className}`}
    >
      {children}
    </p>
  );
}

export function EmptyState({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-earth/40">
      <div className="text-4xl mb-3">{icon}</div>
      <p className="font-display text-xl text-forest mb-1">{title}</p>
      <p className="text-sm text-charcoal/55">{children}</p>
    </div>
  );
}

export function StatusBadge({ status }: { status: PromotionStatus }) {
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${STATUS[status].className}`}>
      {STATUS[status].label}
    </span>
  );
}

export function IconButton({
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

/** Up / down arrows that reorder a list item. */
export function ReorderButtons({
  name,
  index,
  count,
  busy,
  onMove,
}: {
  name: string;
  index: number;
  count: number;
  busy: boolean;
  onMove: (direction: "up" | "down") => void;
}) {
  return (
    <div className="flex flex-col gap-1 shrink-0">
      <IconButton label={`Move "${name}" up`} disabled={busy || index === 0} onClick={() => onMove("up")} path="M5 15l7-7 7 7" />
      <IconButton
        label={`Move "${name}" down`}
        disabled={busy || index === count - 1}
        onClick={() => onMove("down")}
        path="M19 9l-7 7-7-7"
      />
    </div>
  );
}

/** Edit / Publish / Delete links, with an inline delete confirmation. */
export function RowActions({
  noun,
  published,
  busy,
  onEdit,
  onTogglePublished,
  onDelete,
}: {
  noun: string;
  published: boolean;
  busy: boolean;
  onEdit: () => void;
  onTogglePublished: () => void;
  onDelete: () => void;
}) {
  const [confirming, setConfirming] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-3 text-sm">
      {confirming ? (
        <>
          <span className="text-red-700">Delete this {noun}?</span>
          <button
            type="button"
            disabled={busy}
            onClick={() => {
              setConfirming(false);
              onDelete();
            }}
            className="font-medium text-red-700 hover:underline disabled:opacity-50"
          >
            Yes, delete
          </button>
          <button type="button" onClick={() => setConfirming(false)} className="text-charcoal/60 hover:text-forest">
            Cancel
          </button>
        </>
      ) : (
        <>
          <button type="button" disabled={busy} onClick={onEdit} className="font-medium text-forest hover:text-sage disabled:opacity-50">
            Edit
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onTogglePublished}
            className="text-charcoal/60 hover:text-forest disabled:opacity-50"
          >
            {published ? "Unpublish" : "Publish"}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => setConfirming(true)}
            className="text-charcoal/60 hover:text-red-700 disabled:opacity-50"
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
}

/** White card that wraps an editor form. */
export function EditorCard({
  title,
  onSubmit,
  children,
}: {
  title: string;
  onSubmit: (e: React.FormEvent) => void;
  children: React.ReactNode;
}) {
  return (
    <form onSubmit={onSubmit} className="bg-white rounded-2xl border-2 border-sage/40 shadow-lg shadow-forest/5 p-5 sm:p-7">
      <h2 className="font-display text-2xl font-bold text-forest mb-6">{title}</h2>
      {children}
    </form>
  );
}

export function FormFooter({
  saving,
  onCancel,
  submitLabel,
  error,
}: {
  saving: boolean;
  onCancel?: () => void;
  submitLabel: string;
  error?: string | null;
}) {
  return (
    <>
      {error && <ErrorNote className="mt-6">{error}</ErrorNote>}
      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-7 pt-6 border-t border-parchment">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="px-6 py-2.5 rounded-full border border-parchment text-sm font-medium text-charcoal/70 hover:border-forest/30 hover:text-forest transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={saving}
          className="px-7 py-2.5 rounded-full bg-forest text-white text-sm font-medium hover:bg-forest-mid transition-colors shadow-lg shadow-forest/20 disabled:opacity-60"
        >
          {saving ? "Saving…" : submitLabel}
        </button>
      </div>
    </>
  );
}

export function Field({
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

export function Toggle({
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

/** "Show from" / "Hide after" dates plus the published toggle. */
export function VisibilityFields({
  startsOn,
  endsOn,
  published,
  errors,
  onChange,
  extra,
}: {
  startsOn: string;
  endsOn: string;
  published: boolean;
  errors: Record<string, string | undefined>;
  onChange: (key: "startsOn" | "endsOn" | "published", value: string | boolean) => void;
  extra?: React.ReactNode;
}) {
  return (
    <fieldset className="rounded-2xl bg-cream/60 border border-parchment p-4 sm:p-5 space-y-4">
      <legend className="px-1 text-xs font-semibold tracking-widest uppercase text-charcoal/50">When to show it</legend>
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Show from" hint="Leave blank to show now" error={errors.startsOn}>
          <input type="date" value={startsOn} onChange={(e) => onChange("startsOn", e.target.value)} className={inputClass} />
        </Field>
        <Field label="Hide after" hint="Leave blank to keep it up" error={errors.endsOn}>
          <input
            type="date"
            value={endsOn}
            min={startsOn || undefined}
            onChange={(e) => onChange("endsOn", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
        <Toggle
          checked={published}
          onChange={(v) => onChange("published", v)}
          label="Published"
          hint="Unpublished items are saved as drafts"
        />
        {extra}
      </div>
    </fieldset>
  );
}

export function fmtDate(date: string) {
  return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function describeWindow(p: { startsOn: string; endsOn: string }) {
  if (p.startsOn && p.endsOn) return `${fmtDate(p.startsOn)} – ${fmtDate(p.endsOn)}`;
  if (p.startsOn) return `From ${fmtDate(p.startsOn)}`;
  if (p.endsOn) return `Until ${fmtDate(p.endsOn)}`;
  return "No end date";
}
