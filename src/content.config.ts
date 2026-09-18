import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const reviews = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/reviews' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lang: z.enum(['es', 'en']),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** Overall score, 0–5 (halves allowed, e.g. 4.5). */
    rating: z.number().min(0).max(5),
    tags: z.array(z.string()).default([]),
    /** Where it was eaten — restaurant, brand, market stall… */
    place: z.string().optional(),
    /** City or area. */
    location: z.string().optional(),
    /**
     * The establishment this dish belongs to, as the lang-prefixed id of an
     * entry in the establishments collection. When set,
     * the review links up to the establishment page and the establishment lists
     * this dish. Leave unset for one-off spots that don't need their own page —
     * use the free-text `place` for those. Validated at build time.
     */
    establishment: reference('establishments').optional(),
    /** Full CDN URL of the cover image (e.g. https://cdn.food.amedpal.com/…). */
    heroImage: z.string().url().optional(),
    /** Slug of the same review in the other language, for the lang switcher. */
    translationKey: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

/**
 * Establishments — restaurants, brands, market stalls reviewed as a whole,
 * separate from the individual dishes. Same bilingual MDX authoring format as
 * reviews (es/en folders + translationKey). A review points at one of these via
 * its `establishment` field; the establishment page lists every dish reviewed
 * there. Its own `rating` is the place overall, independent of the dishes.
 */
const establishments = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/establishments' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lang: z.enum(['es', 'en']),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** Overall score for the place, 0–5 (halves allowed). */
    rating: z.number().min(0).max(5),
    tags: z.array(z.string()).default([]),
    /** City or area. */
    location: z.string().optional(),
    /** Full CDN URL of the cover image (e.g. https://cdn.food.amedpal.com/…). */
    heroImage: z.string().url().optional(),
    /** Slug of the same establishment in the other language, for the switcher. */
    translationKey: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

/**
 * Announcements use the same MDX authoring format as reviews, minus the
 * review-specific fields (no rating/place). They live in
 * src/content/announcements/{lang}/{slug}.mdx and always carry an
 * "announcement" tag (enforced below).
 */
const announcements = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/announcements' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    lang: z.enum(['es', 'en']),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z
      .array(z.string())
      .default([])
      .transform((tags) =>
        tags.includes('announcement') ? tags : ['announcement', ...tags],
      ),
    /** Full CDN URL of the cover image (e.g. https://cdn.food.amedpal.com/…). */
    heroImage: z.string().url().optional(),
    /** Slug of the same announcement in the other language. */
    translationKey: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { reviews, announcements, establishments };
