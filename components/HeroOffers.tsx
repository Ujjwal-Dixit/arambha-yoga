"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/** A live offer poster, managed from the admin dashboard. */
export type OfferPoster = { src: string; width: number; height: number; alt: string };

const ROTATE_MS = 6000;

export default function HeroOffers({ offers }: { offers: OfferPoster[] }) {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || offers.length < 2) return;
    const id = setInterval(() => setCurrent((c) => (c + 1) % offers.length), ROTATE_MS);
    return () => clearInterval(id);
  }, [paused, offers.length]);

  if (offers.length === 0) return null;

  return (
    <div className="w-full max-w-[20rem] md:w-[17.5rem] lg:max-w-none lg:w-auto">
      {/* Sized from the screen height on desktop so it never pushes the hero
          past the fold. Posters slide rather than cross-fade: two text-heavy
          posters blended mid-fade are unreadable. Each is contained over a
          blurred copy of itself, since their shapes differ. */}
      <div
        className="relative aspect-[2/3] lg:h-[clamp(380px,calc(100svh-260px),640px)] big:h-[min(calc(100svh-300px),760px)] rounded-2xl overflow-hidden bg-cream shadow-xl shadow-forest/10 ring-1 ring-forest/10"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {offers.map((o, i) => (
            <a
              key={o.src}
              href="#enquiry"
              tabIndex={i === current ? 0 : -1}
              aria-hidden={i === current ? undefined : true}
              className="group relative w-full h-full shrink-0 overflow-hidden"
            >
              <Image
                src={o.src}
                alt=""
                aria-hidden="true"
                fill
                sizes="64px"
                className="object-cover scale-110 blur-2xl opacity-50"
              />
              <Image
                src={o.src}
                alt={o.alt}
                fill
                sizes="(max-width: 1024px) 300px, (min-width: 1800px) 520px, 380px"
                className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                priority={i === 0}
              />
            </a>
          ))}
        </div>
      </div>

      {offers.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {offers.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Show offer ${i + 1}`}
              aria-current={i === current ? "true" : undefined}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current ? "w-5 bg-forest" : "w-1.5 bg-forest/25 hover:bg-forest/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
