const testimonials = [
  {
    name: "Priya Sharma",
    role: "Aerial Yoga Student",
    initials: "PS",
    color: "bg-sage/20 text-forest",
    rating: 5,
    quote:
      "Arambha has completely transformed the way I think about wellness. The aerial yoga classes are unlike anything I've experienced — I leave every session feeling lighter, both physically and mentally.",
  },
  {
    name: "Ravi Kumar",
    role: "Ashtanga & Pranayama",
    initials: "RK",
    color: "bg-earth/30 text-earth-dark",
    rating: 5,
    quote:
      "I came in as a complete beginner and was welcomed without judgement. The instructors here genuinely care about your progress. My breathing, posture, and stress levels have all improved dramatically.",
  },
  {
    name: "Ananya Reddy",
    role: "Prenatal Yoga",
    initials: "AR",
    color: "bg-forest/10 text-forest",
    rating: 5,
    quote:
      "The prenatal yoga sessions gave me so much confidence during my pregnancy. The instructor was deeply knowledgeable and made every class feel safe, nurturing, and empowering. Truly a gift.",
  },
  {
    name: "Suresh Menon",
    role: "Power Yoga",
    initials: "SM",
    color: "bg-sage-light/40 text-forest-mid",
    rating: 5,
    quote:
      "I was skeptical about yoga being intense enough for me, but Power Yoga at Arambha proved me wrong. It's a fantastic full-body workout. The studio atmosphere is serene yet energising.",
  },
  {
    name: "Deepa Nair",
    role: "Restorative & Hatha Yoga",
    initials: "DN",
    color: "bg-parchment text-earth-dark",
    rating: 5,
    quote:
      "After years of chronic back pain, restorative yoga at Arambha has been a revelation. The attention to alignment and the calm pace of each class has helped me heal in ways I didn't expect.",
  },
  {
    name: "Karthik Rao",
    role: "Acro Yoga",
    initials: "KR",
    color: "bg-forest/10 text-forest",
    rating: 5,
    quote:
      "Acro Yoga is the most fun I've had in a fitness class — ever. The community here is warm, supportive, and encouraging. Arambha truly lives up to its meaning: the perfect beginning.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          className="w-4 h-4 text-amber-400 fill-amber-400"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
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
          <p className="text-charcoal/60 max-w-md mx-auto">
            Real experiences from the people whose lives have been touched by
            their practice at Arambha.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-6 border border-parchment shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              {/* Quote mark */}
              <div className="text-4xl font-display text-forest/10 leading-none mb-2 select-none">
                &ldquo;
              </div>

              <p className="text-sm text-charcoal/70 leading-relaxed flex-1 mb-6">
                {t.quote}
              </p>

              {/* Footer */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 ${t.color}`}
                >
                  {t.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-forest text-sm truncate">
                    {t.name}
                  </p>
                  <p className="text-xs text-charcoal/50 truncate">{t.role}</p>
                </div>
                <Stars count={t.rating} />
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
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
