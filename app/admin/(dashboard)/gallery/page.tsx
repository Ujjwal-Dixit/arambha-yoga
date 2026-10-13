import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/auth";
import { getAllGallery } from "@/lib/db/content";
import GalleryManager, { type AdminGalleryPhoto } from "@/components/admin/GalleryManager";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  if (!(await getAdminEmail())) redirect("/admin/login");

  const photos: AdminGalleryPhoto[] = (await getAllGallery()).map((p) => ({
    id: p.id,
    imageUrl: p.imageUrl,
    width: p.width,
    height: p.height,
    caption: p.caption,
    published: p.published,
  }));

  return <GalleryManager photos={photos} />;
}
