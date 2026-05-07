const values = [
  {
    icon: "🌿",
    title: "Rooted in Tradition",
    desc: "Our practice draws from ancient yogic wisdom, honouring centuries of knowledge while making it accessible to modern lives.",
  },
  {
    icon: "🤝",
    title: "Community First",
    desc: "Arambha is more than a studio — it is a sanctuary where every individual is seen, supported, and celebrated.",
  },
  {
    icon: "✨",
    title: "Holistic Wellness",
    desc: "We nurture the body, calm the mind, and uplift the spirit through intentional, personalised practice.",
  },
];

export default function About() {
  return (
    <section id="about" className="py-12 md:py-20 bg-cream">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-sage mb-3">
            Our Story
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-forest leading-tight">
            What is Arambha?
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div className="space-y-6">
            <p className="text-lg text-charcoal/80 leading-relaxed">
              <span className="font-display font-semibold text-forest text-xl">
                Arambha
              </span>{" "}
              — the Sanskrit word for{" "}
              <em className="text-forest-mid">&ldquo;beginning&rdquo;</em> —
              embodies our belief that every journey to wellness starts with a
              single, intentional step.
            </p>
            <p className="text-charcoal/70 leading-relaxed">
              Founded with a deep reverence for yoga&apos;s transformative
              power, our centre in Kondapur offers a calm, welcoming space for
              students of all levels — from curious beginners to seasoned
              practitioners.
            </p>
            <p className="text-charcoal/70 leading-relaxed">
              We believe wellness is not a destination but a lifelong practice.
              Our diverse offerings — from gentle Restorative and Chair Yoga to
              dynamic Aerial and Ashtanga — ensure there is a path here for
              every body and every stage of life.
            </p>

            <div className="pt-4 border-t border-earth/30">
              <blockquote className="font-display text-xl italic text-forest-mid">
                &ldquo;Wellness begins here — for you, for life.&rdquo;
              </blockquote>
            </div>
          </div>

          {/* Values */}
          <div className="space-y-6">
            {values.map((v) => (
              <div
                key={v.title}
                className="flex gap-4 p-5 bg-white rounded-2xl shadow-sm border border-parchment"
              >
                <div className="text-2xl shrink-0 mt-0.5">{v.icon}</div>
                <div>
                  <h3 className="font-display font-semibold text-forest text-lg mb-1">
                    {v.title}
                  </h3>
                  <p className="text-sm text-charcoal/65 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
