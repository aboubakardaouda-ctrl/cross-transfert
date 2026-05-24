"use client";

import { useEffect, useRef } from "react";
import type { Translations } from "@/i18n";
import { Ornament, ChinesePattern } from "@/components/ui/Ornament";

export default function HeroSection({ t }: { t: Translations }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = containerRef.current?.querySelectorAll(".reveal");
    if (!elements) return;
    elements.forEach((el, i) => {
      (el as HTMLElement).style.animationDelay = `${i * 0.15}s`;
      (el as HTMLElement).style.opacity = "0";
      setTimeout(
        () => {
          (el as HTMLElement).style.animation = "fadeInUp 0.8s ease-out forwards";
        },
        i * 150
      );
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pattern-bg"
      style={{
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(139,26,26,0.06) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 20%, rgba(201,169,110,0.08) 0%, transparent 50%),
          linear-gradient(180deg, #FDFCF8 0%, #F8F3EC 60%, #F2EAE0 100%)
        `,
      }}
    >
      {/* Background pattern ornaments */}
      <ChinesePattern className="absolute top-8 right-4 opacity-30 pointer-events-none" />
      <ChinesePattern className="absolute bottom-16 left-4 opacity-20 pointer-events-none" />

      {/* Top border line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#8B1A1A] to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-lg mx-auto py-20">
        {/* Year badge */}
        <div className="reveal inline-flex items-center gap-2 mb-8">
          <div className="h-px w-8 bg-[#C9A96E]" />
          <span className="text-[10px] tracking-[0.3em] text-[#C9A96E] uppercase font-light">
            {t.hero.subtitle}
          </span>
          <div className="h-px w-8 bg-[#C9A96E]" />
        </div>

        {/* Seal / emblem */}
        <div className="reveal flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-full border border-[#C9A96E] flex items-center justify-center relative"
            style={{ boxShadow: "0 0 0 4px rgba(201,169,110,0.1)" }}
          >
            <div className="absolute inset-1 rounded-full border border-[#E8D5B0]" />
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              {/* Stylized Chinese seal/brush stroke */}
              <path d="M18 4 L22 14 L32 14 L24 20 L27 30 L18 24 L9 30 L12 20 L4 14 L14 14 Z" fill="#8B1A1A" opacity="0.7" />
              <circle cx="18" cy="18" r="6" fill="none" stroke="#C9A96E" strokeWidth="0.5" />
            </svg>
          </div>
        </div>

        {/* Main title */}
        <h1
          className="reveal text-3xl sm:text-4xl font-light leading-tight tracking-wide mb-2"
          style={{
            fontFamily: "var(--font-playfair), Georgia, serif",
            color: "#1A1A1A",
          }}
        >
          {t.hero.title}
        </h1>

        {/* Chinese subtitle */}
        <p className="reveal chinese-sub text-center mb-8" style={{ fontSize: "0.85rem", letterSpacing: "0.25em" }}>
          {t.hero.chinese}
        </p>

        <Ornament className="reveal mb-8" />

        {/* Tagline */}
        <p
          className="reveal text-base text-[#555] leading-relaxed mb-12 font-light"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.1rem" }}
        >
          {t.hero.tagline}
        </p>

        {/* CTA Button */}
        <div className="reveal flex flex-col items-center gap-3">
          <a
            href="#rsvp"
            className="inline-flex items-center justify-center gap-2 bg-[#8B1A1A] text-white px-8 py-4 text-sm tracking-widest uppercase transition-all duration-300 hover:bg-[#6B1313] active:scale-95"
            style={{ minWidth: "260px", letterSpacing: "0.15em" }}
          >
            <span>{t.hero.cta}</span>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <span className="text-[11px] text-[#AAA] tracking-wider">{t.hero.ctaSub}</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
        <div className="w-px h-8 bg-[#C9A96E] animate-float" />
        <svg width="8" height="8" viewBox="0 0 8 8" fill="#C9A96E">
          <path d="M0 0L4 6L8 0" />
        </svg>
      </div>

      {/* Bottom decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent opacity-30" />
    </section>
  );
}
