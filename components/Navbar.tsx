"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

const links = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Teachers", href: "/teachers" },
  { label: "Teacher Courses", href: "/teacher-courses" },
  { label: "Contact", href: "/#contact" },
];

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/#home" className="flex items-center gap-2 shrink-0">
          <Image
            src="/logo-mark-v2.png"
            alt="Arambha Yoga & Wellness"
            width={320}
            height={248}
            sizes="(max-width: 768px) 62px, 72px"
            className="h-12 md:h-14 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-5 xl:gap-6">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-sm font-medium tracking-wide transition-colors ${
                    active ? "text-sage" : "text-forest hover:text-sage"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop: phone + CTA */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
          <a
            href={site.phoneHref}
            aria-label={`Call us on ${site.phoneDisplay}`}
            className="inline-flex items-center gap-2 px-3 lg:px-4 py-2.5 rounded-full border border-forest/25 text-forest text-sm font-medium tracking-wide hover:border-forest hover:bg-forest/5 transition-colors whitespace-nowrap"
          >
            <PhoneIcon className="w-4 h-4 shrink-0" />
            <span className="hidden xl:inline">{site.phoneDisplay}</span>
          </a>

          <Link
            href="/#contact"
            className="inline-flex items-center px-5 py-2.5 rounded-full bg-forest text-white text-sm font-medium tracking-wide hover:bg-forest-mid transition-colors whitespace-nowrap"
          >
            Book a Class
          </Link>
        </div>

        {/* Mobile: call + hamburger */}
        <div className="flex items-center gap-1 lg:hidden shrink-0">
          <a
            href={site.phoneHref}
            aria-label={`Call us on ${site.phoneDisplay}`}
            className="p-2 text-forest hover:text-sage transition-colors"
          >
            <PhoneIcon className="w-5 h-5" />
          </a>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-forest"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            <div className="w-6 flex flex-col gap-1.5">
              <span
                className={`h-0.5 bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
              />
              <span
                className={`h-0.5 bg-current transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`h-0.5 bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-white border-t border-parchment px-6 py-4 flex flex-col gap-4">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`font-medium py-1 transition-colors ${
                  active ? "text-sage" : "text-forest hover:text-sage"
                }`}
              >
                {l.label}
              </Link>
            );
          })}

          <a
            href={site.phoneHref}
            onClick={() => setMenuOpen(false)}
            className="inline-flex items-center gap-2 py-1 font-medium text-forest hover:text-sage transition-colors"
          >
            <PhoneIcon className="w-4 h-4 shrink-0" />
            {site.phoneDisplay}
          </a>

          <Link
            href="/#contact"
            onClick={() => setMenuOpen(false)}
            className="mt-1 text-center px-5 py-2.5 rounded-full bg-forest text-white text-sm font-medium"
          >
            Book a Class
          </Link>
        </div>
      )}
    </header>
  );
}
