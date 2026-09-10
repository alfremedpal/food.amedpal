import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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

export const collections = { reviews };
