"use client";

import type { Translations } from "@/i18n";
import { Ornament } from "@/components/ui/Ornament";

export default function HowItWorksSection({ t }: { t: Translations }) {
  return (
    <section id="how" className="py-16 px-6 bg-[#FDFCF8] relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-32 h-64 opacity-5 pointer-events-none"
        style={{ background: "radial-gradient(circle, #8B1A1A, transparent 70%)" }} />

      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] text-[#C9A96E] uppercase font-light block mb-3">
            {t.howItWorks.chinese}
          </span>
          <h2
            className="text-2xl font-light tracking-wide text-[#1A1A1A] mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {t.howItWorks.title}
          </h2>
          <Ornament />
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-[#C9A96E] via-[#E8D5B0] to-transparent" />

          <div className="space-y-6">
            {t.howItWorks.steps.map((step, i) => {
              const isKey = i === 4 || i === 5 || i === 6;
              return (
                <div key={i} className="flex gap-5 relative">
                  {/* Step circle */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium z-10 border transition-all
                      ${
                        isKey
                          ? "bg-[#8B1A1A] text-white border-[#8B1A1A]"
                          : "bg-white text-[#8B1A1A] border-[#E8D5B0]"
                      }
                    `}
                    style={{ minWidth: "40px", boxShadow: isKey ? "0 2px 12px rgba(139,26,26,0.2)" : "0 1px 4px rgba(0,0,0,0.05)" }}
                  >
                    {i + 1}
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 p-4 rounded border transition-all duration-200 mb-0
                      ${isKey ? "bg-[#FDF8F0] border-[#E8D5B0]" : "bg-white border-[#F0E8D0]"}
                    `}
                    style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                  >
                    <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1 leading-snug">{step.title}</h3>
                    <p className="text-xs text-[#777] leading-relaxed font-light">{step.desc}</p>
                    {i === 4 && (
                      <span className="inline-flex items-center gap-1 mt-2 text-[10px] text-[#4A7C6B] font-medium tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4A7C6B] inline-block" />
                        Validation automatique
                      </span>
                    )}
                    {i === 6 && (
                      <span className="inline-flex items-center gap-1 mt-2 text-[10px] text-[#8B1A1A] font-medium tracking-wider uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#8B1A1A] inline-block" />
                        Invitation officielle
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
