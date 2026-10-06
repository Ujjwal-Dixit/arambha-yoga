import PromotionCard from "@/components/PromotionCard";
import { getLivePromotions } from "@/lib/db/promotions";

export default async function Promotions() {
  const events = await getLivePromotions();

  // Nothing running right now — leave the section out rather than show an
  // empty "What's On" header.
  if (events.length === 0) return null;

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
            <PromotionCard key={e.id} promotion={e} />
          ))}
        </div>
      </div>
    </section>
  );
}
