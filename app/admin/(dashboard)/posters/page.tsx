import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/auth";
import { getAllOfferPosters } from "@/lib/db/content";
import { todayInIST } from "@/lib/schedule";
import PostersManager, { type AdminPoster } from "@/components/admin/PostersManager";

export const dynamic = "force-dynamic";

export default async function PostersPage() {
  if (!(await getAdminEmail())) redirect("/admin/login");

  const posters: AdminPoster[] = (await getAllOfferPosters()).map((p) => ({
    id: p.id,
    imageUrl: p.imageUrl,
    width: p.width,
    height: p.height,
    alt: p.alt,
    published: p.published,
    startsOn: p.startsOn ?? "",
    endsOn: p.endsOn ?? "",
  }));

  return <PostersManager posters={posters} today={todayInIST()} />;
}
