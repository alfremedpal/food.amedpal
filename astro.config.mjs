// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://food.amedpal.com',
  integrations: [mdx()],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: {
      // Spanish (primary) is served from the root, English from /en/
      prefixDefaultLocale: false,
    },
  },
});
