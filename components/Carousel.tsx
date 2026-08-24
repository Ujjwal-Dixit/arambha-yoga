"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const slides = [
  { src: "/gallery/01-community.jpg",        caption: "The Arambha family, after aerial practice" },
  { src: "/gallery/02-namaste.jpg",          caption: "Beginning together at the mandala wall" },
  { src: "/gallery/03-seniors.jpg",          caption: "Yoga at every age — special classes for seniors" },
  { src: "/gallery/04-mat-practice.jpg",     caption: "Guided mat practice" },
  { src: "/gallery/05-partner.jpg",          caption: "Partner practice, side by side" },
  { src: "/gallery/06-stick-yoga.jpg",       caption: "Stick Yoga — building posture and symmetry" },
  { src: "/gallery/07-aerial-guided.jpg",    caption: "Aerial inversions, safely guided" },
  { src: "/gallery/08-acro.jpg",             caption: "Acro Yoga — trust and balance" },
  { src: "/gallery/09-aerial-inversion.jpg", caption: "Finding weightlessness in the silks" },
  { src: "/gallery/10-aerial-headstand.jpg", caption: "Aerial headstand practice" },
  { src: "/gallery/11-sirsasana.jpg",        caption: "Sirsasana at the mandala wall" },
  { src: "/gallery/12-aerial-backbend.jpg",  caption: "Opening the spine in the hammock" },
  { src: "/gallery/13-graduation.jpg",       caption: "Teacher training graduation day" },
  { src: "/gallery/14-headstand-class.jpg",  caption: "Learning by watching" },
  { src: "/gallery/15-aerial-blue.jpg",      caption: "Upside down, wide awake" },
  { src: "/gallery/16-cycling.jpg",          caption: "Beyond the mat — a community ride" },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [paused, next]);

  // Every slide sits in the same box, so lazy loading can't help — the browser
  // would fetch all 16 at once. Mount only the neighbours instead, which still
  // leaves both sides of a fade present.
  const nearCurrent = (i: number) => {
    const raw = Math.abs(i - current);
    return Math.min(raw, slides.length - raw) <= 1;
  };

  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
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
          <div className="relative h-[460px] md:h-[600px]">
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
