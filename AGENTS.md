## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Commands

| Command             | Action                                   |
| :------------------ | :--------------------------------------- |
| `pnpm dev`          | Dev server at `localhost:4321`           |
| `pnpm build`        | Build to `./dist/`                       |
| `pnpm preview`      | Preview the production build             |
| `pnpm astro check`  | Type-check the project                   |

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Project structure

```text
src/
├── components/        # Header, Footer, ReviewCard, EstablishmentCard, Rating, ThemeToggle, LanguagePicker
├── content/
│   ├── reviews/
│   │   ├── es/        # Spanish reviews (MDX)
│   │   └── en/        # English reviews (MDX)
│   └── establishments/
│       ├── es/        # Spanish establishments (MDX)
│       └── en/        # English establishments (MDX)
├── i18n/
│   ├── ui.ts          # UI strings + localized route segments (es is source of truth)
│   └── utils.ts       # t(), localizedPath(), date formatting…
├── layouts/           # BaseLayout, ReviewLayout, EstablishmentLayout
├── lib/
│   ├── reviews.ts        # querying reviews by language
│   └── establishments.ts # querying establishments + their dishes
├── pages/
│   ├── index.astro          # ES home        →  /
│   ├── resenas/            # ES reviews     →  /resenas/…
│   ├── lugares/            # ES places      →  /lugares/…
│   ├── sobre-mi.astro       # ES about       →  /sobre-mi/
│   └── en/                  # English mirror →  /en/…
├── styles/global.css  # design tokens + light/dark themes
└── content.config.ts  # reviews, announcements & establishments schemas
```

## Languages

Spanish is the default and served from the root (`/`); English lives under
`/en/`. Config is in `astro.config.mjs` (`i18n`). UI strings live in
`src/i18n/ui.ts` — add a key to **both** `es` and `en`.

## Themes & type

Light and dark are driven by CSS variables in `src/styles/global.css` — a clean
neutral light theme and a gray dark theme, both with a bright-green accent. The
active theme is stored in `localStorage` and applied before first paint (inline
script in `BaseLayout.astro`) to avoid a flash; toggle via the header button.
Type is **Montserrat** (loaded from Google Fonts in `BaseLayout.astro`).

## Adding a review

Reviews are written in **MDX** (`.mdx`) rather than plain Markdown, so a review
can `import` and use custom Astro/UI components inline (rating breakdowns, image
galleries, maps…) as the blog grows. Everything you'd write in Markdown still
works. Create a file under `src/content/reviews/<lang>/<slug>.mdx`:

```markdown
---
title: Ham Croquettes at Casa Julia
description: Creamy inside, crunchy outside. A classic that never misses.
lang: en
pubDate: 2026-08-20
updatedDate: 2026-09-05  # optional — shown as "Edited on" when present
rating: 4.5              # 0–5, halves allowed
place: Casa Julia        # optional — restaurant / brand / stall
location: Madrid         # optional — city or area
establishment: en/casa-julia   # optional — lang-prefixed id of an establishment
tags: [croquettes, tapas]
translationKey: croquetas-casa-julia   # optional — links the ES/EN versions
heroImage: ./croquetas.jpg             # optional — relative to the .md file
draft: false
---

Review body in Markdown…
```

Give a review and its translation the **same `translationKey`** so the language
switcher can jump between them. Drafts (`draft: true`) are hidden in production.

Set `establishment` when the dish belongs to a place that has its own page (see
[Establishments](#establishments)). Its value is the **lang-prefixed id** of an
establishment entry (`en/casa-julia`, `es/casa-julia`) and is **validated at
build time** — a typo fails the build. Leave it unset for one-off spots; the
free-text `place` still shows and no upward link is rendered.

## Establishments

Establishments are places (restaurants, brands, market stalls) reviewed **as a
whole**, separate from the individual dishes. They're their own collection using
the **same bilingual MDX format** as reviews, and live in
`src/content/establishments/<lang>/<slug>.mdx`. Each one gets its own page
(`/lugares/…` in Spanish, `/en/places/…` in English) that shows its overall
rating and writeup, then auto-lists every dish reviewed there. A "Places"
listing lives at `/lugares/` and `/en/places/`, linked from the header nav.

```markdown
---
title: Casa Julia
description: A cozy neighborhood tapas spot that rarely disappoints.
lang: en
pubDate: 2026-08-20
updatedDate: 2026-09-05  # optional — shown as "Edited on" when present
rating: 4                # 0–5, halves allowed — the place *overall*
location: Madrid         # optional — city or area
tags: [restaurant]
translationKey: casa-julia   # optional — links the ES/EN versions
heroImage: https://cdn.amedpal.com/food/…   # optional — full CDN URL
draft: false
---

Your overall take on the place…
```

**Linking dishes to a place.** In a review's frontmatter, set
`establishment: <lang>/<slug>` (the lang-prefixed id of the establishment, e.g.
`en/casa-julia`). That's the only wiring needed — the dish then appears on the
place's page automatically, and the review page links up to the place. Point a
review at the establishment **in its own language** (an `en` review →
`en/casa-julia`). The reference is validated at build time, so a wrong id fails
the build rather than breaking silently.

As with reviews, give an establishment and its translation the same
`translationKey` so the switcher can jump between them, and `draft: true` hides
it in production. A review that links to a still-draft establishment won't render
the upward link in production until the establishment is published, to avoid a
dead link.

## Announcements

Announcements are a separate collection that uses the **same MDX format** as
reviews (minus the review-only fields like `rating`). They live in
`src/content/announcements/<lang>/<slug>.mdx`, always carry an `announcement`
tag (added automatically), and appear in the "Latest announcements" section on
the home page — right after the reviews — each linking to its own page
(`/anuncios/…` in Spanish, `/en/announcements/…` in English).

```markdown
---
title: The blog is live!
description: A new corner to share what I eat.
lang: en
pubDate: 2026-09-10
translationKey: hola-mundo   # optional — links the ES/EN versions
---

Announcement body in MDX…
```

## Feeds & sitemap

- **Sitemap** — `@astrojs/sitemap` generates `sitemap-index.xml` at build time,
  listing every page in both languages. `public/robots.txt` points crawlers to it.
- **RSS** — one feed per language: Spanish at `/rss.xml`, English at
  `/en/rss.xml` (see `src/pages/rss.xml.ts` and `src/pages/en/rss.xml.ts`). Each
  page advertises its feed via a `<link rel="alternate">` in the head.

The sitemap is only emitted by `astro build`, not the dev server; the RSS
endpoints work in both.
