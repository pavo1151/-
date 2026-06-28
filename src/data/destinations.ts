import type { Destination, FieldSource, SourcedField } from "@/types";
import {
  PRAGUE_HOTSPOTS,
  BELGRADE_HOTSPOTS,
  ATHENS_HOTSPOTS,
  SOFIA_HOTSPOTS,
  BUDAPEST_HOTSPOTS,
} from "./hotspots";

/**
 * Per-field provenance. Fast-moving fields (nightlife, queer) carry lower confidence and a
 * "check before you go" framing; structural fields (cost, comfort) are steadier. All are
 * editorial assessments today (live=false); the cost field is the natural first candidate for a
 * live data feed (see lib/liveData).
 */
const FIELD_META: Record<SourcedField, { label: string; delta: number; clamp?: number }> = {
  cost: { label: "Regional cost-of-living data + editorial", delta: 0 },
  nightlife: { label: "Venue listings + editorial — changes often", delta: -12, clamp: 80 },
  safety: { label: "Public safety indices + editorial", delta: -4 },
  queer: { label: "Community sources + editorial — check before you go", delta: -16, clamp: 78 },
  comfort: { label: "Editorial assessment", delta: -2 },
  sensory: { label: "Editorial assessment", delta: -4 },
  differentFromPrague: { label: "Editorial assessment (vs Prague baseline)", delta: -2 },
  shopping: { label: "Editorial assessment", delta: -8 },
  touristDensity: { label: "Tourism volume data + editorial", delta: -4 },
};

function buildFieldSources(d: Destination): Partial<Record<SourcedField, FieldSource>> {
  const base = d.sourceMetadata.confidence;
  const out: Partial<Record<SourcedField, FieldSource>> = {};
  for (const key of Object.keys(FIELD_META) as SourcedField[]) {
    const meta = FIELD_META[key];
    const confidence = Math.max(40, Math.min(meta.clamp ?? 100, base + meta.delta));
    out[key] = {
      source: meta.label,
      verifiedAt: d.sourceMetadata.lastUpdated,
      confidence,
      live: false,
    };
  }
  return out;
}

/**
 * Full demo dataset. Scores are 0..10 per the spec.
 * `differentFromPragueScore` is the novelty driver; Prague itself = 0.
 */
export const DESTINATIONS: Destination[] = [
  {
    id: "prague",
    city: "Prague",
    country: "Czech Republic",
    region: "Central Europe",
    latitude: 50.0755,
    longitude: 14.4378,
    mapPosition: { x: 52, y: 40 },
    shortVibe: "Beautiful, walkable, tourist-heavy, classic and nightlife-friendly.",
    longSummary:
      "Prague is visually impressive, easy to explore, rich in old-world atmosphere, strong for walking, beer culture, bars, classic European beauty and first-trip comfort. It can also feel crowded, commercial and tourist-heavy in central areas.",
    fitBaseScore: 84,
    dailyCostBudget: "€55–75",
    dailyCostNormal: "€75–115",
    dailyCostComfort: "€130–180",
    currency: "Czech Koruna (CZK)",
    costScore: 6,
    queerScore: 6,
    nightlifeScore: 8,
    safetyScore: 8,
    frictionScore: 3,
    touristDensityScore: 9,
    differentFromPragueScore: 0,
    sensoryScore: 8,
    comfortScore: 8,
    confidenceScore: 8,
    shoppingScore: 6,
    regretRisk: "Medium",
    atmosphereTags: ["Old streets", "Beer nights", "Bridges", "Gothic corners", "Tourist energy"],
    dayMood: "Walkable beauty, bridges, cafes, classic streets, tourist core.",
    nightMood: "Beer halls, bars, warm lights, late streets, social tourist energy.",
    whyYes: [
      "Beautiful walking city",
      "Strong classic European atmosphere",
      "Easy to understand quickly",
      "Good bars and casual nightlife",
      "Strong tourist infrastructure",
      "Great for low-friction travelers",
    ],
    whyNot: [
      "Very tourist-heavy in the center",
      "Not the cheapest option",
      "Can feel commercial",
      "Less raw and less surprising",
      "Less suitable for users seeking something undiscovered",
    ],
    bestFor: ["Classic city beauty", "Walking", "Comfort", "First European city feel", "Bars", "Easy planning"],
    notFor: ["Raw adventure seekers", "Very low-budget travelers", "Crowd-avoiders", "Big contrast from Central Europe"],
    localReality:
      "Prague is visually satisfying almost immediately, but the central experience can feel crowded, polished and built around visitors. The more local feeling usually requires leaving the obvious core.",
    pragueDifferenceText:
      "Prague is the baseline city. Other destinations are compared against its beauty, comfort, tourism density, cost, nightlife style and level of polish.",
    budgetReality:
      "Mid-range for the region. Beer and casual food are affordable; the tourist core marks up fast, so a few streets out saves real money.",
    nightlifeSummary:
      "Easy and social, strong for bars and beer nights, tourist-heavy. Great for casual nights, less so for underground scenes.",
    queerSummary:
      "A modest but visible queer scene with a handful of established venues. Generally relaxed; check current listings and events before you go.",
    foodSummary:
      "Comfort food, beer halls, hearty plates and good cafe culture. Obvious tourist traps in the center are easy to skip.",
    shoppingSummary:
      "Local design, glass objects, vintage posters and books reward a slow browse. Main-square souvenirs are overpriced.",
    streetsSummary:
      "Walkable and cinematic, gothic in the core and calmer at the edges. The bridges and riverside define the classic image.",
    trustSummary:
      "High confidence. Based on well-established, slow-changing city characteristics; nightlife specifics shift fastest.",
    portalBackgroundDay: "from-amber-200 via-orange-200 to-sky-200",
    portalBackgroundNight: "from-twilight-plum via-twilight-violet to-twilight-rose",
    portalStreetScene: "prague-old-town",
    portalMapStyle: "prague-river-city",
    portalHotspots: PRAGUE_HOTSPOTS,
    bestBuys: {
      worthBuying: [
        "Glass / crystal-style objects",
        "Illustrated maps",
        "Design souvenirs",
        "Beer-related gifts",
        "Books and posters",
      ],
      betterThanGeneric: ["Small design objects", "Vintage posters", "Second-hand finds", "Local prints"],
      maybeNotWorth: ["Overpriced center souvenirs", "Fake local products", "Generic tourist shirts", "Main-square pricing"],
    },
    lensProfiles: {
      "first-time": ["prg-streets", "prg-tourist-core", "prg-food", "prg-bars"],
      budget: ["prg-best-buys", "prg-food", "prg-local-reality"],
      solo: ["prg-safe-way-back", "prg-streets", "prg-bars"],
      queer: ["prg-nightlife", "prg-bars", "prg-safe-way-back"],
      nightlife: ["prg-nightlife", "prg-bars", "prg-food"],
      shopping: ["prg-shops", "prg-best-buys", "prg-streets"],
      food: ["prg-food", "prg-bars", "prg-streets"],
      "local-reality": ["prg-local-reality", "prg-streets", "prg-shops"],
      "post-prague": ["prg-local-reality", "prg-tourist-core"],
    },
    simulationTemplates: [
      {
        day: 1,
        title: "Soft landing into the city",
        body: "Arrive, walk the old streets, cross toward the river, keep the first evening light.",
        tags: ["Walking", "Beauty", "Easy"],
      },
      {
        day: 2,
        title: "Classic Prague + food",
        body: "Explore the tourist core earlier, escape the busiest streets later, add a beer hall or casual food stop.",
        tags: ["Tourist core", "Food", "Practical"],
      },
      {
        day: 3,
        title: "Shops + nightlife",
        body: "Check local design or vintage pockets during the day, then shift into bars, queer layer or casual nightlife.",
        tags: ["Shopping", "Nightlife", "Social"],
      },
      {
        day: 4,
        title: "Local reality check",
        body: "Slow morning, quieter neighborhoods, decide whether Prague is enough or if the next trip should be more raw.",
        tags: ["Slow", "Reflection", "Compare"],
      },
    ],
    decisionSummary: {
      youGain: [
        "Beautiful walkable city",
        "Classic European atmosphere",
        "Easy tourist infrastructure",
        "Strong bars and casual nightlife",
        "Low friction",
      ],
      youGiveUp: [
        "A cheaper, rawer destination",
        "A less touristy feeling",
        "A more surprising cultural reset",
        "An undiscovered-city feeling",
      ],
      loveItIf:
        "You want beauty, comfort, walking, nightlife and an easy city to understand quickly.",
      disappointedIf:
        "You want something raw, cheaper, less touristy or very different from classic Central Europe.",
      alternatives: [
        { id: "sofia", reason: "Cheaper" },
        { id: "belgrade", reason: "Rawer" },
        { id: "athens", reason: "Warmer & more chaotic" },
        { id: "budapest", reason: "Comfortable nightlife" },
      ],
      regretForecast:
        "Low-to-medium. You're unlikely to regret the beauty and ease — only the lack of rawness or surprise if that's what you secretly wanted.",
    },
    routeCompatibility: ["budapest", "belgrade", "sofia"],
    sourceMetadata: {
      confidence: 88,
      basedOn: "Established city characteristics, cost ranges and travel patterns.",
      mayChange: "Nightlife venues, queer listings and exact prices shift over time.",
      lastUpdated: "2026-05",
      sourceType: "Curated editorial + structured travel data",
    },
  },

  {
    id: "belgrade",
    city: "Belgrade",
    country: "Serbia",
    region: "Balkans",
    latitude: 44.7866,
    longitude: 20.4489,
    mapPosition: { x: 58, y: 53 },
    shortVibe: "Cheap, raw, social, late-night and energetic.",
    longSummary:
      "Belgrade is affordable, social and full of raw energy. It rewards flexibility over polish, with strong nightlife, river barges and a genuinely local feel — but less postcard beauty than Prague.",
    fitBaseScore: 87,
    dailyCostBudget: "€35–50",
    dailyCostNormal: "€50–80",
    dailyCostComfort: "€90–130",
    currency: "Serbian Dinar (RSD)",
    costScore: 9,
    queerScore: 6,
    nightlifeScore: 9,
    safetyScore: 6,
    frictionScore: 6,
    touristDensityScore: 5,
    differentFromPragueScore: 9,
    sensoryScore: 8,
    comfortScore: 5,
    confidenceScore: 7,
    shoppingScore: 5,
    regretRisk: "Medium",
    atmosphereTags: ["Raw", "Late-night", "Concrete", "Social", "River energy"],
    dayMood: "Concrete texture, river walks, cheap cafes, real-city energy.",
    nightMood: "River barges, basement clubs, late streets, loud social nights.",
    whyYes: [
      "Lower daily cost",
      "Strong nightlife",
      "Raw energy",
      "Social city",
      "Very different from Prague",
    ],
    whyNot: [
      "Less visually classic",
      "Medium friction",
      "Less comfortable than Prague or Budapest",
      "Queer scene may require current checking",
      "Can feel rougher and less predictable",
    ],
    bestFor: ["Budget energy", "Nightlife", "Social trips", "Contrast from Central Europe"],
    notFor: ["Comfort-first travelers", "Postcard-only seekers", "Very low friction tolerance"],
    localReality:
      "Belgrade can feel alive and affordable, but it asks for more flexibility. It is more about energy than postcard beauty.",
    pragueDifferenceText: "Much rawer, cheaper, more social and less polished than Prague.",
    budgetReality:
      "One of the cheapest options here. Food, drinks and nights out go a long way, which is much of the appeal.",
    nightlifeSummary:
      "A standout. River barges in summer and basement clubs year-round, loud and social, very affordable.",
    queerSummary:
      "A real but lower-profile scene. Generally fine in nightlife spaces; check current venues and events before you go.",
    foodSummary:
      "Grilled meat, hearty Balkan plates and strong cafe culture, all at low prices.",
    shoppingSummary:
      "Less of a shopping city. Markets and a few local pockets over polished retail.",
    streetsSummary:
      "Concrete and character, defined by where two rivers meet. Energy over postcard beauty.",
    trustSummary:
      "Good confidence. Nightlife and queer specifics change fastest; the cheap, raw character is stable.",
    portalBackgroundDay: "from-stone-300 via-amber-100 to-sky-200",
    portalBackgroundNight: "from-night-900 via-twilight-violet to-twilight-rose",
    portalStreetScene: "belgrade-river",
    portalMapStyle: "belgrade-two-rivers",
    portalHotspots: BELGRADE_HOTSPOTS,
    bestBuys: {
      worthBuying: ["Local rakija-style gifts", "Market finds", "Records and books"],
      betterThanGeneric: ["Second-hand finds", "Local design pockets"],
      maybeNotWorth: ["Generic souvenirs", "Tourist-strip markups"],
    },
    lensProfiles: {
      "first-time": ["bgd-streets", "bgd-nightlife"],
      budget: ["bgd-local-reality", "bgd-streets"],
      nightlife: ["bgd-nightlife", "bgd-streets"],
      "local-reality": ["bgd-local-reality", "bgd-streets"],
      "post-prague": ["bgd-local-reality", "bgd-nightlife"],
    },
    simulationTemplates: [
      { day: 1, title: "Drop into the energy", body: "Arrive, walk the river, settle into a cheap cafe and a first easy night.", tags: ["River", "Easy", "Cheap"] },
      { day: 2, title: "City texture + food", body: "Explore concrete boulevards and markets, eat grilled and local, plan the big night.", tags: ["Streets", "Food", "Local"] },
      { day: 3, title: "Big night out", body: "Barges or basements — Belgrade's nightlife at full volume, very affordable.", tags: ["Nightlife", "Social", "Late"] },
      { day: 4, title: "Slow & decide", body: "A calmer day to weigh the raw energy against comfort for your next move.", tags: ["Slow", "Reflection", "Compare"] },
    ],
    decisionSummary: {
      youGain: ["A genuinely cheap trip", "Standout nightlife", "Raw, social energy", "A real contrast from Prague"],
      youGiveUp: ["Postcard beauty", "Predictable comfort", "Low friction", "Polished infrastructure"],
      loveItIf: "You want energy, low costs and a city that feels real over refined.",
      disappointedIf: "You want beauty, comfort and a smooth, predictable trip.",
      alternatives: [
        { id: "sofia", reason: "Even cheaper, calmer" },
        { id: "budapest", reason: "More comfort, similar nightlife" },
        { id: "prague", reason: "More beauty and polish" },
      ],
      regretForecast: "Low if you value energy and budget; higher if you secretly wanted comfort and postcards.",
    },
    routeCompatibility: ["sofia", "budapest", "prague"],
    sourceMetadata: {
      confidence: 78,
      basedOn: "Regional cost data and the city's well-known nightlife character.",
      mayChange: "Specific venues, barges and queer listings change frequently.",
      lastUpdated: "2026-05",
      sourceType: "Curated editorial + structured travel data",
    },
  },

  {
    id: "athens",
    city: "Athens",
    country: "Greece",
    region: "Mediterranean",
    latitude: 37.9838,
    longitude: 23.7275,
    mapPosition: { x: 62, y: 70 },
    shortVibe: "Warm, chaotic, ancient, queer-friendly and Mediterranean.",
    longSummary:
      "Athens is emotional and layered — ancient ruins between living neighborhoods, strong food and evening culture, a visible queer scene and warm social energy. It can also feel chaotic and intense, especially in summer heat.",
    fitBaseScore: 82,
    dailyCostBudget: "€55–75",
    dailyCostNormal: "€80–120",
    dailyCostComfort: "€140–200",
    currency: "Euro (EUR)",
    costScore: 6,
    queerScore: 8,
    nightlifeScore: 8,
    safetyScore: 6,
    frictionScore: 5,
    touristDensityScore: 8,
    differentFromPragueScore: 9,
    sensoryScore: 9,
    comfortScore: 6,
    confidenceScore: 8,
    shoppingScore: 6,
    regretRisk: "Medium",
    atmosphereTags: ["Warm", "Mediterranean", "Ancient", "Chaotic", "Nightlife"],
    dayMood: "Ruins, markets, sun, chaotic streets, neighborhood character.",
    nightMood: "Rooftops, tavernas, queer nightlife, warm late streets.",
    whyYes: [
      "Strong Mediterranean contrast",
      "Visible queer and nightlife layers",
      "Warm social energy",
      "Very different from Prague",
      "Strong food and evening culture",
    ],
    whyNot: [
      "Can feel chaotic",
      "Summer can be intense",
      "Neighborhood choice matters",
      "Not always cheap",
      "Tourist density can be high",
    ],
    bestFor: ["Mediterranean warmth", "Queer-friendly nightlife", "Food culture", "Contrast from Central Europe"],
    notFor: ["Travelers wanting calm and order", "Heat-sensitive summer trips"],
    localReality:
      "Athens is emotional, layered and alive. It can feel magical at night and overwhelming during the day, especially in heat or crowded areas.",
    pragueDifferenceText:
      "Warmer, more chaotic, more Mediterranean, more ancient and more street-driven than Prague.",
    budgetReality:
      "Mid-range and euro-priced. Street food keeps days cheap; nights and tourist zones add up faster.",
    nightlifeSummary:
      "Warm and layered, with rooftops, late tavernas and a genuinely visible queer scene. Strong after dark.",
    queerSummary:
      "One of the more queer-visible options here, with established nightlife and community spaces. Welcoming; still check current events and listings.",
    foodSummary:
      "A highlight. Long social dinners, tavernas, markets and excellent cheap street food.",
    shoppingSummary:
      "Markets, sandals, local design and food products over polished malls.",
    streetsSummary:
      "Ancient layers sit between living neighborhoods — chaotic, warm and best explored on foot.",
    trustSummary:
      "High confidence on character; neighborhood-level advice and venues shift over time.",
    portalBackgroundDay: "from-orange-200 via-amber-100 to-sky-300",
    portalBackgroundNight: "from-twilight-plum via-twilight-rose to-twilight-gold",
    portalStreetScene: "athens-ancient",
    portalMapStyle: "athens-acropolis",
    portalHotspots: ATHENS_HOTSPOTS,
    bestBuys: {
      worthBuying: ["Leather sandals", "Olive products", "Local design", "Markets finds"],
      betterThanGeneric: ["Independent designers", "Food specialties"],
      maybeNotWorth: ["Mass-made souvenirs", "Tourist-strip markups"],
    },
    lensProfiles: {
      "first-time": ["ath-streets", "ath-food", "ath-nightlife"],
      queer: ["ath-nightlife", "ath-food"],
      nightlife: ["ath-nightlife", "ath-streets"],
      food: ["ath-food", "ath-streets"],
      "post-prague": ["ath-streets", "ath-nightlife"],
    },
    simulationTemplates: [
      { day: 1, title: "Warm arrival", body: "Settle in, walk a neighborhood, ease into a long first dinner.", tags: ["Warm", "Food", "Easy"] },
      { day: 2, title: "Ancient + chaotic", body: "Ruins and markets earlier, escape the midday heat, neighborhood-hop later.", tags: ["Ancient", "Streets", "Markets"] },
      { day: 3, title: "Rooftops + nightlife", body: "Sunset rooftop, then into the queer and late-night layers of the city.", tags: ["Nightlife", "Queer", "Social"] },
      { day: 4, title: "Slow Mediterranean day", body: "A calm, warm morning to decide if the chaos is energizing or tiring.", tags: ["Slow", "Reflection", "Compare"] },
    ],
    decisionSummary: {
      youGain: ["Mediterranean warmth", "A visible queer scene", "Excellent food culture", "A strong contrast from Prague"],
      youGiveUp: ["Calm and order", "Cooler weather", "Lower tourist density in the core"],
      loveItIf: "You want warmth, food, nightlife and a layered, emotional city.",
      disappointedIf: "You want calm, order and a cooler, quieter trip.",
      alternatives: [
        { id: "prague", reason: "Cooler & more orderly" },
        { id: "budapest", reason: "Comfortable nightlife" },
        { id: "belgrade", reason: "Cheaper & rawer" },
      ],
      regretForecast: "Low if you embrace warmth and chaos; higher in peak summer heat or if you want order.",
    },
    routeCompatibility: ["budapest", "belgrade"],
    sourceMetadata: {
      confidence: 84,
      basedOn: "Well-documented city character, food and nightlife culture.",
      mayChange: "Neighborhood advice, prices and venues shift seasonally.",
      lastUpdated: "2026-05",
      sourceType: "Curated editorial + structured travel data",
    },
  },

  {
    id: "sofia",
    city: "Sofia",
    country: "Bulgaria",
    region: "Balkans",
    latitude: 42.6977,
    longitude: 23.3219,
    mapPosition: { x: 61, y: 60 },
    shortVibe: "Low-cost, practical, calm, simple and Balkan.",
    longSummary:
      "Sofia is affordable, practical and calm — a useful low-cost base with a mountain backdrop. It's easy and unhurried, but lighter on the immediate wow factor of Prague, Athens or Budapest.",
    fitBaseScore: 76,
    dailyCostBudget: "€30–45",
    dailyCostNormal: "€45–70",
    dailyCostComfort: "€80–120",
    currency: "Bulgarian Lev (BGN)",
    costScore: 10,
    queerScore: 5,
    nightlifeScore: 5,
    safetyScore: 7,
    frictionScore: 4,
    touristDensityScore: 4,
    differentFromPragueScore: 7,
    sensoryScore: 5,
    comfortScore: 6,
    confidenceScore: 7,
    shoppingScore: 5,
    regretRisk: "Low",
    atmosphereTags: ["Low-cost", "Practical", "Balkan", "Calm", "Simple"],
    dayMood: "Calm boulevards, cafes, mountain backdrop, easy pace.",
    nightMood: "Low-key bars, quiet streets, simple and affordable nights.",
    whyYes: [
      "Very affordable",
      "Lower tourist density",
      "Simple and practical",
      "Good for a budget escape",
      "Useful base for low-cost travel",
    ],
    whyNot: [
      "Less visually dramatic",
      "Weaker nightlife",
      "Smaller queer scene",
      "May feel too quiet",
      "Less emotional wow factor",
    ],
    bestFor: ["Budget escape", "Calm trips", "Low tourist density", "Low-cost base"],
    notFor: ["Wow-factor seekers", "Nightlife-first travelers", "Big-queer-scene trips"],
    localReality:
      "Sofia is useful and affordable, but the user should not expect the same immediate emotional impact as Prague, Athens or Budapest.",
    pragueDifferenceText: "Cheaper, quieter, less polished and less tourist-heavy than Prague.",
    budgetReality:
      "The cheapest option here by a clear margin — an excellent value base for a low-cost trip.",
    nightlifeSummary:
      "Low-key and affordable. Fine for relaxed bars, not a nightlife destination on its own.",
    queerSummary:
      "A smaller, lower-profile scene. Generally low-key; check current venues and events before you go.",
    foodSummary:
      "Hearty Bulgarian plates, salads and cheap, satisfying everyday eating.",
    shoppingSummary:
      "Practical and affordable. Markets and basics over standout local design.",
    streetsSummary:
      "Calm, walkable boulevards with a mountain backdrop — easy to read in a day.",
    trustSummary:
      "Good confidence. A stable, low-drama profile; the cheap, calm character holds well.",
    portalBackgroundDay: "from-emerald-100 via-amber-50 to-sky-200",
    portalBackgroundNight: "from-night-900 via-night-800 to-twilight-violet",
    portalStreetScene: "sofia-calm",
    portalMapStyle: "sofia-vitosha",
    portalHotspots: SOFIA_HOTSPOTS,
    bestBuys: {
      worthBuying: ["Rose products", "Local food specialties", "Market finds"],
      betterThanGeneric: ["Independent makers", "Everyday local goods"],
      maybeNotWorth: ["Generic souvenirs"],
    },
    lensProfiles: {
      "first-time": ["sof-streets", "sof-local-reality"],
      budget: ["sof-streets", "sof-local-reality"],
      "local-reality": ["sof-local-reality", "sof-streets"],
      "post-prague": ["sof-local-reality", "sof-streets"],
    },
    simulationTemplates: [
      { day: 1, title: "Easy, cheap arrival", body: "Settle in, walk the calm center, enjoy how far your money goes.", tags: ["Calm", "Cheap", "Easy"] },
      { day: 2, title: "City + mountain", body: "Explore boulevards and cafes, with Vitosha rising at the city's edge.", tags: ["Streets", "Nature", "Simple"] },
      { day: 3, title: "Low-key night", body: "A relaxed evening — Sofia is about ease, not big nights out.", tags: ["Low-key", "Affordable", "Slow"] },
      { day: 4, title: "Reset & decide", body: "A quiet day to weigh calm and savings against more dramatic options.", tags: ["Slow", "Reflection", "Compare"] },
    ],
    decisionSummary: {
      youGain: ["The lowest costs here", "Calm and low crowds", "A simple, easy base"],
      youGiveUp: ["Wow factor", "Strong nightlife", "A big queer scene", "Dramatic beauty"],
      loveItIf: "You want a calm, very affordable trip with little friction.",
      disappointedIf: "You want drama, nightlife or instant emotional impact.",
      alternatives: [
        { id: "belgrade", reason: "More energy & nightlife" },
        { id: "prague", reason: "More beauty & wow" },
        { id: "budapest", reason: "More comfort & nightlife" },
      ],
      regretForecast: "Low. Expectations matter most — it delivers calm and value, not spectacle.",
    },
    routeCompatibility: ["belgrade", "prague"],
    sourceMetadata: {
      confidence: 80,
      basedOn: "Regional cost data and the city's calm, practical character.",
      mayChange: "Venue specifics and queer listings change over time.",
      lastUpdated: "2026-05",
      sourceType: "Curated editorial + structured travel data",
    },
  },

  {
    id: "budapest",
    city: "Budapest",
    country: "Hungary",
    region: "Central Europe",
    latitude: 47.4979,
    longitude: 19.0402,
    mapPosition: { x: 56, y: 47 },
    shortVibe: "Grand, elegant, nightlife-heavy, touristic and comfortable.",
    longSummary:
      "Budapest gives strong nightlife and city beauty with real comfort — grand boulevards, a dramatic river, ruin bars and thermal baths. It can feel touristic and familiar if you already know Central Europe.",
    fitBaseScore: 84,
    dailyCostBudget: "€50–70",
    dailyCostNormal: "€75–115",
    dailyCostComfort: "€130–190",
    currency: "Hungarian Forint (HUF)",
    costScore: 6,
    queerScore: 7,
    nightlifeScore: 9,
    safetyScore: 7,
    frictionScore: 3,
    touristDensityScore: 8,
    differentFromPragueScore: 4,
    sensoryScore: 8,
    comfortScore: 8,
    confidenceScore: 8,
    shoppingScore: 6,
    regretRisk: "Low",
    atmosphereTags: ["Grand", "Elegant", "River", "Ruin bars", "Thermal", "Nightlife"],
    dayMood: "Grand boulevards, river views, thermal baths, elegant streets.",
    nightMood: "Ruin bars, river lights, late clubs, comfortable nightlife.",
    whyYes: [
      "Strong nightlife",
      "Beautiful city structure",
      "Good comfort",
      "Strong tourist infrastructure",
      "River city energy",
    ],
    whyNot: [
      "Can feel similar to Prague",
      "Central areas are tourist-heavy",
      "Not the cheapest anymore",
      "Less raw than Belgrade",
    ],
    bestFor: ["Nightlife", "City beauty", "Comfort", "River-city energy", "Easy planning"],
    notFor: ["Raw-adventure seekers", "Travelers wanting a big contrast from Prague"],
    localReality:
      "Budapest gives strong nightlife and city beauty, but it can feel touristic and familiar if the user already knows Central Europe.",
    pragueDifferenceText:
      "Similar Central European comfort, but bigger, more nightlife-heavy and more river-driven than Prague.",
    budgetReality:
      "Mid-range and no longer a bargain, but comfortable value — especially for nightlife and thermal baths.",
    nightlifeSummary:
      "A standout. Ruin bars, river venues and easy clubbing, comfortable and well-developed.",
    queerSummary:
      "A visible scene with established venues and events. Generally welcoming in nightlife spaces; check current listings.",
    foodSummary:
      "Hearty Central European plates, strong cafe culture and a lively market hall.",
    shoppingSummary:
      "Local design, market halls and elegant streets, with the usual central tourist markups.",
    streetsSummary:
      "Grand and elegant, split by the river into hilly Buda and flat Pest. Bigger than Prague.",
    trustSummary:
      "High confidence. A well-documented, comfortable city; nightlife specifics shift fastest.",
    portalBackgroundDay: "from-amber-200 via-orange-100 to-blue-200",
    portalBackgroundNight: "from-twilight-plum via-twilight-violet to-twilight-gold",
    portalStreetScene: "budapest-river",
    portalMapStyle: "budapest-danube",
    portalHotspots: BUDAPEST_HOTSPOTS,
    bestBuys: {
      worthBuying: ["Paprika & food specialties", "Local design", "Market-hall finds", "Thermal/spa goods"],
      betterThanGeneric: ["Independent designers", "Market produce"],
      maybeNotWorth: ["Center souvenirs", "Tourist-strip markups"],
    },
    lensProfiles: {
      "first-time": ["bud-streets", "bud-nightlife"],
      nightlife: ["bud-nightlife", "bud-streets"],
      queer: ["bud-nightlife", "bud-streets"],
      shopping: ["bud-streets", "bud-nightlife"],
      "post-prague": ["bud-streets", "bud-nightlife"],
    },
    simulationTemplates: [
      { day: 1, title: "Grand arrival", body: "Settle in, walk the river, take in the elegant boulevards and first lights.", tags: ["River", "Beauty", "Easy"] },
      { day: 2, title: "Beauty + baths", body: "Explore both sides of the river, then unwind in a thermal bath.", tags: ["Streets", "Thermal", "Comfort"] },
      { day: 3, title: "Ruin bars + nightlife", body: "Courtyard ruin bars into late clubs — Budapest's signature night.", tags: ["Nightlife", "Ruin bars", "Social"] },
      { day: 4, title: "Slow & compare", body: "A calmer day to weigh comfort and nightlife against rawer alternatives.", tags: ["Slow", "Reflection", "Compare"] },
    ],
    decisionSummary: {
      youGain: ["Standout nightlife", "Grand river-city beauty", "Real comfort", "Thermal baths"],
      youGiveUp: ["A big contrast from Prague", "Lower costs", "Raw, undiscovered energy"],
      loveItIf: "You want nightlife and beauty with comfort and easy planning.",
      disappointedIf: "You already know Central Europe well and want something genuinely different.",
      alternatives: [
        { id: "belgrade", reason: "Rawer & cheaper" },
        { id: "athens", reason: "Warmer & more different" },
        { id: "prague", reason: "Similar, slightly calmer" },
      ],
      regretForecast: "Low. Reliably delivers comfort and nightlife; main risk is familiarity, not disappointment.",
    },
    routeCompatibility: ["prague", "belgrade", "athens"],
    sourceMetadata: {
      confidence: 86,
      basedOn: "Well-documented city character, nightlife and infrastructure.",
      mayChange: "Venues, ruin bars and queer listings change over time.",
      lastUpdated: "2026-05",
      sourceType: "Curated editorial + structured travel data",
    },
  },
];

/** Lightweight extended markers for the Europe desire map (pins only, no full content). */
export const EXTENDED_PINS: Pick<
  Destination,
  "id" | "city" | "country" | "mapPosition" | "shortVibe" | "pinOnly"
>[] = [
  { id: "berlin", city: "Berlin", country: "Germany", mapPosition: { x: 50, y: 30 }, shortVibe: "Edgy, queer, nightlife capital.", pinOnly: true },
  { id: "barcelona", city: "Barcelona", country: "Spain", mapPosition: { x: 30, y: 60 }, shortVibe: "Beach, design, late nights.", pinOnly: true },
  { id: "rome", city: "Rome", country: "Italy", mapPosition: { x: 47, y: 62 }, shortVibe: "Ancient, romantic, chaotic.", pinOnly: true },
  { id: "thessaloniki", city: "Thessaloniki", country: "Greece", mapPosition: { x: 60, y: 64 }, shortVibe: "Warm, food-driven, relaxed.", pinOnly: true },
  { id: "amsterdam", city: "Amsterdam", country: "Netherlands", mapPosition: { x: 42, y: 27 }, shortVibe: "Canals, liberal, social.", pinOnly: true },
  { id: "paris", city: "Paris", country: "France", mapPosition: { x: 38, y: 40 }, shortVibe: "Iconic, elegant, dense.", pinOnly: true },
];

/**
 * Real landmark photos, loaded in the browser from Wikimedia Commons (CC-licensed) via stable
 * Special:FilePath URLs. If any fails to load, DestinationThumb falls back to the generated
 * gradient art — so the worst case is the previous look. Swap any URL freely; it's just data.
 */
const IMAGES: Record<string, string> = {
  prague:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Charles%20Bridge%2C%20Prague.jpg?width=1000",
  belgrade:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Belgrade%20Kalemegdan%20Fortress.jpg?width=1000",
  athens:
    "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Acropolis%20of%20Athens.jpg?width=1000",
  sofia:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Alexander%20Nevsky%20Cathedral%2C%20Sofia.jpg?width=1000",
  budapest:
    "https://commons.wikimedia.org/wiki/Special:FilePath/Hungarian%20Parliament%20Building%2C%20Budapest.jpg?width=1000",
};

// Attach generated per-field provenance + real photos to every destination.
for (const d of DESTINATIONS) {
  d.fieldSources = buildFieldSources(d);
  if (IMAGES[d.id]) d.image = IMAGES[d.id];
}

export const DESTINATIONS_BY_ID = Object.fromEntries(
  DESTINATIONS.map((d) => [d.id, d]),
) as Record<string, Destination>;
