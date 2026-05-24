"use client";

import { useState } from "react";
import { getTranslations, detectLocale } from "@/i18n";
import type { Locale } from "@/i18n";
import Navbar from "@/components/public/Navbar";
import HeroSection from "@/components/public/HeroSection";
import EventSection from "@/components/public/EventSection";
import WhyRsvpSection from "@/components/public/WhyRsvpSection";
import HowItWorksSection from "@/components/public/HowItWorksSection";
import RSVPForm from "@/components/public/RSVPForm";
import Footer from "@/components/public/Footer";

function getDefaultLocale(): Locale {
  if (typeof window === "undefined") return "fr";
  const lang = navigator.language || navigator.languages?.[0] || "fr";
  return detectLocale(lang);
}

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>(() => getDefaultLocale());
  const t = getTranslations(locale);

  return (
    <main className="min-h-screen">
      <Navbar t={t} locale={locale} onLocaleChange={setLocale} />
      <HeroSection t={t} />
      <EventSection t={t} />
      <WhyRsvpSection t={t} />
      <HowItWorksSection t={t} />
      <RSVPForm t={t} locale={locale} />
      <Footer t={t} />
    </main>
  );
}
