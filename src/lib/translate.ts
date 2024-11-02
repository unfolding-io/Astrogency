import { SITE_LANG } from "astro:env/client";

import en from "@/i18n/en.json";
import de from "@/i18n/de.json";
import es from "@/i18n/es.json";
import nl from "@/i18n/nl.json";
import fr from "@/i18n/fr.json";

const translations: Record<string, Locale> = {
  en,
  de,
  es,
  nl,
  fr,
};

export function useTranslations(lang: string) {
  return function t(key: string) {
    if (!translations[lang]) return key;
    return translations[lang][key] || translations[SITE_LANG][key] || key;
  };
}

export function translateUrl(
  url: URL,
  locales: string[],
  removeCurrentLanguage?: boolean,
) {
  const [, lang] = url.pathname.split("/");
  let baseUrl = url.pathname;
  let currentLang = SITE_LANG;

  if (locales.includes(lang)) {
    baseUrl = url.pathname.replace(`/${lang}`, "");
    currentLang = lang;
  }

  let urls = locales.map((locale) => {
    return {
      locale,
      url: locale === SITE_LANG ? baseUrl : `/${locale}${baseUrl}`,
    };
  });

  if (removeCurrentLanguage)
    urls = urls.filter((u) => u.locale !== currentLang);

  return urls;
}

export function getLangFromUrl(url: URL) {
  const ui = Object.keys(translations);
  const [, lang] = url.pathname.split("/");
  if (ui.includes(lang)) return lang as string;
  return SITE_LANG;
}
