import Link from "next/link";
import { tagClass, type PromotionCardData } from "@/lib/promotions";

/**
 * One "What's On" card. Shared by the public Promotions section and the admin
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

      <div className="p-4 flex flex-col flex-1 bg-white">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full ${tagClass(e.tagColor)}`}>
            {e.tag}
          </span>
          <span className="text-xl">{e.icon}</span>
        </div>

        <h3 className="font-display font-semibold text-forest text-sm leading-snug mb-1.5">
          {e.title}
        </h3>
        <p className="text-xs text-charcoal/60 leading-relaxed flex-1 mb-3">
          {e.description}
        </p>

        <div className="space-y-1 pt-2.5 border-t border-parchment mb-3">
          <div className="flex items-center gap-1.5 text-[11px] text-charcoal/50">
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {e.dateText}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-charcoal/50">
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {e.timeText}
          </div>
        </div>

        <Link
          href="/#contact"
          className="block text-center text-[11px] font-semibold py-1.5 rounded-full border border-forest text-forest hover:bg-forest hover:text-white transition-colors"
        >
          Enquire Now
        </Link>
      </div>
    </div>
  );
}
