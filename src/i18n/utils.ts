import { ui, defaultLang, routes, type Lang } from "./ui";

/** Extract the language from a URL pathname (e.g. /en/recetas → 'en'). */
export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split("/");
  if (seg in ui) return seg as Lang;
  return defaultLang;
}

/** Returns a `t('key')` translator bound to the given language. */
export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

/**
 * Build a localized path. The default language (es) is served from the root;
 * English is prefixed with its code.
 */
export function localizedPath(lang: Lang, path = ""): string {
  const clean = path.replace(/^\/+/, "");
  const prefix = lang === defaultLang ? "" : `/${lang}`;
  const suffix = clean ? `/${clean}` : "/";
  return `${prefix}${suffix}`.replace(/\/{2,}/g, "/");
}

/** Localized route segments  */
export function routeSegment(
  lang: Lang,
  key: keyof (typeof routes)[Lang],
): string {
  return routes[lang][key];
}

/** Format a date for display in the given language. */
export function formatDate(date: Date, lang: Lang): string {
  return new Intl.DateTimeFormat(lang === "es" ? "es-ES" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    // Dates in frontmatter are calendar dates (no time); format them in UTC so
    // they don't shift a day back in negative-offset timezones.
    timeZone: "UTC",
  }).format(date);
}
