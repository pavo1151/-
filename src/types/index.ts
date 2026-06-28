/**
 * Eurovibe core domain types.
 * These mirror the product spec's user-profile and destination data models.
 */

/** The 11 preference weights that drive the matching engine. */
export interface PreferenceWeights {
  cost: number;
  nightlife: number;
  queer: number;
  safety: number;
  novelty: number;
  comfort: number;
  lowFriction: number;
  touristAvoidance: number;
  sensory: number;
  shopping: number;
  localReality: number;
}

export type MoodId =
  | "cheap-escape"
  | "freedom-nightlife"
  | "queer-friendly"
  | "different-from-prague"
  | "solo-not-lonely"
  | "soft-adventure"
  | "beautiful-easy"
  | "raw-lively";

export type LuggageMode = "light" | "dont-mind" | "full";
export type TripStyle = "one-city" | "multi-city" | "open";
export type PortalMode = "street" | "map";
export type DayNight = "day" | "night";
export type SoundscapeMode = "off" | "street" | "night" | "quiet" | "no-voices";

export type LensId =
  | "first-time"
  | "budget"
  | "solo"
  | "queer"
  | "nightlife"
  | "shopping"
  | "food"
  | "local-reality"
  | "post-prague";

export interface BudgetRange {
  min: number;
  max: number;
}

export interface TrustPreferences {
  preferHighConfidence: boolean;
  hideOutdated: boolean;
}

/** Complete user trip profile. */
export interface UserProfile {
  selectedMoods: MoodId[];
  freeTextMood: string;
  tripLength: string; // "3-4" | "5-7" | "8-10" | "10+"
  budgetRange: BudgetRange;
  departureCity: string;
  travelMonth: string;
  luggageMode: LuggageMode;
  tripStyle: TripStyle;
  frictionTolerance: number; // 0..100
  preferenceWeights: PreferenceWeights;
  activeVibeTags: string[];
  selectedDestinations: string[]; // ids selected for compare
  selectedHotspotsForSimulation: string[];
  selectedLens: LensId;
  selectedPortalMode: PortalMode;
  soundscapePreference: SoundscapeMode;
  trustPreferences: TrustPreferences;
  onboarded: boolean;
}

export type RegretRisk = "Low" | "Medium" | "High";

export interface PortalHotspot {
  id: string;
  /** category key — used for icons + day/night emphasis */
  category:
    | "streets"
    | "food"
    | "nightlife"
    | "shops"
    | "local-reality"
    | "bars"
    | "best-buys"
    | "tourist-core"
    | "safe-way-back";
  title: string;
  summary: string;
  goodFor: string[];
  maybeNotFor: string[];
  subtopics: { title: string; body: string }[];
  /** emphasis time of day */
  emphasis: DayNight | "both";
  /** position on the immersive street scene (percentages) */
  street: { x: number; y: number };
  /** position on the stylized city map (percentages) */
  map: { x: number; y: number };
  /** related destination ids for "Compare related" */
  related?: string[];
}

export interface BestBuys {
  worthBuying: string[];
  betterThanGeneric: string[];
  maybeNotWorth: string[];
}

export interface SimulationTemplateDay {
  day: number;
  title: string;
  body: string;
  tags: string[];
}

export interface DecisionSummary {
  youGain: string[];
  youGiveUp: string[];
  loveItIf: string;
  disappointedIf: string;
  alternatives: { id: string; reason: string }[];
  regretForecast: string;
}

export interface SourceMetadata {
  confidence: number; // 0..100
  basedOn: string;
  mayChange: string;
  lastUpdated: string;
  sourceType: string;
}

/** Provenance for a single destination field (cost, nightlife, safety, …). */
export interface FieldSource {
  /** human label for where this value comes from */
  source: string;
  /** optional link to the source */
  url?: string;
  /** when it was last verified, e.g. "2026-05" */
  verifiedAt: string;
  /** 0..100 confidence for this specific field */
  confidence: number;
  /** true = pulled from a live data source; false = editorial assessment */
  live: boolean;
}

/** The destination fields that carry per-field provenance. */
export type SourcedField =
  | "cost"
  | "nightlife"
  | "safety"
  | "queer"
  | "comfort"
  | "sensory"
  | "differentFromPrague"
  | "shopping"
  | "touristDensity";

export interface Destination {
  id: string;
  city: string;
  country: string;
  region: string;
  latitude: number;
  longitude: number;
  /** position on the stylized Europe desire map (percentages) */
  mapPosition: { x: number; y: number };
  shortVibe: string;
  longSummary: string;
  fitBaseScore: number;

  dailyCostBudget: string;
  dailyCostNormal: string;
  dailyCostComfort: string;
  currency: string;

  // 0..10 scores
  costScore: number;
  queerScore: number;
  nightlifeScore: number;
  safetyScore: number;
  frictionScore: number;
  touristDensityScore: number;
  differentFromPragueScore: number;
  sensoryScore: number;
  comfortScore: number;
  confidenceScore: number;
  shoppingScore: number;

  regretRisk: RegretRisk;
  atmosphereTags: string[];
  dayMood: string;
  nightMood: string;

  whyYes: string[];
  whyNot: string[];
  bestFor: string[];
  notFor: string[];

  localReality: string;
  pragueDifferenceText: string;
  budgetReality: string;
  nightlifeSummary: string;
  queerSummary: string;
  foodSummary: string;
  shoppingSummary: string;
  streetsSummary: string;
  trustSummary: string;

  // Portal / atmosphere — described as gradient + scene tokens (CSS/SVG)
  portalBackgroundDay: string;
  portalBackgroundNight: string;
  portalStreetScene: string;
  portalMapStyle: string;
  portalHotspots: PortalHotspot[];

  bestBuys: BestBuys;
  lensProfiles: Partial<Record<LensId, string[]>>; // lens -> highlighted hotspot ids
  simulationTemplates: SimulationTemplateDay[];
  decisionSummary: DecisionSummary;
  routeCompatibility: string[]; // ids that pair well
  sourceMetadata: SourceMetadata;
  /** per-field provenance (verified date + source + confidence). Attached in data/destinations.ts. */
  fieldSources?: Partial<Record<SourcedField, FieldSource>>;

  /** lightweight pin only (extended europe markers without full content) */
  pinOnly?: boolean;
  /** optional real photo (drop-in under /public/img). Falls back to the generated gradient art. */
  image?: string;
}

/** A computed simulation (mood-based, not a rigid itinerary). */
export type SimulationModifier =
  | "cheaper"
  | "less-touristy"
  | "more-queer"
  | "more-nightlife"
  | "more-local"
  | "add-shopping"
  | "reduce-friction"
  | "add-second";

export interface SimulationDay {
  day: number;
  title: string;
  body: string;
  tags: string[];
}

export interface Simulation {
  destinationId: string;
  days: SimulationDay[];
  modifiers: SimulationModifier[];
  selectedHotspots: string[];
}

export interface SavedTrip {
  id: string;
  destinationId: string;
  label: string;
  fitScore: number;
  status: "Ready to plan" | "Compare again" | "Needs more checks";
  createdAt: number;
  simulation?: Simulation;
  decisionSnapshot?: DecisionSummary;
}

export interface SavedComparison {
  id: string;
  destinationIds: string[];
  createdAt: number;
}

export interface RouteStep {
  destinationId: string;
  days: number;
  vibe: string;
  cost: string;
  reason: string;
  transferFriction: string;
  movementNote: string;
}

export type RouteMode =
  | "balanced"
  | "cheapest"
  | "queer-nightlife"
  | "less-friction"
  | "more-different";

export interface RoutePlan {
  id: string;
  mode: RouteMode;
  steps: RouteStep[];
  createdAt: number;
}

/** A scored destination as produced by the matching engine. */
export interface ScoredDestination {
  destination: Destination;
  fitScore: number;
}

export interface ExperienceWorld {
  id: string;
  title: string;
  description: string;
  destinationIds: string[];
  fit: number;
  gradient: string;
}

export interface TrustReport {
  id: string;
  destinationId: string;
  field: string;
  note: string;
  status: "open" | "reviewed";
  createdAt: number;
}
