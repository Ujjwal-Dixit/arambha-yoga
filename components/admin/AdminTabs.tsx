"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/admin", label: "Promotions" },
  { href: "/admin/posters", label: "Offer Posters" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/timings", label: "Class Timings" },
];

export default function AdminTabs() {
  const pathname = usePathname();
  return (
    <nav aria-label="Dashboard sections" className="border-t border-parchment">
      <ul className="max-w-6xl mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto">
        {TABS.map((t) => {
          const active = pathname === t.href;
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={`block whitespace-nowrap px-3 py-3 text-sm font-medium border-b-2 transition-colors ${
                  active ? "border-forest text-forest" : "border-transparent text-charcoal/55 hover:text-forest"
                }`}
              >
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
