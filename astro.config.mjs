// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://food.amedpal.com',
  integrations: [mdx(), sitemap()],
  // Let Astro resize and convert CDN images to WebP at build time.
  image: { domains: ['cdn.amedpal.com'] },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      // Spanish (primary) is served from the root, English from /en/
      prefixDefaultLocale: false,
    },
  },
});
