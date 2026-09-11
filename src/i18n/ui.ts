export const languages = {
  es: "Español",
  en: "English",
} as const;

export const defaultLang = "es";

export type Lang = keyof typeof languages;

/**
 * UI string dictionary. Every key must exist for each language.
 */
export const ui = {
  es: {
    "site.title": "El blog de comida de Alf",
    "site.description":
      "Pensamientos y sentimientos alrededor de la comida, principalmente en Mérida, Yucatán.",
    "nav.reviews": "Reseñas",
    "nav.menu": "Menú",
    "home.latest": "Últimas reseñas",
    "home.announcements": "Últimos anuncios",
    "home.intro":
      "Un pequeño espacio donde comparto lo que como, y lo que pienso al respecto. Ubicado en Mérida, Yucatán.",
    "reviews.title": "Todas las reseñas",
    "reviews.empty": "Todavía no hay reseñas publicadas. ¡Vuelve pronto!",
    "review.published": "Publicado el",
    "review.updated": "Editado el",
    "review.back": "← Volver a las reseñas",
    "review.rating": "Valoración",
    "announcements.empty": "Todavía no hay anuncios.",
    "announcement.published": "Publicado el",
    "announcement.back": "← Volver al inicio",
    "theme.toggle": "Cambiar tema",
    "lang.switch": "Cambiar idioma",
  },
  en: {
    "site.title": "Alf's food blog",
    "site.description":
      "Thoughts and feelings around food, mainly in Mérida, Yucatán.",
    "nav.reviews": "Reviews",
    "nav.menu": "Menu",
    "home.latest": "Latest reviews",
    "home.announcements": "Latest announcements",
    "home.intro":
      "A space where I share what I eat, and what I think about it. Based in Mérida, Yucatán.",
    "reviews.title": "All reviews",
    "reviews.empty": "No reviews published yet. Check back soon!",
    "review.published": "Published on",
    "review.updated": "Edited on",
    "review.back": "← Back to reviews",
    "review.rating": "Rating",
    "announcements.empty": "No announcements yet.",
    "announcement.published": "Published on",
    "announcement.back": "← Back to home",
    "theme.toggle": "Toggle theme",
    "lang.switch": "Switch language",
  },
} as const;

/** Localized top-level route segment for the reviews index, per language. */
export const routes = {
  es: { reviews: "resenas", announcements: "anuncios" },
  en: { reviews: "reviews", announcements: "announcements" },
} as const;
