# food.amedpal

A personal food blog built with [Astro](https://astro.build) — honest **reviews
of the food I eat** (dishes, restaurants, cravings). Static, bilingual (Spanish
primary / English), with light and dark themes.

## Structure

```text
src/
├── components/        # Header, Footer, ReviewCard, Rating, ThemeToggle, LanguagePicker
├── content/
│   └── reviews/
│       ├── es/        # Spanish reviews (MDX)
│       └── en/        # English reviews (MDX)
├── i18n/
│   ├── ui.ts          # UI strings + localized route segments (es is source of truth)
│   └── utils.ts       # t(), localizedPath(), date formatting…
├── layouts/           # BaseLayout, ReviewLayout
├── lib/reviews.ts     # querying reviews by language
├── pages/
│   ├── index.astro          # ES home        →  /
│   ├── resenas/            # ES reviews     →  /resenas/…
│   ├── sobre-mi.astro       # ES about       →  /sobre-mi/
│   └── en/                  # English mirror →  /en/…
├── styles/global.css  # design tokens + light/dark themes
└── content.config.ts  # reviews collection schema
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
tags: [croquettes, tapas]
translationKey: croquetas-casa-julia   # optional — links the ES/EN versions
heroImage: ./croquetas.jpg             # optional — relative to the .md file
draft: false
---

Review body in Markdown…
```

Give a review and its translation the **same `translationKey`** so the language
switcher can jump between them. Drafts (`draft: true`) are hidden in production.

## Commands

| Command             | Action                                   |
| :------------------ | :--------------------------------------- |
| `pnpm dev`          | Dev server at `localhost:4321`           |
| `pnpm build`        | Build to `./dist/`                       |
| `pnpm preview`      | Preview the production build             |
| `pnpm astro check`  | Type-check the project                   |
