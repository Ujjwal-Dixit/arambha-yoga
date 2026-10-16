import HeroOffers, { type OfferPoster } from "@/components/HeroOffers";

export default function Hero({ offers }: { offers: OfferPoster[] }) {
  return (
    <section
      id="home"
      className="relative flex items-center justify-center overflow-hidden pt-24 pb-10 md:pt-28 md:pb-14 lg:pb-12 lg:min-h-svh"
    >
      {/* Layered background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-white to-sage-light/30" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sage/10 via-transparent to-transparent" />

      {/* Decorative circles */}
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-sage/8 blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-earth/15 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-forest/5" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-forest/5" />

      {/* Content — offers sit beside the text from tablet width up, below it on phones */}
      <div className="relative w-full max-w-6xl mx-auto px-6 mt-2 grid md:grid-cols-[1fr_auto] items-center gap-10 lg:gap-16">
        <div>
          {/* Motto badge */}
          <p className="inline-block mb-3 md:mb-5 px-4 py-1.5 rounded-full text-xs font-medium tracking-[0.2em] uppercase text-forest-mid bg-sage-light/50 border border-sage/30">
            Awake · Align · Arise
          </p>

          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-forest leading-tight mb-4 md:mb-5">
            Your Wellness Journey
            <span className="block text-forest-mid">Begins Here</span>
          </h1>

          <p className="text-base md:text-lg text-charcoal/70 max-w-xl leading-relaxed mb-6 md:mb-8">
            For you, for life. Discover transformative yoga and wellness practices
            rooted in tradition, guided by compassion.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#services"
              className="px-7 py-3 rounded-full bg-forest text-white font-medium tracking-wide hover:bg-forest-mid transition-colors shadow-lg shadow-forest/20"
            >
              Explore Classes
            </a>
            <a
              href="#enquiry"
              className="px-7 py-3 rounded-full border-2 border-forest text-forest font-medium tracking-wide hover:bg-forest hover:text-white transition-colors"
            >
              Book Now
            </a>
          </div>

          {/* Stats row */}
          <div className="mt-8 md:mt-10 grid grid-cols-3 gap-4 max-w-lg">
            {[
              { value: "14+", label: "Yoga Styles" },
              { value: "∞", label: "Wellness Journey" },
              { value: "100%", label: "Dedication" },
            ].map((s) => (
              <div key={s.label}>
                <div className="font-display text-2xl md:text-3xl font-bold text-forest">
                  {s.value}
                </div>
                <div className="text-xs text-charcoal/50 mt-1 tracking-wide uppercase">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <HeroOffers offers={offers} />
      </div>
    </section>
  );
}
