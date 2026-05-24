"use client";

import type { Translations } from "@/i18n";
import { Ornament } from "@/components/ui/Ornament";

export default function WhyRsvpSection({ t }: { t: Translations }) {
  const points = [
    { key: "point1", icon: "①", color: "#8B1A1A", title: t.whyRsvp.point1Title, desc: t.whyRsvp.point1 },
    { key: "point2", icon: "②", color: "#8B1A1A", title: t.whyRsvp.point2Title, desc: t.whyRsvp.point2 },
    { key: "point3", icon: "③", color: "#8B1A1A", title: t.whyRsvp.point3Title, desc: t.whyRsvp.point3 },
    { key: "point4", icon: "④", color: "#C9A96E", title: t.whyRsvp.point4Title, desc: t.whyRsvp.point4 },
    { key: "point5", icon: "⑤", color: "#4A7C6B", title: t.whyRsvp.point5Title, desc: t.whyRsvp.point5 },
  ];

  return (
    <section
      id="why"
      className="py-16 px-6 relative"
      style={{ background: "linear-gradient(180deg, #F8F3EC 0%, #F2EAE0 100%)" }}
    >
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] text-[#C9A96E] uppercase font-light block mb-3">
            {t.whyRsvp.chinese}
          </span>
          <h2
            className="text-2xl font-light tracking-wide text-[#1A1A1A] mb-4"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}
          >
            {t.whyRsvp.title}
          </h2>
          <Ornament />
          <p
            className="mt-6 text-base text-[#666] leading-relaxed font-light"
            style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontSize: "1.05rem" }}
          >
            {t.whyRsvp.intro}
          </p>
        </div>

        {/* Points */}
        <div className="space-y-4">
          {points.map((point, i) => (
            <div
              key={point.key}
              className="bg-white rounded p-5 flex gap-4 border border-[#F0E8D0] transition-all duration-200"
              style={{ boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}
            >
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                style={{ background: point.color, minWidth: "32px" }}
              >
                <span className="text-base" style={{ fontFamily: "serif" }}>{i + 1}</span>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1.5 leading-snug">{point.title}</h3>
                <p className="text-sm text-[#666] leading-relaxed font-light">{point.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Important notice */}
        <div className="mt-8 p-5 border border-[#C9A96E] bg-[#FDFAF4] rounded relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-[#8B1A1A]" />
          <p className="text-sm text-[#555] leading-relaxed font-light pl-2">
            <strong className="text-[#8B1A1A] font-medium">Important :</strong>{" "}
            Sans RSVP rempli, aucun dossier ne peut être constitué. Le RSVP est la première étape obligatoire. La contribution complète de{" "}
            <strong className="text-[#8B1A1A]">25 000 FCFA</strong> conditionne l'envoi de l'invitation officielle.
          </p>
        </div>
      </div>
    </section>
  );
}
