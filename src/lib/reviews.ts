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
  return reviews.sort(sortByDateThenKey);
}

/**
 * Newest first, with a stable, language-independent tiebreaker for entries
 * that share a pubDate: the translationKey (shared across languages) so the
 * same items order identically in es and en. Falls back to the slug when an
 * entry has no translationKey.
 */
export function sortByDateThenKey(
  a: Review,
  b: Review,
): number {
  const byDate = b.data.pubDate.valueOf() - a.data.pubDate.valueOf();
  if (byDate !== 0) return byDate;
  const ka = a.data.translationKey ?? reviewSlug(a);
  const kb = b.data.translationKey ?? reviewSlug(b);
  return ka.localeCompare(kb);
}
