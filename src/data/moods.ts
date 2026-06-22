import type { MoodId, PreferenceWeights } from "@/types";

export interface MoodCardData {
  id: MoodId;
  title: string;
  cue: string;
  /** soft gradient background token (tailwind classes) */
  gradient: string;
  /** illustration emoji stand-in (soft 3D slot) */
  glyph: string;
  /** vibe tags contributed when selected */
  vibeTags: string[];
  /** weight deltas added to the preference model */
  weights: Partial<PreferenceWeights>;
}

/**
 * Trip Mood weight logic (from spec).
 * Deltas are added per selected mood, then normalized in lib/profile.ts.
 */
export const MOODS: MoodCardData[] = [
  {
    id: "cheap-escape",
    title: "Cheap Escape",
    cue: "Stretch every euro, keep it simple.",
    gradient: "from-amber-100 via-orange-50 to-rose-100",
    glyph: "🐷",
    vibeTags: ["Low cost", "Practical"],
    weights: { cost: 3, lowFriction: 2, comfort: 0.5 },
  },
  {
    id: "freedom-nightlife",
    title: "Freedom & Nightlife",
    cue: "Late nights, music, no curfew.",
    gradient: "from-indigo-100 via-violet-50 to-fuchsia-100",
    glyph: "🪩",
    vibeTags: ["Nightlife", "Social"],
    weights: { nightlife: 3, sensory: 2, queer: 0.5 },
  },
  {
    id: "queer-friendly",
    title: "More Queer-Friendly",
    cue: "Visible, welcoming, safe to be you.",
    gradient: "from-pink-100 via-rose-50 to-purple-100",
    glyph: "🏳️‍🌈",
    vibeTags: ["Queer friendly", "Safe"],
    weights: { queer: 3, nightlife: 1.5, safety: 1.5 },
  },
  {
    id: "different-from-prague",
    title: "Different from Prague",
    cue: "Break the Central-Europe pattern.",
    gradient: "from-sky-100 via-cyan-50 to-emerald-100",
    glyph: "🧭",
    vibeTags: ["Novelty", "Contrast"],
    weights: { novelty: 3, touristAvoidance: 2, localReality: 1 },
  },
  {
    id: "solo-not-lonely",
    title: "Solo but Not Lonely",
    cue: "Easy to meet people, easy to feel safe.",
    gradient: "from-teal-100 via-emerald-50 to-lime-100",
    glyph: "🧍",
    vibeTags: ["Safe", "Social"],
    weights: { safety: 3, nightlife: 1, lowFriction: 1.5 },
  },
  {
    id: "soft-adventure",
    title: "Soft Adventure",
    cue: "A little uncertainty, still comfortable.",
    gradient: "from-orange-100 via-amber-50 to-yellow-100",
    glyph: "🎒",
    vibeTags: ["Adventure", "Comfort"],
    weights: { novelty: 2, comfort: 1.5, localReality: 1 },
  },
  {
    id: "beautiful-easy",
    title: "Beautiful & Easy",
    cue: "Postcard views, low effort, smooth days.",
    gradient: "from-blue-100 via-sky-50 to-indigo-100",
    glyph: "🏛️",
    vibeTags: ["Beautiful", "Low friction"],
    weights: { comfort: 3, safety: 1.5, lowFriction: 2, sensory: 1.5 },
  },
  {
    id: "raw-lively",
    title: "Raw & Lively",
    cue: "Unpolished energy, real and alive.",
    gradient: "from-rose-100 via-red-50 to-orange-100",
    glyph: "🔥",
    vibeTags: ["Raw", "Lively"],
    weights: { nightlife: 2.5, novelty: 2, sensory: 2, localReality: 2, comfort: -1.5 },
  },
];

export const MOOD_BY_ID = Object.fromEntries(MOODS.map((m) => [m.id, m])) as Record<
  MoodId,
  MoodCardData
>;
