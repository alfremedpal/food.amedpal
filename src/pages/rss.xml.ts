import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { ui } from '../i18n/ui';
import { localizedPath, routeSegment } from '../i18n/utils';
import { getReviews, reviewSlug } from '../lib/reviews';

const lang = 'es' as const;

export async function GET(context: APIContext) {
  const reviews = await getReviews(lang);

  return rss({
    title: ui[lang]['site.title'],
    description: ui[lang]['site.description'],
    site: context.site!,
    items: reviews.map((review) => ({
      title: review.data.title,
      description: review.data.description,
      pubDate: review.data.pubDate,
      link: localizedPath(
        lang,
        `${routeSegment(lang, 'reviews')}/${reviewSlug(review)}`,
      ),
      categories: review.data.tags,
    })),
    customData: `<language>es-ES</language>`,
  });
}
