/**
 * JSON-LD (Schema.org) builders for review and establishment pages.
 *
 * These are plain functions that take already-resolved values and return
 * serializable objects, so the layouts stay declarative. Absolute URLs are
 * built from `Astro.site`, which each layout passes in.
 *
 * The blog is single-author, so every rating is one person's opinion: a dish
 * review is a `Review` of the `Restaurant` it was eaten at, and an
 * establishment page is a `Restaurant` carrying that same author's overall
 * `review`. Both shapes are eligible for Google's review rich result because
 * `itemReviewed` / the entity is a `Restaurant` (a `LocalBusiness`).
 */

import type { Lang } from '../i18n/ui';

/** The blog's single author. */
const AUTHOR = 'Alf';

/** A single breadcrumb step. `path` is site-relative (e.g. "/en/places/tavola"). */
export interface Crumb {
  name: string;
  path: string;
}

/** Resolve a site-relative path to an absolute URL string. */
export function absUrl(site: URL | undefined, path: string): string {
  return new URL(path, site).href;
}

/** Wrap schema nodes in a single `@graph` document. */
export function jsonLdGraph(nodes: object[]): object {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

function rating(value: number): object {
  return {
    '@type': 'Rating',
    ratingValue: value,
    bestRating: 5,
    worstRating: 0,
  };
}

function author(): object {
  return { '@type': 'Person', name: AUTHOR };
}

export function breadcrumbSchema(site: URL | undefined, crumbs: Crumb[]): object {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: absUrl(site, crumb.path),
    })),
  };
}

export interface ReviewSchemaInput {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  rating: number;
  /** Restaurant / brand / stall the dish belongs to, if any. */
  placeName?: string;
  /** City or area. */
  location?: string;
  /** Absolute URL of the establishment page, when it has one. */
  placeUrl?: string;
  /** Absolute URL of the dish's cover image, if any. */
  image?: string;
}

/** A dish review: a `Review` of the `Restaurant` where it was eaten. */
export function reviewSchema(input: ReviewSchemaInput): object {
  const itemReviewed =
    input.placeName || input.location
      ? {
          '@type': 'Restaurant',
          ...(input.placeName ? { name: input.placeName } : {}),
          ...(input.placeUrl ? { url: input.placeUrl } : {}),
          ...(input.location
            ? { address: { '@type': 'PostalAddress', addressLocality: input.location } }
            : {}),
        }
      : undefined;

  return {
    '@type': 'Review',
    name: input.title,
    reviewBody: input.description,
    datePublished: input.pubDate.toISOString(),
    ...(input.updatedDate ? { dateModified: input.updatedDate.toISOString() } : {}),
    ...(input.image ? { image: input.image } : {}),
    author: author(),
    reviewRating: rating(input.rating),
    ...(itemReviewed ? { itemReviewed } : {}),
  };
}

export interface RestaurantSchemaInput {
  title: string;
  description: string;
  pubDate: Date;
  updatedDate?: Date;
  rating: number;
  location?: string;
  /** Absolute URL of the establishment page. */
  url: string;
  /** Absolute URL of the cover image, if any. */
  image?: string;
}

/** An establishment page: a `Restaurant` with the author's overall `review`. */
export function restaurantSchema(input: RestaurantSchemaInput): object {
  return {
    '@type': 'Restaurant',
    name: input.title,
    description: input.description,
    url: input.url,
    ...(input.image ? { image: input.image } : {}),
    ...(input.location
      ? { address: { '@type': 'PostalAddress', addressLocality: input.location } }
      : {}),
    review: {
      '@type': 'Review',
      author: author(),
      datePublished: input.pubDate.toISOString(),
      ...(input.updatedDate ? { dateModified: input.updatedDate.toISOString() } : {}),
      reviewRating: rating(input.rating),
    },
  };
}

/** One entry in a listing's `ItemList`. `path` is site-relative. */
export interface ListEntry {
  name: string;
  path: string;
}

export interface CollectionSchemaInput {
  name: string;
  description?: string;
  /** Absolute URL of the listing page itself. */
  url: string;
  lang: Lang;
  entries: ListEntry[];
}

/** A listing page: a `CollectionPage` whose `mainEntity` is an ordered `ItemList`. */
export function collectionPageSchema(
  site: URL | undefined,
  input: CollectionSchemaInput,
): object {
  return {
    '@type': 'CollectionPage',
    name: input.name,
    ...(input.description ? { description: input.description } : {}),
    url: input.url,
    inLanguage: input.lang,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: input.entries.length,
      itemListElement: input.entries.map((entry, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: entry.name,
        url: absUrl(site, entry.path),
      })),
    },
  };
}

export interface SiteIdentityInput {
  name: string;
  description: string;
  /** Absolute URL of the home page for this language. */
  url: string;
  lang: Lang;
}

/**
 * Home-page identity: a `WebSite` published by the author `Person`, linked by
 * `@id` so search engines resolve them to a single entity graph.
 */
export function siteIdentitySchema(input: SiteIdentityInput): object[] {
  const websiteId = `${input.url}#website`;
  const personId = `${input.url}#person`;
  return [
    {
      '@type': 'WebSite',
      '@id': websiteId,
      name: input.name,
      description: input.description,
      url: input.url,
      inLanguage: input.lang,
      publisher: { '@id': personId },
    },
    {
      '@type': 'Person',
      '@id': personId,
      name: AUTHOR,
      url: input.url,
    },
  ];
}
