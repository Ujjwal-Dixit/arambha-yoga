import { getServerSession, type NextAuthOptions } from "next-auth";
import GoogleProvider, { type GoogleProfile } from "next-auth/providers/google";

/**
 * Admin sign-in: Google accounts listed in ADMIN_EMAILS only.
 *
 * Required environment variables:
 *
 *   GOOGLE_CLIENT_ID       OAuth client from Google Cloud Console
 *   GOOGLE_CLIENT_SECRET
 *   NEXTAUTH_SECRET        Random string that signs the session cookie
 *                          (generate with: openssl rand -base64 32)
 *   NEXTAUTH_URL           The site's own URL, e.g. https://arambhayoga.com
 *                          (http://localhost:3000 locally)
 *   ADMIN_EMAILS           Comma-separated Gmail addresses allowed in
 *
 * There is no database of users: anyone Google vouches for whose address is on
 * the list gets in, and nobody else can — even with a valid Google account.
 */

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  return !!email && adminEmails().includes(email.toLowerCase());
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "google") return false;
      const google = profile as GoogleProfile | undefined;
      // An unverified address could belong to anyone — never trust it.
      return !!google?.email_verified && isAdminEmail(google.email);
    },
  },
};

/**
 * The signed-in admin's email, or null. Re-checks the allow-list on every call,
 * so removing an address from ADMIN_EMAILS locks that person out immediately,
 * even if they still hold a session cookie.
 */
export async function getAdminEmail(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  return isAdminEmail(email) ? email! : null;
}
