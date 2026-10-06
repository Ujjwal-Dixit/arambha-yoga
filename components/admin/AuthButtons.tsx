"use client";

import { useState } from "react";
import { signIn, signOut } from "next-auth/react";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.76h3.57c2.08-1.92 3.27-4.74 3.27-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0012 23z" />
      <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 015.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 001 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 002.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
    </svg>
  );
}

export function SignInButton() {
  const [pending, setPending] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        setPending(true);
        signIn("google", { callbackUrl: "/admin" });
      }}
      disabled={pending}
      className="w-full inline-flex items-center justify-center gap-3 px-6 py-3 rounded-full bg-white border border-parchment shadow-sm text-sm font-medium text-charcoal hover:border-forest/30 hover:shadow transition disabled:opacity-60"
    >
      <GoogleIcon className="w-5 h-5" />
      {pending ? "Redirecting to Google…" : "Sign in with Google"}
    </button>
  );
}

export function SignOutButton() {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/admin/login" })}
      className="text-sm text-charcoal/60 hover:text-forest transition-colors"
    >
      Sign out
    </button>
  );
}
