// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://food.amedpal.com',
  integrations: [mdx(), sitemap()],
  // Inline the (small) global stylesheet into each page so it doesn't block
  // first render with an extra request.
  build: { inlineStylesheets: 'always' },
  // Self-host Montserrat (downloaded from Google Fonts at build time) instead
  // of loading it from fonts.googleapis.com, which blocked first render.
  // Montserrat is variable, so one file per style covers 300–700.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Montserrat',
      cssVariable: '--font-montserrat',
      weights: ['300 700'],
      styles: ['normal', 'italic'],
      subsets: ['latin'],
      fallbacks: ['sans-serif'],
    },
  ],
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
