import fr from "./fr";
import en from "./en";
import zh from "./zh";

export type Locale = "fr" | "en" | "zh";
export type Translations = typeof fr;

const translations: Record<Locale, Translations> = { fr, en, zh };

export function getTranslations(locale: Locale): Translations {
  return translations[locale] || translations.fr;
}

export function detectLocale(acceptLanguage?: string): Locale {
  if (!acceptLanguage) return "fr";
  const lang = acceptLanguage.toLowerCase();
  if (lang.startsWith("zh")) return "zh";
  if (lang.startsWith("en")) return "en";
  return "fr";
}

export { fr, en, zh };
