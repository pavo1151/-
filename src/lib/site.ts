/**
 * Canonical site config. All SEO URLs (canonical / OG / sitemap) derive from SITE_URL,
 * so swapping in a custom domain later is a one-line change.
 *
 * Note: includes the GitHub Pages project sub-path `/-`. If you move to a custom domain
 * (e.g. https://eurovibe.app) set VITE_SITE_URL at build time with no sub-path.
 */
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || "https://pavo1151.github.io/-"
).replace(/\/$/, "");

export const SITE_NAME = "Eurovibe";
export const SITE_TAGLINE = "Find the trip that fits how you want to feel.";
export const SITE_DESCRIPTION =
  "Eurovibe is a premium European travel-decision app. Start from a feeling — get matched to destinations, explore cinematic city portals, simulate trips, compare honestly and decide with confidence.";

/** Build an absolute URL for a route path (e.g. "/discover" → SITE_URL + "/discover"). */
export function absoluteUrl(path: string): string {
  if (!path || path === "/") return SITE_URL + "/";
  return SITE_URL + (path.startsWith("/") ? path : `/${path}`);
}
