import { Helmet } from "react-helmet-async";
import { SITE_NAME, SITE_DESCRIPTION, SITE_TAGLINE, absoluteUrl } from "@/lib/site";

export interface SeoProps {
  title?: string;
  description?: string;
  /** route path for canonical/OG url, e.g. "/discover" */
  path?: string;
  image?: string;
  /** "website" | "article" | "place" */
  type?: string;
  /** optional JSON-LD structured data object(s) */
  jsonLd?: object | object[];
  noindex?: boolean;
}

/**
 * Per-route document head: title, description, canonical, OpenGraph, Twitter and JSON-LD.
 * Mirrors what scripts/seo-build.mjs injects statically at build time (crawlers), while this
 * keeps the head correct during client-side navigation.
 */
export function Seo({
  title,
  description = SITE_DESCRIPTION,
  path = "/",
  image,
  type = "website",
  jsonLd,
  noindex,
}: SeoProps) {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} — ${SITE_TAGLINE}`;
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(image ?? "/og-default.svg");
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex" />}

      {/* OpenGraph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  );
}
