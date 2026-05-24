"use client";

import { useCallback } from "react";
import type { Locale } from "@/i18n";

const LANGS: { code: Locale; label: string; short: string }[] = [
  { code: "fr", label: "Français", short: "FR" },
  { code: "en", label: "English", short: "EN" },
  { code: "zh", label: "中文", short: "中" },
];

export default function LanguageSwitcher({
  current,
  onChange,
}: {
  current: Locale;
  onChange: (l: Locale) => void;
}) {
  return (
    <div className="flex items-center gap-1">
      {LANGS.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onChange(lang.code)}
          className={`
            px-2.5 py-1 text-xs rounded transition-all duration-200 font-light tracking-wider
            ${
              current === lang.code
                ? "bg-[#8B1A1A] text-white"
                : "text-[#888] hover:text-[#8B1A1A] hover:bg-[#F0E8D0]"
            }
          `}
          aria-label={lang.label}
        >
          {lang.short}
        </button>
      ))}
    </div>
  );
}
