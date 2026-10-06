import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdminEmail } from "@/lib/auth";
import { SignInButton } from "@/components/admin/AuthButtons";

const ERRORS: Record<string, string> = {
  AccessDenied:
    "That Google account isn't authorised to manage this site. Sign in with the studio's admin account.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  if (await getAdminEmail()) redirect("/admin");

  const error = searchParams.error
    ? ERRORS[searchParams.error] ?? "Sign-in didn't work. Please try again."
    : null;

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm bg-white rounded-3xl border border-parchment shadow-sm p-8 text-center">
        <Image
          src="/logo-mark-v2.png"
          alt="Arambha Yoga & Wellness"
          width={320}
          height={248}
          sizes="124px"
          className="h-24 w-auto mx-auto mb-6 object-contain"
          priority
        />
        <p className="text-xs font-medium tracking-[0.2em] uppercase text-sage mb-2">
          Owner Dashboard
        </p>
        <h1 className="font-display text-2xl font-bold text-forest mb-2">Welcome back</h1>
        <p className="text-sm text-charcoal/60 mb-7">
          Sign in to update promotions and offers on the website.
        </p>

        {error && (
          <p role="alert" className="mb-5 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-800 text-left">
            {error}
          </p>
        )}

        <SignInButton />

        <Link href="/" className="inline-block mt-6 text-xs text-charcoal/45 hover:text-forest transition-colors">
          ← Back to the website
        </Link>
      </div>
    </main>
  );
}
