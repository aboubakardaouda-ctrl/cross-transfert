"use client";

import { useEffect, useRef } from "react";
import type { Translations } from "@/i18n";
import { Ornament } from "@/components/ui/Ornament";

export default function HeroSection({ t }: { t: Translations }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elements = containerRef.current?.querySelectorAll(".reveal");
    if (!elements) return;
    elements.forEach((el, i) => {
      (el as HTMLElement).style.opacity = "0";
      setTimeout(() => {
        (el as HTMLElement).style.transition = "opacity 0.8s ease, transform 0.8s ease";
        (el as HTMLElement).style.opacity = "1";
        (el as HTMLElement).style.transform = "translateY(0)";
      }, i * 150 + 100);
      (el as HTMLElement).style.transform = "translateY(20px)";
    });
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse at 20% 50%, rgba(139,26,26,0.07) 0%, transparent 60%),
          radial-gradient(ellipse at 80% 20%, rgba(201,169,110,0.09) 0%, transparent 50%),
          linear-gradient(180deg, #FDFCF8 0%, #F8F3EC 60%, #F2EAE0 100%)
        `,
      }}
    >
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#8B1A1A] to-transparent" />

      {/* Subtle pattern */}
      <div className="absolute inset-0 pattern-bg pointer-events-none" />

      {/* Corner ornaments */}
      <div className="absolute top-10 left-6 w-10 h-10 border-t border-l border-[#C9A96E] opacity-30" />
      <div className="absolute top-10 right-6 w-10 h-10 border-t border-r border-[#C9A96E] opacity-30" />
      <div className="absolute bottom-10 left-6 w-10 h-10 border-b border-l border-[#C9A96E] opacity-30" />
      <div className="absolute bottom-10 right-6 w-10 h-10 border-b border-r border-[#C9A96E] opacity-30" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-lg mx-auto py-24">

        {/* Edition badge */}
        <div className="reveal inline-flex items-center gap-2 mb-6">
          <div className="h-px w-8 bg-[#C9A96E]" />
          <span className="text-[10px] tracking-[0.25em] text-[#C9A96E] uppercase font-light">
            {t.hero.subtitle}
          </span>
          <div className="h-px w-8 bg-[#C9A96E]" />
        </div>

        {/* Emblem */}
        <div className="reveal flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-full border border-[#C9A96E] flex items-center justify-center relative"
            style={{ boxShadow: "0 0 0 6px rgba(201,169,110,0.08), 0 0 0 12px rgba(201,169,110,0.04)" }}
          >
            <div className="absolute inset-2 rounded-full border border-[#E8D5B0] opacity-60" />
            <span
              className="text-2xl text-[#8B1A1A] relative z-10"
              style={{ fontFamily: "serif", letterSpacing: "0.05em" }}
            >
              中
            </span>
          </div>
        </div>

        {/* Association acronym */}
        <h1
          className="reveal text-5xl font-light tracking-[0.3em] text-[#8B1A1A] mb-1"
          style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
        >
          {t.hero.title}
        </h1>

        {/* Full name */}
        <p
          className="reveal text-xs text-[#888] tracking-wider leading-relaxed mb-2 px-4"
          style={{ letterSpacing: "0.08em" }}
        >
          {t.hero.titleFull}
        </p>

        {/* Chinese name */}
        <p className="reveal chinese-sub text-center mb-7" style={{ fontSize: "0.8rem", letterSpacing: "0.2em" }}>
          {t.hero.chinese}
        </p>

        <Ornament className="reveal mb-7" />

        {/* Theme */}
        <p
          className="reveal text-base text-[#444] leading-relaxed mb-10 italic px-2"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.05rem" }}
        >
          « {t.hero.tagline} »
        </p>

        {/* CTA */}
        <div className="reveal flex flex-col items-center gap-3">
          <a
            href="#rsvp"
            className="inline-flex items-center justify-center gap-2 bg-[#8B1A1A] text-white px-8 py-4 text-sm tracking-widest uppercase transition-all duration-300 hover:bg-[#6B1313] active:scale-95 rounded-sm"
            style={{ minWidth: "270px", letterSpacing: "0.12em" }}
          >
            {t.hero.cta}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 7h12M8 2l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <span className="text-[11px] text-[#AAA] tracking-wider">{t.hero.ctaSub}</span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 opacity-30">
        <div className="w-px h-8 bg-[#C9A96E] animate-float" />
        <svg width="8" height="5" viewBox="0 0 8 5" fill="#C9A96E">
          <path d="M0 0L4 5L8 0" />
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C9A96E] to-transparent opacity-30" />
    </section>
  );
}
