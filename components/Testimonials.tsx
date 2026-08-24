"use client";

import { useState, useEffect } from "react";

// Real Google reviews for Arambha Yoga & Wellness.
// Entries marked ABRIDGED were truncated by Google's "… More" link in the
// source screenshots — only the visible text is reproduced here, trimmed to the
// last complete sentence. Paste the full text from Google to complete them.

type Testimonial = {
  name: string;
  initials: string;
  color: string;
  context?: string;
  quote: string;
};

const testimonials: Testimonial[] = [
  {
    name: "Sandeepa Kasaraneni",
    initials: "SK",
    color: "bg-sage/20 text-forest",
    context: "Beginner",
    quote:
      "I joined Arambha Yoga & Wellness as a beginner. I'm blown away by Giri sir's yoga training! He brings a fresh vibe to every session, and his encouragement to push past our limits is just what is needed. I was skeptical at first, thinking yoga was all about slow movements, but he's shown me that it's actually about growth through challenge. As a newbie, I still get stuck in some poses, but his no-pressure approach keeps me coming back for more. Now, I'm hooked on his morning classes — they're the perfect way to kickstart my day! Highly recommend to have positive energy in you!",
  },
  {
    name: "Bhargavi Boppana",
    initials: "BB",
    color: "bg-earth/30 text-earth-dark",
    // ABRIDGED
    quote:
      "I have been training at Arambha Yoga Studio for the past 20 days, and it has been such a positive experience. Giri Sir is extremely patient and gives individual attention to everyone, carefully correcting our posture and form.",
  },
  {
    name: "Shravya Anchuru",
    initials: "SA",
    color: "bg-forest/10 text-forest",
    context: "Postnatal practice",
    quote:
      "I joined Arambha Yoga & Wellness during my postpartum, and it has truly made a positive difference in my recovery and overall lifestyle. Under the guidance of Giri Sir, I've experienced a wonderful improvement in strength, flexibility, and mental well-being. The sessions are thoughtfully planned, focusing on gentle yet effective practices that suit every individual's pace. Giri Sir's patience, knowledge, and personalized attention have helped me rebuild my confidence and energy after delivery. I feel more balanced, calm, and active now — and yoga has become an important part of my daily life. Highly recommended to all new moms and anyone seeking mindful wellness.",
  },
  {
    name: "Ravi L",
    initials: "RL",
    color: "bg-sage-light/40 text-forest-mid",
    // ABRIDGED
    quote:
      "I am having an amazing experience at Arambha Yoga & Wellness! From the moment I walked in, I felt a beautiful sense of calm and care. A special thanks to Yoga guru Mr. Giri.",
  },
  {
    name: "Padmaja Doddi",
    initials: "PD",
    color: "bg-parchment text-earth-dark",
    context: "9 months practising",
    quote:
      "It's more than 9 months I'm taking classes provided by Giri sir and they're really commendable and worth it — it makes me motivated to come on my mat and go for classes regularly. When a guru puts his efforts, why not the student too? That's what made me push my boundaries and be regular to his classes. The best part about the classes here is the unique workout format, so well designed that it never makes you feel bored. Thank you sir for motivating me to come for classes regularly — I genuinely feel like I'm giving 1 hr daily in my life to myself with no regrets.",
  },
  {
    name: "Gopinath Samal",
    initials: "GS",
    color: "bg-forest/10 text-forest",
    context: "Beginner",
    // ABRIDGED
    quote:
      "As a beginner, I had a wonderful learning experience. The instructors are knowledgeable, patient, and supportive, creating a comfortable environment to learn and grow. I highly recommend this institution to anyone beginning their yoga journey.",
  },
  {
    name: "Sarbani Bhattacharjee",
    initials: "SB",
    color: "bg-sage/20 text-forest",
    context: "Beginner",
    quote:
      "Training with Mr. Giri has truly changed my view of yoga. He brings something new to every session and pushes us just enough to step out of our comfort zone. I used to think yoga was slow, but he showed me that real progress comes when you challenge yourself. As a beginner, I still struggle with some postures, but he encourages me to keep trying without pressure. I now look forward to my morning classes so much that I travel every day from Financial District to Arambha just to attend. Truly worth it! Highly recommended!",
  },
  {
    name: "Manish",
    initials: "M",
    color: "bg-earth/30 text-earth-dark",
    // ABRIDGED
    quote:
      "I joined Arambha Yoga & Wellness just a month ago, and I already can't imagine my mornings without it. From day one, the environment felt calm, welcoming, and completely judgment-free.",
  },
  {
    name: "Rohit Kashyap",
    initials: "RK",
    color: "bg-sage-light/40 text-forest-mid",
    // ABRIDGED
    quote:
      "I joined Arambha for best teachers and flexible timing. The flexible timing at Arambha is perfect for my unpredictable work schedule. They offer early morning, evening, and weekend sessions.",
  },
  {
    name: "Satya Chaitanya",
    initials: "SC",
    color: "bg-parchment text-earth-dark",
    context: "Local Guide",
    // ABRIDGED
    quote:
      "I joined a month ago and it has been a wonderful experience. The instructor is really good, using a beautiful combination of Hatha, Vinyasa, Ashtanga-Power, and Restorative yoga.",
  },
];

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

export default function Testimonials() {
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

  const maxIndex = Math.max(0, testimonials.length - perView);
  // Clamp during render rather than in an effect: a resize that shrinks the
  // track can never leave the carousel scrolled past the last card.
  const active = Math.min(index, maxIndex);

  const prev = () => setIndex(Math.max(0, active - 1));
  const next = () => setIndex(Math.min(maxIndex, active + 1));

  return (
    <section className="py-12 md:py-20 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
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
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="shrink-0 w-full sm:w-1/2 lg:w-1/3 px-3"
                >
                  <figure className="h-full flex flex-col bg-white rounded-2xl p-7 border border-parchment shadow-sm">
                    <figcaption className="flex items-center gap-3 mb-4">
                      <div
                        className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${t.color}`}
                        aria-hidden="true"
                      >
                        {t.initials}
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
                      <span className="text-[10px] font-semibold tracking-widest uppercase text-charcoal/30">
                        Google Review
                      </span>
                    </div>

                    <blockquote className="flex-1 text-[15px] text-charcoal/70 leading-relaxed">
                      {t.quote}
                    </blockquote>
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
