import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const reviews = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/reviews' }),
  schema: ({ image }) =>
    z.object({
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
      heroImage: image().optional(),
      /** Slug of the same review in the other language, for the lang switcher. */
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
  schema: ({ image }) =>
    z.object({
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
      heroImage: image().optional(),
      /** Slug of the same announcement in the other language. */
      translationKey: z.string().optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { reviews, announcements };
