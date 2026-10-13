import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/auth";
import { getAllPromotions } from "@/lib/db/promotions";
import { todayInIST } from "@/lib/schedule";
import PromotionsManager, { type AdminPromotion } from "@/components/admin/PromotionsManager";

export const dynamic = "force-dynamic";

export default async function PromotionsPage() {
  if (!(await getAdminEmail())) redirect("/admin/login");

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

  return <PromotionsManager promotions={promotions} today={todayInIST()} />;
}
