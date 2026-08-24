import Image from "next/image";

export type Teacher = {
  name: string;
  role: string;
  image: string;
  meta: { label: string; value: string }[];
  specialties?: string[];
  bio: string[];
  emphasis: string;
};

export const teachers: Teacher[] = [
  {
    name: "Giri Yadav",
    role: "Founder & Lead Instructor",
    image: "/teachers/giri-yadav.jpg",
    meta: [
      { label: "Certification", value: "RYT 500" },
      { label: "Experience", value: "12+ years" },
    ],
    specialties: [
      "Hatha Yoga",
      "Power Yoga",
      "Aerial Yoga",
      "Therapeutic Yoga",
      "Pranayama",
      "Meditation",
      "Functional Fitness",
    ],
    bio: [
      "Giri Yadav is the Founder of Arambha Yoga & Wellness and a certified 500-Hour Registered Yoga Teacher (RYT 500) with over 12 years of experience in the field of yoga and holistic fitness. He specialises in Hatha Yoga, Power Yoga, Aerial Yoga, Therapeutic Yoga, Pranayama, Meditation, and Functional Fitness, helping individuals improve strength, mobility, and overall well-being.",
      "Giri is passionate about making yoga practical and accessible for people of all ages and fitness levels, while blending traditional yogic wisdom with modern movement science.",
    ],
    emphasis:
      "Alignment, breath awareness, injury prevention, and sustainable lifestyle transformation — empowering students to build healthier, stronger, and more balanced lives.",
  },
  {
    name: "Harish Veladi",
    role: "Lead Yoga Educator & Curriculum Developer",
    image: "/teachers/harish-veladi.jpg",
    meta: [
      { label: "Qualifications", value: "MA Psychology · MBA" },
      { label: "Focus", value: "Teacher Training (YTT)" },
    ],
    specialties: [
      "Hatha",
      "Ashtanga Vinyasa",
      "Iyengar",
      "Therapeutic Yoga",
      "Meditation",
    ],
    bio: [
      "Harish Veladi is a Lead Yoga Educator and Curriculum Developer with extensive experience in training yoga teachers and designing professional Yoga Teacher Training (YTT) programmes. With advanced expertise in Hatha, Ashtanga Vinyasa, Iyengar, Therapeutic Yoga, and Meditation, he combines traditional yogic wisdom with modern anatomy and psychology.",
      "Holding an MA in Psychology and an MBA, Harish brings a holistic approach to physical, mental, and emotional well-being. He is passionate about mentoring future yoga teachers, promoting mindful movement, and making authentic yoga accessible to all.",
    ],
    emphasis:
      "Alignment, breath awareness, self-discovery, and sustainable wellness.",
  },
  {
    name: "Sowjanya Rao",
    role: "Yoga Teacher",
    image: "/teachers/sowjanya-rao.jpg",
    meta: [
      { label: "Certification", value: "RYT 200" },
      { label: "Experience", value: "2 years" },
    ],
    bio: [
      "Sowjanya Rao is a certified 200-Hour Yoga Teacher with 2 years of teaching experience. She is dedicated to helping individuals improve their strength, flexibility, and overall well-being through safe, mindful, and accessible yoga practices.",
      "Her goal is to inspire a balanced and healthier lifestyle for people of all ages and fitness levels.",
    ],
    emphasis:
      "Safe, mindful, and accessible practice for every age and every stage.",
  },
];

export default function Teachers() {
  return (
    <section id="teachers" className="py-12 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6 space-y-16 md:space-y-24">
        {teachers.map((t, i) => {
          const reversed = i % 2 === 1;
          return (
            <article
              key={t.name}
              className={`flex flex-col gap-8 md:gap-14 md:items-start ${
                reversed ? "md:flex-row-reverse" : "md:flex-row"
              }`}
            >
              {/* Portrait */}
              <div className="relative w-full max-w-[280px] mx-auto md:mx-0 md:w-[320px] md:max-w-none shrink-0">
                <div
                  className={`absolute -inset-3 rounded-3xl border border-sage/25 ${
                    reversed ? "rotate-2" : "-rotate-2"
                  }`}
                  aria-hidden="true"
                />
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-parchment shadow-lg ring-1 ring-parchment">
                  <Image
                    src={t.image}
                    alt={`${t.name} — ${t.role} at Arambha Yoga & Wellness`}
                    fill
                    sizes="(max-width: 768px) 280px, 320px"
                    className="object-cover object-top"
                    priority={i === 0}
                  />
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium tracking-[0.2em] uppercase text-sage mb-2">
                  {t.role}
                </p>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-forest leading-tight mb-5">
                  {t.name}
                </h2>

                {/* Credentials */}
                <div className="flex flex-wrap gap-x-8 gap-y-3 pb-5 mb-5 border-b border-parchment">
                  {t.meta.map((m) => (
                    <div key={m.label}>
                      <div className="text-[10px] font-semibold tracking-widest uppercase text-charcoal/40 mb-0.5">
                        {m.label}
                      </div>
                      <div className="text-sm font-medium text-forest">
                        {m.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bio */}
                <div className="space-y-4 mb-6">
                  {t.bio.map((p, j) => (
                    <p key={j} className="text-charcoal/70 leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>

                {/* Specialties */}
                {t.specialties && (
                  <div className="mb-6">
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-charcoal/40 mb-2.5">
                      Specialities
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {t.specialties.map((s) => (
                        <span
                          key={s}
                          className="text-xs font-medium px-3 py-1.5 rounded-full bg-sage-light/30 text-forest-mid border border-sage/25"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Teaching emphasis */}
                <blockquote className="border-l-2 border-earth/50 pl-4 font-display italic text-forest-mid leading-relaxed">
                  {t.emphasis}
                </blockquote>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
