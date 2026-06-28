import type { Destination } from "@/types";
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, absoluteUrl } from "./site";

/** Global WebSite + Organization structured data (used on the home page). */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL + "/",
    description: SITE_DESCRIPTION,
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL + "/",
    slogan: "Find the trip that fits how you want to feel.",
  };
}

/** TouristDestination structured data for a destination deep card. */
export function destinationJsonLd(d: Destination) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    name: d.city,
    description: d.shortVibe,
    url: absoluteUrl(`/destination/${d.id}`),
    address: {
      "@type": "PostalAddress",
      addressLocality: d.city,
      addressCountry: d.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: d.latitude,
      longitude: d.longitude,
    },
    touristType: d.bestFor,
    keywords: d.atmosphereTags.join(", "),
  };
}

/** BreadcrumbList for a destination page. */
export function breadcrumbJsonLd(d: Destination) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Discover", item: absoluteUrl("/discover") },
      { "@type": "ListItem", position: 2, name: d.city, item: absoluteUrl(`/destination/${d.id}`) },
    ],
  };
}

/** A concise meta description for a destination. */
export function destinationDescription(d: Destination): string {
  return `${d.city}, ${d.country} — ${d.shortVibe} Daily cost ${d.dailyCostNormal}. See why it fits, honest trade-offs, nightlife, queer scene, food and a cinematic city portal on Eurovibe.`;
}
