import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/auth";
import { getAllPromotions } from "@/lib/db/promotions";
import { todayInIST } from "@/lib/schedule";
import { SignOutButton } from "@/components/admin/AuthButtons";
import PromotionsManager, { type AdminPromotion } from "@/components/admin/PromotionsManager";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const email = await getAdminEmail();
  if (!email) redirect("/admin/login");

  // Plain, serialisable objects only — the client component gets exactly the
  // fields the form edits.
  const promotions: AdminPromotion[] = (await getAllPromotions()).map((p) => ({
    id: p.id,
    tag: p.tag,
    tagColor: p.tagColor,
    title: p.title,
    description: p.description,
    dateText: p.dateText,
    timeText: p.timeText,
    icon: p.icon,
    highlight: p.highlight,
    published: p.published,
    startsOn: p.startsOn ?? "",
    endsOn: p.endsOn ?? "",
  }));

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-parchment">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Image
              src="/logo-mark-v2.png"
              alt="Arambha Yoga & Wellness"
              width={320}
              height={248}
              sizes="52px"
              className="h-10 w-auto object-contain shrink-0"
              priority
            />
            <span className="hidden sm:inline text-xs font-medium tracking-[0.2em] uppercase text-sage">
              Owner Dashboard
            </span>
          </div>
          <div className="flex items-center gap-4 sm:gap-5 shrink-0">
            <span className="hidden md:inline text-xs text-charcoal/45 truncate max-w-56">{email}</span>
            <Link
              href="/"
              target="_blank"
              className="text-sm font-medium text-forest hover:text-sage transition-colors"
            >
              View site ↗
            </Link>
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
        <PromotionsManager promotions={promotions} today={todayInIST()} />
      </main>
    </>
  );
}
