import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/auth";
import { getSchedule } from "@/lib/db/content";
import TimetableEditor from "@/components/admin/TimetableEditor";

export const dynamic = "force-dynamic";

export default async function TimingsPage() {
  if (!(await getAdminEmail())) redirect("/admin/login");
  return <TimetableEditor schedule={await getSchedule()} />;
}
