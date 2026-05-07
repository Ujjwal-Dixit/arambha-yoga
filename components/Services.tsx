const services = [
  {
    name: "Wall Yoga",
    desc: "Use the wall as a prop for deeper alignment, inversions, and support. Ideal for all levels.",
    tag: "All Levels",
    color: "bg-sage-light/30 border-sage/30",
  },
  {
    name: "Chair Yoga",
    desc: "Accessible yoga using a chair for stability — perfect for seniors or those with mobility needs.",
    tag: "Beginner Friendly",
    color: "bg-parchment border-earth/30",
  },
  {
    name: "Dumbbell Yoga",
    desc: "Combine strength training with yogic flow for a balanced mind-body workout.",
    tag: "Strength",
    color: "bg-sage-light/20 border-sage/20",
  },
  {
    name: "Stick Yoga",
    desc: "A unique practice using a stick to enhance posture, flexibility, and symmetry.",
    tag: "Alignment",
    color: "bg-parchment border-earth/30",
  },
  {
    name: "Mat Pilates",
    desc: "Core-centric mat work to build strength, stability, and postural awareness.",
    tag: "Core",
    color: "bg-cream border-earth/20",
  },
  {
    name: "Power Yoga",
    desc: "A vigorous, fitness-focused yoga style building endurance, strength, and flexibility.",
    tag: "Intense",
    color: "bg-forest/5 border-forest/10",
  },
  {
    name: "Brick Yoga",
    desc: "Props-assisted practice using yoga bricks to deepen poses safely and effectively.",
    tag: "Props",
    color: "bg-parchment border-earth/30",
  },
  {
    name: "Aerial Yoga",
    desc: "Suspended in a silk hammock — decompresses the spine and makes inversions accessible.",
    tag: "Signature",
    color: "bg-forest/8 border-forest/15",
  },
  {
    name: "Restorative Yoga",
    desc: "Deeply relaxing poses held with props for stress relief and nervous system recovery.",
    tag: "Relaxation",
    color: "bg-sage-light/30 border-sage/30",
  },
  {
    name: "Hatha Yoga",
    desc: "The classical foundation — balancing effort and ease through pranayama and asana.",
    tag: "Classic",
    color: "bg-cream border-earth/20",
  },
  {
    name: "Ashtanga Yoga",
    desc: "A disciplined, progressive series of postures linking breath with movement.",
    tag: "Advanced",
    color: "bg-forest/5 border-forest/10",
  },
  {
    name: "Acro Yoga",
    desc: "A joyful partner practice blending acrobatics, yoga, and Thai massage principles.",
    tag: "Partner",
    color: "bg-sage-light/20 border-sage/20",
  },
  {
    name: "Pranayama",
    desc: "Ancient breathwork techniques to regulate energy, calm the mind, and expand vitality.",
    tag: "Breathwork",
    color: "bg-parchment border-earth/30",
  },
  {
    name: "Prenatal & Postnatal Yoga",
    desc: "Safe, nurturing practice tailored for mothers — supporting pregnancy and postpartum recovery.",
    tag: "Specialist",
    color: "bg-sage-light/30 border-sage/30",
  },
];

export default function Services() {
  return (
    <section id="services" className="py-12 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <p className="text-xs font-medium tracking-[0.2em] uppercase text-sage mb-3">
            What We Offer
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-forest leading-tight mb-4">
            Our Services
          </h2>
          <p className="text-charcoal/60 max-w-xl mx-auto">
            Fourteen distinct practices — each a doorway to greater health,
            awareness, and joy.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {services.map((s) => (
            <div
              key={s.name}
              className={`group relative p-5 rounded-2xl border ${s.color} hover:shadow-md transition-all duration-300 hover:-translate-y-0.5`}
            >
              <span className="inline-block mb-3 text-xs font-medium tracking-wide px-2.5 py-1 rounded-full bg-white/70 text-forest-mid border border-forest/10">
                {s.tag}
              </span>
              <h3 className="font-display font-semibold text-forest text-lg mb-2 leading-snug">
                {s.name}
              </h3>
              <p className="text-xs text-charcoal/60 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 text-center">
          <p className="text-charcoal/60 mb-4">
            Not sure which class is right for you?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-forest text-white font-medium hover:bg-forest-mid transition-colors shadow-lg shadow-forest/20"
          >
            Talk to Us — We&apos;ll Guide You
          </a>
        </div>
      </div>
    </section>
  );
}
