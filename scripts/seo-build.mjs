/**
 * Post-build SEO generator (runs after `vite build`, in CI too — no browser needed).
 *
 * For every known route it writes a route-specific dist/<route>/index.html with:
 *  - a unique <title> + <meta description> + canonical + OpenGraph/Twitter tags
 *  - JSON-LD structured data
 *  - crawlable initial content inside #root (React replaces it on hydration)
 * It also emits dist/sitemap.xml.
 *
 * The compact data below intentionally mirrors a small slice of src/data/destinations.ts
 * (id, city, country, vibe, cost) — kept tiny and stable to avoid a TS transpile step in CI.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, "..", "dist");
const SITE_URL = (process.env.VITE_SITE_URL || "https://pavo1151.github.io/-").replace(/\/$/, "");
const NAME = "Eurovibe";
const DESC =
  "Eurovibe is a premium European travel-decision app. Start from a feeling — get matched to destinations, explore cinematic city portals, simulate trips, compare honestly and decide with confidence.";

const DESTS = [
  { id: "prague", city: "Prague", country: "Czech Republic", vibe: "Beautiful, walkable, tourist-heavy, classic and nightlife-friendly.", cost: "€75–115", lat: 50.0755, lng: 14.4378, tags: ["Old streets", "Beer nights", "Bridges"] },
  { id: "belgrade", city: "Belgrade", country: "Serbia", vibe: "Cheap, raw, social, late-night and energetic.", cost: "€50–80", lat: 44.7866, lng: 20.4489, tags: ["Raw", "Late-night", "River energy"] },
  { id: "athens", city: "Athens", country: "Greece", vibe: "Warm, chaotic, ancient, queer-friendly and Mediterranean.", cost: "€80–120", lat: 37.9838, lng: 23.7275, tags: ["Warm", "Mediterranean", "Nightlife"] },
  { id: "sofia", city: "Sofia", country: "Bulgaria", vibe: "Low-cost, practical, calm, simple and Balkan.", cost: "€45–70", lat: 42.6977, lng: 23.3219, tags: ["Low-cost", "Calm", "Balkan"] },
  { id: "budapest", city: "Budapest", country: "Hungary", vibe: "Grand, elegant, nightlife-heavy, touristic and comfortable.", cost: "€75–115", lat: 47.4979, lng: 19.0402, tags: ["Grand", "River", "Ruin bars"] },
];

const STATIC_ROUTES = [
  { path: "/", title: null, description: DESC, priority: "1.0",
    content: `<h1>${NAME} — Find the trip that fits how you want to feel.</h1><p>${DESC}</p>` },
  { path: "/discover", title: "Destinations that fit your vibe", priority: "0.9",
    description: "Handpicked European cities matched to your energy, style and budget — with fit scores, daily costs, nightlife, queer-friendliness and honest trade-offs.",
    content: `<h1>Destinations that fit your vibe</h1><p>Handpicked European cities matched to your energy, style and budget.</p>` },
  { path: "/map", title: "Your European desire map", priority: "0.8",
    description: "See where your travel vibe fits strongest across Europe — an interactive desire map with fit layers for cost, queer-friendliness, nightlife, comfort, adventure and safety.",
    content: `<h1>Your European desire map</h1><p>Where your travel vibe fits best across Europe.</p>` },
  { path: "/worlds", title: "Experience worlds", priority: "0.7",
    description: "European destinations grouped into emotional worlds — cheap & lively, Mediterranean & different, queer & night-oriented, comfortable urban energy and more.",
    content: `<h1>Experience worlds</h1><p>Destinations grouped into emotional worlds that match your energy.</p>` },
  { path: "/compare", title: "Compare destinations", priority: "0.7",
    description: "Compare European destinations side by side — fit, cost, nightlife, queer scene, comfort, safety, tourist density and regret risk.",
    content: `<h1>Compare your best matches</h1><p>See the trade-offs side by side.</p>` },
];

function esc(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function abs(path) {
  return path === "/" ? SITE_URL + "/" : SITE_URL + path;
}

function headFor({ title, description, path, type = "website", jsonLd = [] }) {
  const full = title
    ? `${esc(title)} · ${NAME}`
    : `${NAME} — Find the trip that fits how you want to feel.`;
  const url = abs(path);
  const img = abs("/og-default.svg");
  const ld = jsonLd.map((b) => `<script type="application/ld+json">${JSON.stringify(b)}</script>`).join("");
  return [
    `<title>${full}</title>`,
    `<meta name="description" content="${esc(description)}"/>`,
    `<link rel="canonical" href="${url}"/>`,
    `<meta property="og:site_name" content="${NAME}"/>`,
    `<meta property="og:type" content="${type}"/>`,
    `<meta property="og:title" content="${full}"/>`,
    `<meta property="og:description" content="${esc(description)}"/>`,
    `<meta property="og:url" content="${url}"/>`,
    `<meta property="og:image" content="${img}"/>`,
    `<meta name="twitter:card" content="summary_large_image"/>`,
    `<meta name="twitter:title" content="${full}"/>`,
    `<meta name="twitter:description" content="${esc(description)}"/>`,
    `<meta name="twitter:image" content="${img}"/>`,
    ld,
  ].join("\n    ");
}

function render(template, { head, content }) {
  let html = template
    // strip the template's default title + description so we don't duplicate them
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta\s+name="description"[^>]*>/i, "");
  html = html.replace("</head>", `    ${head}\n  </head>`);
  html = html.replace(
    /<div id="root">\s*<\/div>/,
    `<div id="root"><div id="seo-content">${content}</div></div>`,
  );
  return html;
}

function writeRoute(path, html) {
  const outPath =
    path === "/" ? join(DIST, "index.html") : join(DIST, path.replace(/^\//, ""), "index.html");
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, html);
  return outPath.replace(DIST, "dist");
}

const template = readFileSync(join(DIST, "index.html"), "utf8");
const urls = [];

// static routes
for (const r of STATIC_ROUTES) {
  const jsonLd =
    r.path === "/"
      ? [
          { "@context": "https://schema.org", "@type": "WebSite", name: NAME, url: SITE_URL + "/", description: DESC },
          { "@context": "https://schema.org", "@type": "Organization", name: NAME, url: SITE_URL + "/", slogan: "Find the trip that fits how you want to feel." },
        ]
      : [];
  const head = headFor({ title: r.title, description: r.description, path: r.path, jsonLd });
  writeRoute(r.path, render(template, { head, content: r.content }));
  urls.push({ loc: abs(r.path), priority: r.priority });
}

// destination pages
for (const d of DESTS) {
  const path = `/destination/${d.id}`;
  const description = `${d.city}, ${d.country} — ${d.vibe} Daily cost ${d.cost}. See why it fits, honest trade-offs, nightlife, queer scene, food and a cinematic city portal on Eurovibe.`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "TouristDestination",
      name: d.city,
      description: d.vibe,
      url: abs(path),
      address: { "@type": "PostalAddress", addressLocality: d.city, addressCountry: d.country },
      geo: { "@type": "GeoCoordinates", latitude: d.lat, longitude: d.lng },
      keywords: d.tags.join(", "),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Discover", item: abs("/discover") },
        { "@type": "ListItem", position: 2, name: d.city, item: abs(path) },
      ],
    },
  ];
  const head = headFor({ title: `${d.city}, ${d.country}`, description, path, type: "place", jsonLd });
  const content = `<h1>${esc(d.city)}, ${esc(d.country)}</h1><p>${esc(d.vibe)}</p><p>Typical daily cost: ${esc(d.cost)}.</p>`;
  writeRoute(path, render(template, { head, content }));
  urls.push({ loc: abs(path), priority: "0.8" });
}

// sitemap.xml
const today = new Date().toISOString().slice(0, 10);
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  urls
    .map((u) => `  <url><loc>${u.loc}</loc><lastmod>${today}</lastmod><priority>${u.priority}</priority></url>`)
    .join("\n") +
  `\n</urlset>\n`;
writeFileSync(join(DIST, "sitemap.xml"), sitemap);

console.log(`SEO: prerendered ${STATIC_ROUTES.length + DESTS.length} routes + sitemap.xml (${urls.length} urls)`);
