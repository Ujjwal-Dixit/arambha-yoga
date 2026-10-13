"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

/** A gallery photo, managed from the admin dashboard. */
export type GallerySlide = { src: string; width: number; height: number; caption: string };

export default function Carousel({ slides }: { slides: GallerySlide[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = slides.length;
  const next = useCallback(() => setCurrent((c) => (c + 1) % count), [count]);
  const prev = () => setCurrent((c) => (c - 1 + count) % count);

  useEffect(() => {
    if (paused || count < 2) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next, count]);

  // Every slide sits in the same box, so lazy loading can't help — the browser
  // would fetch every photo at once. Mount only the neighbours instead, which still
  // leaves both sides of a fade present.
  const nearCurrent = (i: number) => {
    const raw = Math.abs(i - current);
    return Math.min(raw, count - raw) <= 1;
  };

  // Nothing published yet: leave the section out.
  if (count === 0) return null;

  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-10">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-sage mb-3">
            Gallery
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-forest leading-tight mb-4">
            Life at Arambha
          </h2>
          <p className="text-charcoal/60 max-w-md mx-auto">
            A glimpse into our space, our practice, and our community.
          </p>
        </div>

        {/* Carousel */}
        <div
          className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl bg-forest-dark"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Scales with the screen height so the whole frame fits on a laptop,
              up to 600px on taller displays. */}
          <div className="relative h-[460px] md:h-[clamp(23.75rem,calc(100svh-23.125rem),37.5rem)]">
            {slides.map((slide, i) => (
              <div
                key={slide.src}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === current ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                {nearCurrent(i) && (
                  <>
                    {/* Most of these are phone photos, so a portrait image in a
                        landscape frame is the norm. Contain the photo and fill
                        the gaps with a blurred copy rather than cropping faces. */}
                    <Image
                      src={slide.src}
                      alt=""
                      aria-hidden="true"
                      fill
                      sizes="64px"
                      className="object-cover scale-110 blur-2xl opacity-60"
                    />
                    <Image
                      src={slide.src}
                      alt={slide.caption}
                      fill
                      sizes="(max-width: 768px) 100vw, 640px"
                      className="object-contain"
                      priority={i === 0}
                    />
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Prev / Next arrows */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white flex items-center justify-center transition-colors"
            aria-label="Previous photo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white flex items-center justify-center transition-colors"
            aria-label="Next photo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-1.5 px-6">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to photo ${i + 1}`}
                aria-current={i === current ? "true" : undefined}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Caption */}
        <p className="text-center mt-5 text-sm text-charcoal/50 italic">
          {slides[current].caption}
        </p>
      </div>
    </section>
  );
}
