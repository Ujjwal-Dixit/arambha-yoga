import PromotionCard from "@/components/PromotionCard";
import { getLivePromotions } from "@/lib/db/promotions";

export default async function Promotions() {
  const events = await getLivePromotions();

  // Nothing running right now — leave the section out entirely.
  if (events.length === 0) return null;

  return (
    <section id="promotions" className="bg-cream py-10">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {events.map((e) => (
            <PromotionCard key={e.id} promotion={e} />
          ))}
        </div>
      </div>
    </section>
  );
}
