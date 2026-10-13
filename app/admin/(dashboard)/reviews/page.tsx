import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/auth";
import { getAllTestimonials } from "@/lib/db/content";
import ReviewsManager, { type AdminReview } from "@/components/admin/ReviewsManager";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  if (!(await getAdminEmail())) redirect("/admin/login");

  const reviews: AdminReview[] = (await getAllTestimonials()).map((r) => ({
    id: r.id,
    name: r.name,
    context: r.context,
    quote: r.quote,
    published: r.published,
  }));

  return <ReviewsManager reviews={reviews} />;
}
