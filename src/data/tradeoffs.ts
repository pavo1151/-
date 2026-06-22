import type { PreferenceWeights } from "@/types";

export type TradeChoice = "left" | "both" | "neutral" | "right";

export interface TradeoffData {
  id: string;
  left: { title: string; cue: string; gradient: string; weights: Partial<PreferenceWeights> };
  right: { title: string; cue: string; gradient: string; weights: Partial<PreferenceWeights> };
}

/**
 * Trade-off logic (from spec).
 * "left"/"right" apply that side's deltas; "both" applies both at moderate strength;
 * "neutral" applies nothing.
 */
export const TRADEOFFS: TradeoffData[] = [
  {
    id: "cost-vs-nightlife",
    left: {
      title: "Cheaper",
      cue: "Lower daily spend matters more.",
      gradient: "from-amber-200 to-orange-100",
      weights: { cost: 3 },
    },
    right: {
      title: "More Nightlife",
      cue: "A great night out matters more.",
      gradient: "from-violet-200 to-fuchsia-100",
      weights: { nightlife: 3 },
    },
  },
  {
    id: "safe-vs-free",
    left: {
      title: "Safer & Easier",
      cue: "Smooth, predictable, low stress.",
      gradient: "from-emerald-200 to-teal-100",
      weights: { safety: 2.5, comfort: 1.5, lowFriction: 2 },
    },
    right: {
      title: "Freer & More Surprising",
      cue: "Open to the unexpected.",
      gradient: "from-rose-200 to-red-100",
      weights: { novelty: 2.5, sensory: 1.5, lowFriction: -1.5 },
    },
  },
  {
    id: "polished-vs-raw",
    left: {
      title: "Beautiful & Polished",
      cue: "Postcard beauty, refined.",
      gradient: "from-sky-200 to-blue-100",
      weights: { comfort: 2, sensory: 2, safety: 1 },
    },
    right: {
      title: "Raw & Lively",
      cue: "Gritty, real, full of energy.",
      gradient: "from-orange-200 to-amber-100",
      weights: { nightlife: 2, novelty: 2, localReality: 2, sensory: 1 },
    },
  },
  {
    id: "queer-vs-cost",
    left: {
      title: "Stronger Queer Scene",
      cue: "Visible community & nightlife.",
      gradient: "from-pink-200 to-purple-100",
      weights: { queer: 3 },
    },
    right: {
      title: "Lower Daily Cost",
      cue: "Keep the budget light.",
      gradient: "from-amber-200 to-yellow-100",
      weights: { cost: 3 },
    },
  },
  {
    id: "familiar-vs-different",
    left: {
      title: "Familiar & Easy",
      cue: "Comfortable and easy to read.",
      gradient: "from-blue-200 to-indigo-100",
      weights: { comfort: 2, lowFriction: 2 },
    },
    right: {
      title: "Different & Surprising",
      cue: "A real change of scene.",
      gradient: "from-cyan-200 to-emerald-100",
      weights: { novelty: 3, touristAvoidance: 1 },
    },
  },
];
