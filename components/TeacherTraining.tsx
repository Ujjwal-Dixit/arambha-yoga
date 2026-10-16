import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

const curriculum = [
  {
    n: "01",
    title: "Techniques, Training & Practice",
    desc: "Asana, pranayama, kriyas, chanting, mantra and meditation — practised in depth, then broken down so you can teach each one with clarity and confidence.",
  },
  {
    n: "02",
    title: "Anatomy & Physiology",
    desc: "Physical and energetic anatomy: biomechanics of movement, safe alignment, common contraindications, and how to adapt a practice to the body in front of you.",
  },
  {
    n: "03",
    title: "Yoga Humanities",
    desc: "History, philosophy and lineage — including study of the Yoga Sutras and the ethical foundations that give the practice its depth and direction.",
  },
  {
    n: "04",
    title: "Professional Essentials",
    desc: "Teaching methodology, sequencing, cueing and demonstration, class management, scope of practice, and the professional side of building a teaching career.",
  },
  {
    n: "05",
    title: "Practicum",
    desc: "Supervised practice teaching with structured observation and feedback, so you graduate having already taught — not just studied.",
  },
];

const audience = [
  {
    icon: "🎓",
    title: "Aspiring Teachers",
    desc: "Anyone ready to teach professionally and register with Yoga Alliance as an RYT 200.",
  },
  {
    icon: "🌱",
    title: "Dedicated Practitioners",
    desc: "Students who want to deepen their own practice and understanding, with no obligation to teach.",
  },
  {
    icon: "🧭",
    title: "Career Changers",
    desc: "Those moving into wellness and looking for a credible, internationally recognised foundation.",
  },
];

// Batch details. An entry with an href renders its value as a link.
const details: { label: string; value: string; href?: string }[] = [
  { label: "Book Your Batch", value: "Reserve your seat →", href: "/#enquiry" },
  { label: "Duration", value: "200 hrs (50 days)" },
  { label: "Mode", value: "Online / Offline" },
  { label: "Batch Size", value: "Limited seats" },
];

export default function TeacherTraining() {
  return (
    <>
      {/* Overview */}
      <section className="pt-8 pb-10 md:pt-10 md:pb-12 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-[3fr_2fr] gap-10 md:gap-12 items-center md:items-stretch">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] uppercase text-sage mb-3">
                The Programme
              </p>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-forest leading-tight mb-5">
                200-Hour Yoga Teacher Training
              </h2>
              <div className="space-y-3 text-charcoal/70 leading-relaxed">
                <p>
                  Our 200-hour programme is the foundation of a teaching
                  practice — a complete grounding in technique, anatomy,
                  philosophy and the craft of holding a room.
                </p>
                <p>
                  It is designed and led by teachers who train teachers. The
                  curriculum blends traditional yogic study with modern anatomy
                  and psychology, and every module is built to be practical:
                  you learn it, you practise it, then you teach it.
                </p>
                <p>
                  Graduates are eligible to register with Yoga Alliance as a
                  Registered Yoga Teacher (RYT&nbsp;200).
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-sage-light/30 text-forest-mid border border-sage/25">
                  200 Hours
                </span>
                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-sage-light/30 text-forest-mid border border-sage/25">
                  Registered Yoga School
                </span>
                <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-sage-light/30 text-forest-mid border border-sage/25">
                  All Levels Welcome
                </span>
              </div>
            </div>

            {/* Centre photo — on wider screens it matches the text column's
                height so the whole overview fits above the fold on laptops. */}
            <div className="relative w-full max-w-[22.5rem] aspect-[7/8] md:aspect-auto md:min-h-[20rem] mx-auto rounded-2xl overflow-hidden bg-parchment">
              <Image
                src="/teacher-training.jpg"
                alt="A teacher adjusting students in three-legged downward dog during a class at Arambha Yoga & Wellness"
                fill
                sizes="(max-width: 480px) 100vw, 360px"
                className="object-cover object-[center_45%]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Details + faculty */}
      <section className="py-12 md:py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 lg:items-center gap-10 lg:gap-16">
          <div>
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-sage mb-3">
              Course Details
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-forest leading-tight mb-6">
              At a Glance
            </h2>
            <dl className="bg-white rounded-2xl border border-parchment shadow-sm divide-y divide-parchment">
              {details.map((d) => (
                <div
                  key={d.label}
                  className="flex items-center justify-between gap-4 px-5 py-3.5"
                >
                  <dt className="text-[0.6875rem] font-semibold tracking-widest uppercase text-charcoal/40">
                    {d.label}
                  </dt>
                  <dd className="text-sm font-medium text-forest text-right">
                    {d.href ? (
                      <Link
                        href={d.href}
                        className="hover:text-sage underline underline-offset-4 decoration-sage/40 transition-colors"
                      >
                        {d.value}
                      </Link>
                    ) : (
                      d.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-xs text-charcoal/45 italic">
              Batch dates, timings and fees are shared on enquiry — send us a
              message and we&apos;ll reply with the full course details.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-sage mb-3">
              Your Faculty
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-forest leading-tight mb-6">
              Taught By Teachers of Teachers
            </h2>
            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-parchment shadow-sm">
                <h3 className="font-display font-semibold text-forest text-lg">
                  Harish Veladi
                </h3>
                <p className="text-xs text-sage font-medium tracking-wide uppercase mt-0.5 mb-2">
                  Lead Yoga Educator &amp; Curriculum Developer
                </p>
                <p className="text-sm text-charcoal/65 leading-relaxed">
                  Designs and leads professional Yoga Teacher Training
                  programmes, combining traditional yogic wisdom with modern
                  anatomy and psychology. MA Psychology, MBA.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-parchment shadow-sm">
                <h3 className="font-display font-semibold text-forest text-lg">
                  Giri Yadav
                </h3>
                <p className="text-xs text-sage font-medium tracking-wide uppercase mt-0.5 mb-2">
                  Founder &amp; Lead Instructor · RYT 500
                </p>
                <p className="text-sm text-charcoal/65 leading-relaxed">
                  Over 12 years in yoga and holistic fitness, specialising in
                  Hatha, Power, Aerial and Therapeutic Yoga, Pranayama and
                  Meditation.
                </p>
              </div>
            </div>
            <Link
              href="/teachers"
              className="inline-flex items-center gap-2 mt-5 text-sm font-medium text-forest hover:text-sage transition-colors"
            >
              Meet the full team
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8 md:mb-10">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-sage mb-3">
              What You&apos;ll Study
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-forest leading-tight mb-4">
              The Curriculum
            </h2>
            <p className="text-charcoal/60 max-w-xl mx-auto">
              Five areas of study, mapped to the Yoga Alliance educational
              categories for a Registered Yoga School.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {curriculum.map((c) => (
              <div
                key={c.n}
                className="bg-white rounded-2xl p-6 border border-parchment shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="font-display text-3xl font-bold text-sage/40 leading-none mb-3">
                  {c.n}
                </div>
                <h3 className="font-display font-semibold text-forest text-lg mb-2 leading-snug">
                  {c.title}
                </h3>
                <p className="text-sm text-charcoal/65 leading-relaxed">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="py-12 md:py-16 bg-cream">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-8 md:mb-10">
            <p className="text-xs font-medium tracking-[0.2em] uppercase text-sage mb-3">
              Who It&apos;s For
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-forest leading-tight">
              Is This Training For You?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {audience.map((a) => (
              <div
                key={a.title}
                className="text-center p-6 rounded-2xl border border-parchment bg-white"
              >
                <div className="text-3xl mb-4">{a.icon}</div>
                <h3 className="font-display font-semibold text-forest text-lg mb-2">
                  {a.title}
                </h3>
                <p className="text-sm text-charcoal/65 leading-relaxed">
                  {a.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 md:py-20 bg-white">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <Image
            src="/rys-200.png"
            alt="Yoga Alliance Registered Yoga School — RYS 200"
            width={400}
            height={400}
            sizes="72px"
            className="h-18 w-18 mx-auto mb-6 object-contain"
          />
          <h2 className="font-display text-3xl md:text-4xl font-bold text-forest leading-tight mb-4">
            Begin Your Teaching Journey
          </h2>
          <p className="text-charcoal/60 mb-7 leading-relaxed">
            Tell us a little about your practice and your goals, and we&apos;ll
            share the course details and upcoming batch dates.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={site.phoneHref}
              className="px-7 py-3.5 rounded-full bg-forest text-white font-medium tracking-wide hover:bg-forest-mid transition-colors shadow-lg shadow-forest/20"
            >
              {`Call ${site.phoneDisplay}`}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
