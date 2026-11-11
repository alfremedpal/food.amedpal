/**
 * Shared settings for the <Image> components so every card / hero / gallery
 * gets a responsive srcset and a sensible compression level.
 *
 * `sizes` must describe how wide the image is actually *displayed* (CSS px),
 * so the browser can pick the smallest candidate from `widths` that still
 * looks sharp on its screen density. Keep these in sync with the layout CSS:
 *   - .container: max 1080px wide, 1.25rem side padding
 *   - card grids: repeat(auto-fill, minmax(280px, 1fr)), 1.5rem gap
 *     → 1 column on phones, 2 on tablets, 3 (≈330px each) on desktop
 *   - home-page grids become a swipeable row of 82%-wide cards ≤640px
 *   - heroes and galleries are capped at --content-width (68ch ≈ 720px)
 */

/** Cards: WebP at q65 is visually indistinguishable at this size. */
export const CARD_QUALITY = 65;
export const CARD_WIDTHS = [360, 540, 720, 1080];

/** Card in a regular grid (listing pages, an establishment's dishes). */
export const CARD_SIZES_GRID =
  '(max-width: 640px) calc(100vw - 2.5rem), (max-width: 900px) calc(50vw - 2rem), 340px';

/** Card in the home page's mobile swipe row (82% of the container). */
export const CARD_SIZES_SCROLLER =
  '(max-width: 640px) calc(82vw - 2rem), (max-width: 900px) calc(50vw - 2rem), 340px';

/** Large photos (page heroes, carousels) are worth a bit more quality. */
export const LARGE_QUALITY = 75;
export const LARGE_WIDTHS = [480, 720, 1080, 1280];
export const LARGE_SIZES = '(max-width: 760px) calc(100vw - 2.5rem), 720px';
