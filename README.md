# eurovibe

A premium European travel-**decision** web app. Eurovibe doesn't just list destinations — it helps you
**understand, compare, feel, simulate and choose** the right European city before you travel. You start
from a *feeling*, not a city.

> Find the trip that fits how you want to feel.

## The emotional journey

`confusion → feeling → reality boundaries → trade-offs → trip profile → desire map → experience worlds →
destination deck → deep card → atmosphere → portal → street/map exploration → hotspots → simulation →
compare → decision check → saved trip → route plan`

## Stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS** with a custom two-world theme (light *editorial* + dark *cinematic*)
- **react-router-dom** — 22 routes
- **zustand** (+ persist → `localStorage`) for the user profile, saves, comparisons, routes
- **framer-motion** for transitions, bottom sheets, the fit-ring, marker pulses and Day/Night fades
- Stylized **SVG** maps & cinematic scenes (no Mapbox / no API keys); image slots remain for real photos later

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run preview  # serve the production build
```

## Screens (routes)

| Screen | Route |
| --- | --- |
| Welcome | `/` |
| Trip Mood | `/mood` |
| Reality Boundaries | `/boundaries` |
| Trade-off Flow | `/tradeoffs` |
| Trip Profile Summary | `/profile-summary` |
| Desire Map | `/map` |
| Experience Worlds | `/worlds` |
| Destination Deck | `/discover` |
| Destination Deep Card | `/destination/:id` |
| Atmosphere Preview | `/destination/:id/atmosphere` |
| Destination Portal (Street/Map) | `/destination/:id/portal` |
| Trip Simulation | `/destination/:id/simulate` |
| Compare Mode | `/compare` |
| Decision Check | `/destination/:id/decision` |
| Saved Trips | `/saved` |
| Route Builder | `/route` |
| Admin / Data Console | `/admin` |
| User Reports / Trust Review | `/reports` |
| Settings / Profile | `/settings` |

## Architecture

- `src/types` — domain models (`UserProfile`, `Destination`, `PortalHotspot`, `Simulation`, …)
- `src/data` — destinations (Prague, Belgrade, Athens, Sofia, Budapest), moods, trade-offs, worlds, lenses, hotspots
- `src/lib` — the matching engine:
  - `calculateFitScore`, `getTopMatches`, `getOppositeDestinations`, `getExperienceWorlds`
  - `getSimulationForDestination`, `generateDecisionSummary`, `generateRoutePreview`, `buildPreferenceWeights`
- `src/store` — the persisted zustand store
- `src/components` — shell, vibe, score, destination, map, portal, simulate, compare, decision, saved, admin, ui
- `src/pages` — the 22 screens

### Matching

A 0–100 fit score is computed from the user's 11 preference weights against each destination's scores:

```
raw = costW·cost + nightlifeW·nightlife + queerW·queer + safetyW·safety
    + noveltyW·differentFromPrague + sensoryW·sensory + comfortW·comfort + shoppingW·shopping
    + localRealityW·(10 − touristDensity)
    − lowFrictionW·friction − touristAvoidanceW·touristDensity
```

…then normalized and lightly blended with each destination's editorial base score.

## Content safety

- **CBD / cannabis** content is limited to legal status, retail visibility, risk and caution — no buying
  instructions, sourcing, prices or enforcement-evasion guidance.
- **Queer travel** content is respectful, practical and safety-aware (community visibility, venue types,
  "check before you go"), never explicit.

## Notes

All data is local mock data and all saves live in `localStorage`. The data layer is structured so a
Supabase backend and Mapbox/MapLibre maps can be swapped in later without reshaping the app.

## Credits

Destination photos are loaded at runtime from **Wikimedia Commons** (CC-licensed) via stable
`Special:FilePath` URLs, configured per destination in `src/data/destinations.ts` (`IMAGES`). If a URL
fails, the UI falls back to generated gradient + SVG art. Swap any URL freely — it's just data.

