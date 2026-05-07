"use client";

import { useState, useEffect, useCallback } from "react";

const slides = [
  {
    id: 1,
    label: "Our Studio Space",
    sublabel: "A calm sanctuary designed for focused practice",
    gradient: "from-forest/80 via-forest-mid/70 to-sage/60",
    bg: "bg-gradient-to-br from-[#1a4731] via-[#2d6a4f] to-[#52b788]",
    icon: "🧘",
  },
  {
    id: 2,
    label: "Aerial Yoga",
    sublabel: "Defy gravity — decompress, stretch, and soar",
    bg: "bg-gradient-to-br from-[#2c3e2d] via-[#3d5c3a] to-[#6b8f5e]",
    icon: "🪢",
  },
  {
    id: 3,
    label: "Group Classes",
    sublabel: "Practice together, grow together",
    bg: "bg-gradient-to-br from-[#4a3728] via-[#6b5040] to-[#c8a882]",
    icon: "🌿",
  },
  {
    id: 4,
    label: "Pranayama & Meditation",
    sublabel: "Breath is the bridge between body and mind",
    bg: "bg-gradient-to-br from-[#1e3a2f] via-[#2d5a45] to-[#4a8a6a]",
    icon: "☁️",
  },
  {
    id: 5,
    label: "Prenatal Yoga",
    sublabel: "Nurturing wellness for mothers-to-be",
    bg: "bg-gradient-to-br from-[#3d4a2d] via-[#5a6b3a] to-[#9ab870]",
    icon: "🌸",
  },
];

export default function Carousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  const prev = () => {
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [paused, next]);

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

        {/* Carousel container */}
        <div
          className="relative rounded-3xl overflow-hidden shadow-2xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Slides */}
          <div className="relative h-[420px] md:h-[520px]">
            {slides.map((slide, i) => (
              <div
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  i === current ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                {/* Placeholder background — replace with <Image> later */}
                <div className={`w-full h-full ${slide.bg} flex items-center justify-center`}>
                  {/* Decorative texture overlay */}
                  <div className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px),
                                        radial-gradient(circle at 80% 20%, white 1px, transparent 1px)`,
                      backgroundSize: "60px 60px",
                    }}
                  />
                  {/* Placeholder content — remove once real photos are added */}
                  <div className="text-center text-white/90 z-10 px-8">
                    <div className="text-7xl mb-4 drop-shadow">{slide.icon}</div>
                    <p className="text-xs tracking-[0.25em] uppercase text-white/50 mb-3 font-medium">
                      📷 Photo placeholder — replace with real image
                    </p>
                    <h3 className="font-display text-3xl md:text-4xl font-bold mb-3 drop-shadow">
                      {slide.label}
                    </h3>
                    <p className="text-white/75 text-base md:text-lg max-w-sm mx-auto">
                      {slide.sublabel}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Prev / Next arrows */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white flex items-center justify-center transition-colors"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white flex items-center justify-center transition-colors"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === current
                    ? "w-6 h-2 bg-white"
                    : "w-2 h-2 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Slide label below */}
        <p className="text-center mt-5 text-sm text-charcoal/40 italic">
          {slides[current].label} — {slides[current].sublabel}
        </p>
      </div>
    </section>
  );
}
