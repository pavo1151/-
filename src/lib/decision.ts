import type { Destination, DecisionSummary, PreferenceWeights, UserProfile } from "@/types";
import { calculateFitScore, getDestinationById } from "./matching";

/** Returns the destination's editorial decision summary (already authored in data). */
export function generateDecisionSummary(destinationId: string): DecisionSummary | undefined {
  return getDestinationById(destinationId)?.decisionSummary;
}

/**
 * Generate the natural-language Trip Profile summary sentence from weights.
 * Picks the strongest signals and assembles a human description.
 */
export function generateProfileSummary(weights: PreferenceWeights): string {
  const signals: { phrase: string; value: number }[] = [
    { phrase: "affordable", value: weights.cost },
    { phrase: "social and nightlife-friendly", value: weights.nightlife },
    { phrase: "queer-friendly", value: weights.queer },
    { phrase: "safe and easy", value: weights.safety + weights.lowFriction },
    { phrase: "different from Prague", value: weights.novelty },
    { phrase: "comfortable", value: weights.comfort },
    { phrase: "visually rewarding", value: weights.sensory },
    { phrase: "less polished and more surprising", value: weights.localReality + weights.touristAvoidance },
  ];
  const top = signals.sort((a, b) => b.value - a.value).slice(0, 3).map((s) => s.phrase);

  if (top.length === 0) return "You're looking for a balanced trip that feels just right.";

  const joined =
    top.length === 1
      ? top[0]
      : `${top.slice(0, -1).join(", ")} and ${top[top.length - 1]}`;

  // Tone: if low-friction is high, add the "without becoming too complicated" tail.
  const wantsEase = weights.lowFriction >= 2.5 || weights.comfort >= 3;
  const tail = wantsEase ? " — without becoming too complicated." : ".";
  return `You're looking for a destination that feels ${joined}${tail}`;
}

/** A short "why it fits you" paragraph for the Deep Card. */
export function whyItFitsYou(weights: PreferenceWeights, d: Destination): string {
  const fit = calculateFitScore(weights, d);
  const strongest: { label: string; value: number }[] = [
    { label: `its costs (${d.dailyCostNormal}/day typical)`, value: weights.cost * d.costScore },
    { label: "its nightlife", value: weights.nightlife * d.nightlifeScore },
    { label: "its queer-friendly layer", value: weights.queer * d.queerScore },
    { label: "how safe and easy it feels", value: weights.safety * d.safetyScore },
    { label: "how different it is from Prague", value: weights.novelty * d.differentFromPragueScore },
    { label: "its comfort", value: weights.comfort * d.comfortScore },
    { label: "its atmosphere", value: weights.sensory * d.sensoryScore },
  ];
  const top = strongest.sort((a, b) => b.value - a.value).slice(0, 2).map((s) => s.label);
  return `At a ${fit}% fit, ${d.city} lines up with your trip mainly through ${top.join(" and ")}.`;
}

/** Decide a saved-trip status from fit + regret risk. */
export function statusForTrip(
  fitScore: number,
  d: Destination,
): "Ready to plan" | "Compare again" | "Needs more checks" {
  if (d.regretRisk === "High") return "Needs more checks";
  if (fitScore >= 85) return "Ready to plan";
  if (fitScore >= 75) return "Compare again";
  return "Needs more checks";
}

/** Generate a short label for a saved trip card. */
export function tripLabel(d: Destination): string {
  const tag = d.atmosphereTags[0] ?? "Trip";
  const vibe = d.atmosphereTags[1] ?? d.shortVibe.split(",")[0];
  return `${tag} ${vibe} Trip`.replace(/\s+/g, " ").trim();
}

export type { UserProfile };
