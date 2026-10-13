"use client";

import { useState } from "react";
import { saveSchedule } from "@/app/admin/content-actions";
import { ErrorNote, NETWORK_ERROR, PageHeader, inputClass } from "@/components/admin/ui";
import { validateSchedule } from "@/lib/content";
import {
  DAY_LABELS,
  DAY_TYPES,
  MAX_SLOTS_PER_DAY,
  formatSlot,
  isValidTime,
  type DayType,
  type Schedule,
} from "@/lib/schedule";

export default function TimetableEditor({ schedule }: { schedule: Schedule }) {
  const [draft, setDraft] = useState<Schedule>(schedule);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const dirty = DAY_TYPES.some((d) => draft[d].join() !== schedule[d].join());

  function update(day: DayType, times: string[]) {
    setDraft((s) => ({ ...s, [day]: [...new Set(times)].sort() }));
    setSaved(false);
  }

  async function save() {
    setError(null);
    const check = validateSchedule(draft);
    if (!check.ok) {
      setError(Object.values(check.errors)[0]);
      return;
    }
    setSaving(true);
    try {
      const result = await saveSchedule(check.data);
      if (result.ok) setSaved(true);
      else setError(result.error);
    } catch {
      setError(NETWORK_ERROR);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <PageHeader
        title="Class Timings"
        description="The time slots visitors can pick on the enquiry form. A day with no slots shows “No classes” on the form."
      />

      <div className="grid md:grid-cols-3 gap-4">
        {DAY_TYPES.map((day) => (
          <DayCard key={day} day={day} times={draft[day]} onChange={(t) => update(day, t)} />
        ))}
      </div>

      {error && <ErrorNote className="mt-6">{error}</ErrorNote>}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3 mt-7 pt-6 border-t border-parchment">
        {saved && !dirty && <p className="text-sm text-forest-mid sm:mr-auto">✓ Saved — the enquiry form is updated.</p>}
        {dirty && <p className="text-sm text-amber-700 sm:mr-auto">You have unsaved changes.</p>}
        {dirty && (
          <button
            type="button"
            onClick={() => {
              setDraft(schedule);
              setError(null);
            }}
            disabled={saving}
            className="px-6 py-2.5 rounded-full border border-parchment text-sm font-medium text-charcoal/70 hover:border-forest/30 hover:text-forest transition-colors"
          >
            Discard changes
          </button>
        )}
        <button
          type="button"
          onClick={save}
          disabled={saving || !dirty}
          className="px-7 py-2.5 rounded-full bg-forest text-white text-sm font-medium hover:bg-forest-mid transition-colors shadow-lg shadow-forest/20 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save timings"}
        </button>
      </div>
    </section>
  );
}

function DayCard({ day, times, onChange }: { day: DayType; times: string[]; onChange: (times: string[]) => void }) {
  const [adding, setAdding] = useState("");
  const full = times.length >= MAX_SLOTS_PER_DAY;

  function add() {
    if (!isValidTime(adding) || full) return;
    onChange([...times, adding]);
    setAdding("");
  }

  return (
    <div className="bg-white rounded-2xl border border-parchment p-5">
      <h2 className="font-display text-lg font-semibold text-forest mb-1">{DAY_LABELS[day]}</h2>
      <p className="text-xs text-charcoal/50 mb-4">
        {times.length === 0 ? "Closed — no classes" : `${times.length} slot${times.length === 1 ? "" : "s"}`}
      </p>

      <ul className="flex flex-wrap gap-2 mb-4 min-h-9">
        {times.map((t) => (
          <li
            key={t}
            className="inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full bg-sage-light/40 text-sm text-forest"
          >
            {formatSlot(t)}
            <button
              type="button"
              onClick={() => onChange(times.filter((x) => x !== t))}
              aria-label={`Remove ${formatSlot(t)} on ${DAY_LABELS[day]}`}
              className="w-5 h-5 rounded-full text-forest/60 hover:bg-white hover:text-red-700 flex items-center justify-center"
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <input
          type="time"
          value={adding}
          onChange={(e) => setAdding(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          aria-label={`New slot for ${DAY_LABELS[day]}`}
          className={inputClass}
        />
        <button
          type="button"
          onClick={add}
          disabled={!isValidTime(adding) || full}
          className="shrink-0 px-4 rounded-xl border border-forest/30 text-sm font-medium text-forest hover:bg-forest hover:text-white transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          Add
        </button>
      </div>
    </div>
  );
}
