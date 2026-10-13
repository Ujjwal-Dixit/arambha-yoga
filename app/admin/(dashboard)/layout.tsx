import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/auth";
import { SignOutButton } from "@/components/admin/AuthButtons";
import AdminTabs from "@/components/admin/AdminTabs";

/**
 * Header and tabs for every dashboard page. The sign-in check here is for
 * navigation only — each page and each server action checks again, since a
 * layout doesn't re-render on every navigation.
 */
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const email = await getAdminEmail();
  if (!email) redirect("/admin/login");

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
            <Link href="/" target="_blank" className="text-sm font-medium text-forest hover:text-sage transition-colors">
              View site ↗
            </Link>
            <SignOutButton />
          </div>
        </div>
        <AdminTabs />
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">{children}</main>
    </>
  );
}
