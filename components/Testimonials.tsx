"use client";

import { useState, useEffect } from "react";

/** A student review, copied from Google and managed from the admin dashboard. */
export type Review = { name: string; context: string; quote: string };

// Avatar colours, assigned in turn so neighbouring cards differ.
const AVATAR_COLORS = [
  "bg-sage/20 text-forest",
  "bg-earth/30 text-earth-dark",
  "bg-forest/10 text-forest",
  "bg-sage-light/40 text-forest-mid",
  "bg-parchment text-earth-dark",
];

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const letters = parts.length > 1 ? parts[0][0] + parts[parts.length - 1][0] : (parts[0] ?? "?")[0];
  return letters.toUpperCase();
}

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function Arrow({
  dir,
  onClick,
  disabled,
}: {
  dir: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
}) {
  const next = dir === "next";
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={next ? "Next reviews" : "Previous reviews"}
      className={`absolute top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white border border-parchment shadow-md flex items-center justify-center text-forest transition-all
        hover:bg-forest hover:text-white hover:border-forest
        disabled:opacity-0 disabled:pointer-events-none
        ${next ? "right-0 translate-x-1/2" : "left-0 -translate-x-1/2"}`}
    >
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d={next ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"}
        />
      </svg>
    </button>
  );
}

// Long reviews are clamped so one essay-length review doesn't stretch every
// card in the row to fill the screen.
const CLAMP_AFTER = 260;

function Quote({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const long = text.length > CLAMP_AFTER;

  return (
    <div className="flex-1">
      <blockquote
        className={`text-[0.9375rem] text-charcoal/70 leading-relaxed ${
          long && !open ? "line-clamp-6" : ""
        }`}
      >
        {text}
      </blockquote>
      {long && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="mt-2 text-sm font-medium text-forest hover:text-sage transition-colors"
        >
          {open ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
}

export default function Testimonials({ reviews }: { reviews: Review[] }) {
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(3);

  // Card widths are pure CSS; perView only drives the slide distance, so there
  // is no layout flash before hydration (index 0 means no transform anyway).
  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      setPerView(w >= 1024 ? 3 : w >= 640 ? 2 : 1);
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const maxIndex = Math.max(0, reviews.length - perView);
  // Clamp during render rather than in an effect: a resize that shrinks the
  // track can never leave the carousel scrolled past the last card.
  const active = Math.min(index, maxIndex);

  const prev = () => setIndex(Math.max(0, active - 1));
  const next = () => setIndex(Math.min(maxIndex, active + 1));

  // Nothing published yet: leave the section out.
  if (reviews.length === 0) return null;

  return (
    <section className="py-12 md:py-16 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-sage mb-3">
            What Our Students Say
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-forest leading-tight mb-4">
            Voices from Our Community
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative">
          <Arrow dir="prev" onClick={prev} disabled={active === 0} />
          <Arrow dir="next" onClick={next} disabled={active >= maxIndex} />

          <div className="overflow-hidden">
            {/* One flex row holds every card, so all of them stretch to the
                tallest — the carousel height never jumps between slides. */}
            <div
              className="flex -mx-3 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${active * (100 / perView)}%)` }}
            >
              {reviews.map((t, i) => (
                <div
                  key={`${i}-${t.name}`}
                  className="shrink-0 w-full sm:w-1/2 lg:w-1/3 px-3"
                >
                  <figure className="h-full flex flex-col bg-white rounded-2xl p-7 border border-parchment shadow-sm">
                    <figcaption className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
                        aria-hidden="true"
                      >
                        {initials(t.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-forest text-sm truncate">
                          {t.name}
                        </p>
                        {t.context && (
                          <p className="text-xs text-charcoal/50 truncate">
                            {t.context}
                          </p>
                        )}
                      </div>
                    </figcaption>

                    <div className="flex items-center justify-between gap-3 pb-5 mb-5 border-b border-parchment">
                      <Stars />
                      <span className="text-[0.625rem] font-semibold tracking-widest uppercase text-charcoal/30">
                        Google Review
                      </span>
                    </div>

                    <Quote text={t.quote} />
                  </figure>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Go to review ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active
                  ? "w-6 bg-forest"
                  : "w-2 bg-forest/20 hover:bg-forest/40"
              }`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-charcoal/50 text-sm mb-4">
            Ready to write your own story?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-forest text-white font-medium hover:bg-forest-mid transition-colors shadow-lg shadow-forest/20"
          >
            Start Your Journey Today
          </a>
        </div>
      </div>
    </section>
  );
}
