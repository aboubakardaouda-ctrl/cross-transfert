"use client";

import type { Translations } from "@/i18n";
import { Ornament } from "@/components/ui/Ornament";

export default function EventSection({ t }: { t: Translations }) {
  const highlights = [
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#8B1A1A" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="9" cy="7" r="4" stroke="#8B1A1A" strokeWidth="1.5" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      ),
      title: t.event.highlight1Title,
      desc: t.event.highlight1,
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="#8B1A1A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="#C9A96E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: t.event.highlight2Title,
      desc: t.event.highlight2,
    },
    {
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="#8B1A1A" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: t.event.highlight3Title,
      desc: t.event.highlight3,
    },
  ];

  return (
    <section id="event" className="py-16 px-6 bg-[#FDFCF8] relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute top-0 right-0 w-48 h-48 opacity-5 pointer-events-none"
        style={{
          background: "radial-gradient(circle, #C9A96E 0%, transparent 70%)",
        }}
      />

      <div className="max-w-md mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
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
        </div>

        {/* Description */}
        <p
          className="text-base text-[#555] leading-relaxed text-center mb-12 font-light"
          style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.1rem" }}
        >
          {t.event.description}
        </p>

        {/* Highlights */}
        <div className="space-y-4 mb-12">
          {highlights.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-5 bg-white rounded border border-[#F0E8D0] transition-all duration-200"
              style={{ boxShadow: "0 1px 8px rgba(201,169,110,0.08)" }}
            >
              <div className="flex-shrink-0 w-10 h-10 bg-[#FDF8F0] rounded-full flex items-center justify-center border border-[#E8D5B0]">
                {item.icon}
              </div>
              <div>
                <h3 className="text-sm font-medium text-[#1A1A1A] mb-1 tracking-wide">{item.title}</h3>
                <p className="text-sm text-[#777] leading-relaxed font-light">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contribution box */}
        <div
          className="relative overflow-hidden rounded p-6 text-center"
          style={{
            background: "linear-gradient(135deg, #8B1A1A 0%, #6B1313 100%)",
            boxShadow: "0 8px 32px rgba(139,26,26,0.25)",
          }}
        >
          <div className="absolute inset-0 opacity-10 pattern-bg" />
          <p className="text-[10px] tracking-[0.3em] text-[#E8D5B0] uppercase mb-2 relative z-10">
            {t.event.contribution}
          </p>
          <p
            className="text-4xl font-light text-white mb-2 relative z-10"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {t.event.contributionAmount}
          </p>
          <p className="text-xs text-[#E8D5B0] opacity-80 relative z-10">{t.event.contributionNote}</p>

          {/* Corner ornaments */}
          <div className="absolute top-3 left-3 w-4 h-4 border-t border-l border-[#C9A96E] opacity-50" />
          <div className="absolute top-3 right-3 w-4 h-4 border-t border-r border-[#C9A96E] opacity-50" />
          <div className="absolute bottom-3 left-3 w-4 h-4 border-b border-l border-[#C9A96E] opacity-50" />
          <div className="absolute bottom-3 right-3 w-4 h-4 border-b border-r border-[#C9A96E] opacity-50" />
        </div>
      </div>
    </section>
  );
}
