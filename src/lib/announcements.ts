import { getCollection, type CollectionEntry } from 'astro:content';
import type { Lang } from '../i18n/ui';

export type Announcement = CollectionEntry<'announcements'>;

/** The slug part of an announcement id, without the leading language folder. */
export function announcementSlug(entry: Announcement): string {
  return entry.id.replace(/^(es|en)\//, '');
}

/** All published announcements for a language, newest first. */
export async function getAnnouncements(lang: Lang): Promise<Announcement[]> {
  const items = await getCollection(
    'announcements',
    ({ data, id }) =>
      data.lang === lang &&
      id.startsWith(`${lang}/`) &&
      (import.meta.env.PROD ? !data.draft : true),
  );
  return items.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
}
