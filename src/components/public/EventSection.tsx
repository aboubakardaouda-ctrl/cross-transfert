"use client";

import type { Translations } from "@/i18n";
import { Ornament } from "@/components/ui/Ornament";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function EventSection({ t }: { t: Translations }) {
  const highlights = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M11 2L13.5 8H20L14.5 12L16.5 18.5L11 14.5L5.5 18.5L7.5 12L2 8H8.5L11 2Z" stroke="#8B1A1A" strokeWidth="1.3" strokeLinejoin="round" />
        </svg>
      ),
      title: t.event.highlight1Title,
      desc: t.event.highlight1,
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="8.5" stroke="#8B1A1A" strokeWidth="1.3" />
          <path d="M11 6v5.5l3.5 2.5" stroke="#C9A96E" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      ),
      title: t.event.highlight2Title,
      desc: t.event.highlight2,
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M16 8v-2a5 5 0 00-10 0v2M4 8h14l1 12H3L4 8z" stroke="#8B1A1A" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: t.event.highlight3Title,
      desc: t.event.highlight3,
    },
  ];

  return (
    <section id="event" className="py-16 px-6 bg-[#FDFCF8] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-56 h-56 opacity-4 pointer-events-none"
        style={{ background: "radial-gradient(circle, #C9A96E 0%, transparent 70%)" }} />

      <div className="max-w-md mx-auto">
        {/* Header */}
        <ScrollReveal className="text-center mb-10">
          <span className="text-[10px] tracking-[0.3em] text-[#C9A96E] uppercase font-light block mb-3">
            {t.event.chinese}
          </span>
          <h2
            className="text-2xl font-light tracking-wide text-[#1A1A1A] mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {t.event.title}
          </h2>
          <Ornament />
        </ScrollReveal>

        {/* Description */}
        <ScrollReveal delay={100}>
          <p
            className="text-base text-[#555] leading-relaxed text-center mb-8 font-light"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.1rem" }}
          >
            {t.event.description}
          </p>
        </ScrollReveal>

        {/* Theme box */}
        <ScrollReveal delay={150}>
          <div className="mb-8 p-5 border border-[#E8D5B0] bg-[#FDF8F0] rounded-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#8B1A1A]" />
            <p className="text-[10px] tracking-[0.25em] text-[#C9A96E] uppercase mb-2 pl-3">{t.event.themeLabel}</p>
            <p
              className="text-sm text-[#333] leading-relaxed italic pl-3"
              style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1rem" }}
            >
              « {t.event.theme} »
            </p>
          </div>
        </ScrollReveal>

        {/* Date / Heure / Lieu */}
        <ScrollReveal delay={200}>
          <div className="grid grid-cols-3 gap-3 mb-8">
            {[
              { label: t.event.dateLabel, value: t.event.date, icon: "◷" },
              { label: t.event.timeLabel, value: t.event.time, icon: "◎" },
              { label: t.event.locationLabel, value: t.event.location, icon: "◇" },
            ].map((item) => (
              <div key={item.label} className="bg-white border border-[#F0E8D0] rounded p-3 text-center"
                style={{ boxShadow: "0 1px 6px rgba(201,169,110,0.08)" }}>
                <p className="text-lg text-[#C9A96E] mb-1">{item.icon}</p>
                <p className="text-[10px] text-[#AAA] tracking-wider uppercase mb-1">{item.label}</p>
                <p className="text-xs text-[#333] font-medium leading-snug">{item.value}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* Highlights */}
        <div className="space-y-3 mb-8">
          {highlights.map((item, i) => (
            <ScrollReveal key={i} delay={i * 80} direction="left">
              <div
                className="flex items-start gap-4 p-4 bg-white rounded border border-[#F0E8D0]"
                style={{ boxShadow: "0 1px 8px rgba(201,169,110,0.07)" }}
              >
                <div className="flex-shrink-0 w-9 h-9 bg-[#FDF8F0] rounded-full flex items-center justify-center border border-[#E8D5B0]">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#1A1A1A] mb-0.5">{item.title}</h3>
                  <p className="text-xs text-[#777] leading-relaxed font-light">{item.desc}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Contribution */}
        <ScrollReveal delay={100}>
          <div
            className="relative overflow-hidden rounded p-6 text-center"
            style={{
              background: "linear-gradient(135deg, #8B1A1A 0%, #6B1313 100%)",
              boxShadow: "0 8px 32px rgba(139,26,26,0.25)",
            }}
          >
            <div className="absolute inset-0 opacity-10 pattern-bg" />
            <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#C9A96E] opacity-50" />
            <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#C9A96E] opacity-50" />
            <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#C9A96E] opacity-50" />
            <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#C9A96E] opacity-50" />
            <p className="text-[10px] tracking-[0.3em] text-[#E8D5B0] uppercase mb-1 relative z-10">{t.event.contribution}</p>
            <p className="text-4xl font-light text-white mb-1 relative z-10"
              style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              {t.event.contributionAmount}
            </p>
            <p className="text-xs text-[#E8D5B0] opacity-80 relative z-10">{t.event.contributionNote}</p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
