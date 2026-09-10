import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type Review = CollectionEntry<'reviews'>;

/** The slug part of a review id, without the leading language folder. */
export function reviewSlug(entry: Review): string {
  return entry.id.replace(/^(es|en)\//, '');
}

/** All published reviews for a language, newest first. */
export async function getReviews(lang: Lang): Promise<Review[]> {
  const reviews = await getCollection(
    'reviews',
    ({ data, id }) =>
      data.lang === lang &&
      id.startsWith(`${lang}/`) &&
      (import.meta.env.PROD ? !data.draft : true),
  );
  return reviews.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}
