import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';
import { getReviews, type Review } from './reviews';

export type Establishment = CollectionEntry<'establishments'>;

/** The slug part of an establishment id, without the leading language folder. */
export function establishmentSlug(entry: Establishment): string {
  return entry.id.replace(/^(es|en)\//, '');
}

/** All published establishments for a language, newest first. */
export async function getEstablishments(lang: Lang): Promise<Establishment[]> {
  const items = await getCollection(
    'establishments',
    ({ data, id }) =>
      data.lang === lang &&
      id.startsWith(`${lang}/`) &&
      (import.meta.env.PROD ? !data.draft : true),
  );
  return items.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}

/**
 * Published reviews (in the establishment's language) whose `establishment`
 * field points at this establishment, newest first.
 */
export async function getReviewsForEstablishment(
  entry: Establishment,
): Promise<Review[]> {
  const reviews = await getReviews(entry.data.lang);
  return reviews.filter((review) => review.data.establishment?.id === entry.id);
}
