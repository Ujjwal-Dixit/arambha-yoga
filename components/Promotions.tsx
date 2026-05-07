const events = [
  {
    tag: "New Batch",
    tagColor: "bg-sage text-white",
    title: "Morning Flow — May Batch",
    desc: "4-week Hatha & Pranayama batch starting May 5th. All levels welcome. Limited seats.",
    date: "Starts May 5, 2026",
    time: "6:30 AM – 7:30 AM",
    icon: "🌅",
    highlight: true,
  },
  {
    tag: "Workshop",
    tagColor: "bg-earth text-white",
    title: "Aerial Yoga Weekend",
    desc: "Two-day beginner-friendly aerial workshop. All equipment provided.",
    date: "May 10 – 11, 2026",
    time: "8:30 AM – 11:00 AM",
    icon: "🪢",
    highlight: false,
  },
  {
    tag: "Special Offer",
    tagColor: "bg-forest text-white",
    title: "First Class Free",
    desc: "New to Arambha? Your first class is on us. No commitment required.",
    date: "Ongoing",
    time: "Any available slot",
    icon: "🎁",
    highlight: false,
  },
  {
    tag: "Early Bird",
    tagColor: "bg-amber-500 text-white",
    title: "15% Off — April Enrolments",
    desc: "Enrol in any batch before April 30 and save 15% on your monthly fee.",
    date: "Ends April 30, 2026",
    time: "All batches",
    icon: "⏰",
    highlight: false,
  },
];

export default function Promotions() {
  return (
    <section id="promotions" className="bg-cream py-10">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-sage">
            What&apos;s On
          </span>
          <div className="flex-1 h-px bg-parchment" />
          <span className="text-xs text-charcoal/40">Promotions &amp; Events</span>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {events.map((e) => (
            <div
              key={e.title}
              className={`relative flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                e.highlight
                  ? "border-sage shadow-md shadow-sage/20"
                  : "border-parchment"
              }`}
            >
              <div className={`h-1 w-full ${e.highlight ? "bg-sage" : "bg-parchment"}`} />

              <div className="p-4 flex flex-col flex-1 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${e.tagColor}`}>
                    {e.tag}
                  </span>
                  <span className="text-xl">{e.icon}</span>
                </div>

                <h3 className="font-display font-semibold text-forest text-sm leading-snug mb-1.5">
                  {e.title}
                </h3>
                <p className="text-xs text-charcoal/60 leading-relaxed flex-1 mb-3">
                  {e.desc}
                </p>

                <div className="space-y-1 pt-2.5 border-t border-parchment mb-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-charcoal/50">
                    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {e.date}
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-charcoal/50">
                    <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {e.time}
                  </div>
                </div>

                <a
                  href="#contact"
                  className="block text-center text-[11px] font-semibold py-1.5 rounded-full border border-forest text-forest hover:bg-forest hover:text-white transition-colors"
                >
                  Enquire Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
