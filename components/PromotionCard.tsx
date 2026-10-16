import Link from "next/link";
import { tagClass, type PromotionCardData } from "@/lib/promotions";

/**
 * One promotion card (offers and events below the home hero). Shared by the public Promotions section and the admin
 * dashboard's live preview, so what the owner sees is exactly what visitors get.
 */
export default function PromotionCard({ promotion: e }: { promotion: PromotionCardData }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
        e.highlight
          ? "border-sage shadow-md shadow-sage/20"
          : "border-parchment"
      }`}
    >
      <div className={`h-1 w-full ${e.highlight ? "bg-sage" : "bg-parchment"}`} />

      <div className="p-5 flex flex-col flex-1 bg-white">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-[0.6875rem] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full ${tagClass(e.tagColor)}`}>
            {e.tag}
          </span>
          <span className="text-2xl">{e.icon}</span>
        </div>

        <h3 className="font-display font-semibold text-forest text-base leading-snug mb-2">
          {e.title}
        </h3>
        <p className="text-sm text-charcoal/60 leading-relaxed flex-1 mb-4">
          {e.description}
        </p>

        <div className="space-y-1.5 pt-3 border-t border-parchment mb-4">
          <div className="flex items-center gap-1.5 text-xs text-charcoal/50">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {e.dateText}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-charcoal/50">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {e.timeText}
          </div>
        </div>

        <Link
          href="/#enquiry"
          className="block text-center text-xs font-semibold py-2 rounded-full border border-forest text-forest hover:bg-forest hover:text-white transition-colors"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
