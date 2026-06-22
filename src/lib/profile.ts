import type { MoodId, PreferenceWeights, UserProfile } from "@/types";
import { MOOD_BY_ID } from "@/data/moods";
import { TRADEOFFS, type TradeChoice } from "@/data/tradeoffs";

export const WEIGHT_KEYS: (keyof PreferenceWeights)[] = [
  "cost",
  "nightlife",
  "queer",
  "safety",
  "novelty",
  "comfort",
  "lowFriction",
  "touristAvoidance",
  "sensory",
  "shopping",
  "localReality",
];

/** A balanced baseline so every fresh profile still produces sensible scores. */
export function baselineWeights(): PreferenceWeights {
  return {
    cost: 1,
    nightlife: 1,
    queer: 1,
    safety: 1,
    novelty: 1,
    comfort: 1,
    lowFriction: 1,
    touristAvoidance: 1,
    sensory: 1,
    shopping: 1,
    localReality: 1,
  };
}

function addDeltas(base: PreferenceWeights, deltas: Partial<PreferenceWeights>): PreferenceWeights {
  const next = { ...base };
  for (const key of WEIGHT_KEYS) {
    if (deltas[key] !== undefined) next[key] = next[key] + (deltas[key] as number);
  }
  return next;
}

/** Clamp to non-negative so a single strong "raw" pick can't invert a weight. */
function clampWeights(w: PreferenceWeights): PreferenceWeights {
  const next = { ...w };
  for (const key of WEIGHT_KEYS) next[key] = Math.max(0, next[key]);
  return next;
}

export interface ProfileInputs {
  selectedMoods: MoodId[];
  freeTextMood?: string;
  tradeChoices?: Record<string, TradeChoice>;
  frictionTolerance?: number; // 0..100
}

/**
 * Build preference weights from moods, trade-offs and free text.
 * Free text contributes light keyword nudges so typed intent isn't ignored.
 */
export function buildPreferenceWeights(inputs: ProfileInputs): PreferenceWeights {
  let w = baselineWeights();

  for (const moodId of inputs.selectedMoods) {
    const mood = MOOD_BY_ID[moodId];
    if (mood) w = addDeltas(w, mood.weights);
  }

  if (inputs.tradeChoices) {
    for (const t of TRADEOFFS) {
      const choice = inputs.tradeChoices[t.id];
      if (!choice || choice === "neutral") continue;
      if (choice === "left") w = addDeltas(w, t.left.weights);
      else if (choice === "right") w = addDeltas(w, t.right.weights);
      else if (choice === "both") {
        // moderate both sides
        w = addDeltas(w, halve(t.left.weights));
        w = addDeltas(w, halve(t.right.weights));
      }
    }
  }

  const text = (inputs.freeTextMood ?? "").toLowerCase();
  if (text) w = addDeltas(w, keywordNudges(text));

  // Friction tolerance: high tolerance lowers the priority on low-friction.
  if (inputs.frictionTolerance !== undefined) {
    const t = inputs.frictionTolerance / 100; // 0..1
    w.lowFriction = Math.max(0, w.lowFriction + (1 - t) * 2 - 1);
    w.novelty = w.novelty + t * 1;
  }

  return clampWeights(w);
}

function halve(d: Partial<PreferenceWeights>): Partial<PreferenceWeights> {
  const out: Partial<PreferenceWeights> = {};
  for (const k of Object.keys(d) as (keyof PreferenceWeights)[]) out[k] = (d[k] as number) * 0.5;
  return out;
}

const KEYWORDS: { match: RegExp; deltas: Partial<PreferenceWeights> }[] = [
  { match: /cheap|budget|afford|money/, deltas: { cost: 2 } },
  { match: /night|club|party|bar|dance/, deltas: { nightlife: 2 } },
  { match: /queer|gay|lgbt|lesbian|trans|pride/, deltas: { queer: 2, safety: 1 } },
  { match: /safe|secure|comfortable/, deltas: { safety: 1.5, comfort: 1 } },
  { match: /different|new|surprise|adventure|raw|gritty/, deltas: { novelty: 2, localReality: 1 } },
  { match: /beautiful|pretty|scenic|view/, deltas: { sensory: 1.5, comfort: 1 } },
  { match: /food|eat|cuisine|restaurant/, deltas: { sensory: 1, localReality: 0.5 } },
  { match: /shop|design|vintage|buy/, deltas: { shopping: 2 } },
  { match: /quiet|calm|relax|slow/, deltas: { comfort: 1, lowFriction: 1, touristAvoidance: 1 } },
  { match: /crowd|tourist/, deltas: { touristAvoidance: 1.5 } },
];

function keywordNudges(text: string): Partial<PreferenceWeights> {
  let out: Partial<PreferenceWeights> = {};
  for (const { match, deltas } of KEYWORDS) {
    if (match.test(text)) out = { ...mergeDeltas(out, deltas) };
  }
  return out;
}

function mergeDeltas(
  a: Partial<PreferenceWeights>,
  b: Partial<PreferenceWeights>,
): Partial<PreferenceWeights> {
  const out: Partial<PreferenceWeights> = { ...a };
  for (const k of Object.keys(b) as (keyof PreferenceWeights)[]) {
    out[k] = (out[k] ?? 0) + (b[k] as number);
  }
  return out;
}

/** Collect active vibe tags from selected moods. */
export function vibeTagsFromMoods(moods: MoodId[]): string[] {
  const tags = new Set<string>();
  for (const id of moods) {
    const mood = MOOD_BY_ID[id];
    if (mood) mood.vibeTags.forEach((t) => tags.add(t));
  }
  return [...tags];
}

/** A balanced "Surprise me" profile. */
export function surpriseProfile(): Partial<UserProfile> {
  return {
    selectedMoods: ["beautiful-easy", "freedom-nightlife", "different-from-prague"],
    preferenceWeights: buildPreferenceWeights({
      selectedMoods: ["beautiful-easy", "freedom-nightlife", "different-from-prague"],
    }),
    activeVibeTags: ["Surprise me", "Balanced", "Nightlife", "Beautiful"],
    onboarded: true,
  };
}

/** Human-readable priority ranking, used by the Profile Summary screen. */
export interface PriorityIndicator {
  key: keyof PreferenceWeights;
  label: string;
  level: "Low" | "Medium" | "High";
  value: number;
}

const PRIORITY_LABELS: Partial<Record<keyof PreferenceWeights, string>> = {
  cost: "Budget",
  nightlife: "Nightlife",
  queer: "Queer Scene",
  safety: "Safety",
  comfort: "Comfort",
  novelty: "Different from Prague",
  lowFriction: "Friction tolerance",
  sensory: "Sensory atmosphere",
};

export function priorityIndicators(weights: PreferenceWeights): PriorityIndicator[] {
  const entries = Object.entries(PRIORITY_LABELS) as [keyof PreferenceWeights, string][];
  const max = Math.max(...entries.map(([k]) => weights[k]), 1);
  return entries.map(([key, label]) => {
    const value = weights[key];
    const ratio = value / max;
    let level: PriorityIndicator["level"] = "Low";
    if (ratio > 0.66) level = "High";
    else if (ratio > 0.33) level = "Medium";
    // For friction, the weight is on *low* friction; invert the label meaning.
    if (key === "lowFriction") {
      level = ratio > 0.66 ? "Low" : ratio > 0.33 ? "Medium" : "High";
    }
    return { key, label, level, value };
  });
}
