# food.amedpal

A personal food blog built with [Astro](https://astro.build), **reviews of the food I eat** (dishes, restaurants, etc.). 100% static deployed through Cloudflare over at (food.amedpal.com)[https://food.amedpal.com/en/].

## AI disclosure

AI agents have been used in this repo to help create the codebase in which the whole blog runs. However, the **actual blog posts are always hand written by me** (directly from the heart, and stomach) without the assistance of any sort of AI tool or assistant. Sometimes I will use translation services (like Google translate) to translate from English to Spanish or vice versa to help me write my reviews faster, but not without adjusting it beforehand to ensure the tone I want to portray is present throughput the blog post. 

## Getting started

```sh
pnpm install    # install dependencies
pnpm dev        # start the dev server at localhost:4321
```

## Commands

| Command             | Action                          |
| :------------------ | :------------------------------ |
| `pnpm dev`          | Dev server at `localhost:4321`  |
| `pnpm build`        | Build to `./dist/`              |
| `pnpm preview`      | Preview the production build    |
| `pnpm astro check`  | Type-check the project          |

## Writing

Reviews and announcements live under `src/content/` as MDX files, one per language (`es`, `en`). Drop a new `.mdx` file in the right folder, fill in the frontmatter, and it shows up on the home page automatically.

---

Working on the code? See [`AGENTS.md`](./AGENTS.md) for the project structure, i18n setup, theming, content schemas, and feeds/sitemap details.
