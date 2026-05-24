"use client";

import { useState, useEffect } from "react";
import type { Translations, Locale } from "@/i18n";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

export default function Navbar({
  t,
  locale,
  onLocaleChange,
}: {
  t: Translations;
  locale: Locale;
  onLocaleChange: (l: Locale) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { href: "#event", label: t.nav.event },
    { href: "#how", label: t.nav.howItWorks },
    { href: "#rsvp", label: t.nav.rsvp },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/95 backdrop-blur-sm border-b border-[#F0E8D0]" : "bg-transparent"
        }`}
        style={{ boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.06)" : "none" }}
      >
        <div className="flex items-center justify-between px-5 py-3.5 max-w-lg mx-auto">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-[#8B1A1A] rounded-sm flex items-center justify-center">
              <span className="text-white text-xs font-light" style={{ fontFamily: "serif" }}>中</span>
            </div>
            <span
              className="text-sm font-light text-[#1A1A1A] tracking-wide hidden sm:block"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              中文译者年会
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-xs text-[#666] hover:text-[#8B1A1A] transition-colors tracking-wider uppercase font-light"
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <LanguageSwitcher current={locale} onChange={onLocaleChange} />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-1.5 text-[#555] hover:text-[#8B1A1A] transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-white/98 backdrop-blur-sm flex flex-col items-center justify-center gap-6 md:hidden">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="text-xl font-light text-[#1A1A1A] tracking-widest uppercase hover:text-[#8B1A1A] transition-colors"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
            >
              {l.label}
            </a>
          ))}
          <div className="mt-6 pt-6 border-t border-[#F0E8D0] w-32">
            <LanguageSwitcher current={locale} onChange={(l) => { onLocaleChange(l); setMenuOpen(false); }} />
          </div>
        </div>
      )}
    </>
  );
}
