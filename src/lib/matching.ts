import type {
  Destination,
  PreferenceWeights,
  ScoredDestination,
  PortalHotspot,
  ExperienceWorld,
  LensId,
} from "@/types";
import { DESTINATIONS, DESTINATIONS_BY_ID } from "@/data/destinations";
import { EXPERIENCE_WORLDS } from "@/data/experienceWorlds";

/**
 * Fit score formula (from spec):
 *   raw = costW*cost + nightlifeW*nightlife + queerW*queer + safetyW*safety
 *       + noveltyW*differentFromPrague + sensoryW*sensory + comfortW*comfort
 *       - frictionPenalty*friction - touristAvoidanceW*touristDensity
 * Then normalized to 0..100 against the theoretical min/max for the weights.
 */
export function calculateFitScore(
  weights: PreferenceWeights,
  d: Destination,
): number {
  const positive =
    weights.cost * d.costScore +
    weights.nightlife * d.nightlifeScore +
    weights.queer * d.queerScore +
    weights.safety * d.safetyScore +
    weights.novelty * d.differentFromPragueScore +
    weights.sensory * d.sensoryScore +
    weights.comfort * d.comfortScore +
    weights.shopping * d.shoppingScore +
    weights.localReality * (10 - d.touristDensityScore); // local feel ~ inverse tourist density

  const penalties =
    weights.lowFriction * d.frictionScore + weights.touristAvoidance * d.touristDensityScore;

  const raw = positive - penalties;

  // Theoretical bounds for normalization (all-10 positives, all-10 penalties).
  const posWeightSum =
    weights.cost +
    weights.nightlife +
    weights.queer +
    weights.safety +
    weights.novelty +
    weights.sensory +
    weights.comfort +
    weights.shopping +
    weights.localReality;
  const penWeightSum = weights.lowFriction + weights.touristAvoidance;

  const max = posWeightSum * 10;
  const min = -(penWeightSum * 10);
  const span = Math.max(max - min, 1);

  const normalized = ((raw - min) / span) * 100;
  // Blend lightly with the destination's editorial base score for stability.
  const blended = normalized * 0.82 + d.fitBaseScore * 0.18;
  return Math.round(Math.min(100, Math.max(0, blended)));
}

export function getDestinationById(id: string): Destination | undefined {
  return DESTINATIONS_BY_ID[id];
}

export function allDestinations(): Destination[] {
  return DESTINATIONS;
}

export function scoreAll(weights: PreferenceWeights): ScoredDestination[] {
  return DESTINATIONS.map((destination) => ({
    destination,
    fitScore: calculateFitScore(weights, destination),
  }));
}

export function getTopMatches(
  weights: PreferenceWeights,
  limit = DESTINATIONS.length,
): ScoredDestination[] {
  return scoreAll(weights)
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, limit);
}

/** Per-layer emphasis score for the desire map (single dimension). */
export type MapLayer =
  | "overall"
  | "cheap"
  | "queer"
  | "nightlife"
  | "different"
  | "comfort"
  | "adventure"
  | "safety";

export function layerScore(
  layer: MapLayer,
  weights: PreferenceWeights,
  d: Destination,
): number {
  switch (layer) {
    case "cheap":
      return d.costScore * 10;
    case "queer":
      return d.queerScore * 10;
    case "nightlife":
      return d.nightlifeScore * 10;
    case "different":
      return d.differentFromPragueScore * 10;
    case "comfort":
      return d.comfortScore * 10;
    case "adventure":
      return ((d.differentFromPragueScore + d.frictionScore) / 2) * 10;
    case "safety":
      return d.safetyScore * 10;
    case "overall":
    default:
      return calculateFitScore(weights, d);
  }
}

export function rankByLayer(
  layer: MapLayer,
  weights: PreferenceWeights,
): ScoredDestination[] {
  return DESTINATIONS.map((destination) => ({
    destination,
    fitScore: Math.round(layerScore(layer, weights, destination)),
  })).sort((a, b) => b.fitScore - a.fitScore);
}

/** Destinations most unlike a reference, weighted by the user's novelty appetite. */
export function getOppositeDestinations(
  reference: Destination,
  weights: PreferenceWeights,
  limit = 3,
): ScoredDestination[] {
  return DESTINATIONS.filter((d) => d.id !== reference.id)
    .map((destination) => {
      const contrast =
        Math.abs(destination.costScore - reference.costScore) +
        Math.abs(destination.touristDensityScore - reference.touristDensityScore) +
        destination.differentFromPragueScore +
        Math.abs(destination.comfortScore - reference.comfortScore);
      // nudge by how much the user values novelty
      const score = contrast * 2 + calculateFitScore(weights, destination) * 0.2;
      return { destination, fitScore: Math.round(score) };
    })
    .sort((a, b) => b.fitScore - a.fitScore)
    .slice(0, limit);
}

export function getDestinationHotspots(destinationId: string): PortalHotspot[] {
  return getDestinationById(destinationId)?.portalHotspots ?? [];
}

/** Hotspot ids highlighted for the current lens (falls back to all). */
export function lensHotspotIds(d: Destination, lens: LensId): string[] {
  const ids = d.lensProfiles[lens];
  if (ids && ids.length) return ids;
  return d.portalHotspots.map((h) => h.id);
}

/** Experience worlds, ordered by fit + how many of our real destinations they contain. */
export function getExperienceWorlds(weights: PreferenceWeights): ExperienceWorld[] {
  return [...EXPERIENCE_WORLDS]
    .map((w) => {
      const real = w.destinationIds.filter((id) => DESTINATIONS_BY_ID[id]);
      const realFit = real.length
        ? Math.round(
            real
              .map((id) => calculateFitScore(weights, DESTINATIONS_BY_ID[id]))
              .reduce((a, b) => a + b, 0) / real.length,
          )
        : w.fit;
      // blend declared fit with computed fit of contained real destinations
      return { ...w, fit: Math.round(w.fit * 0.5 + realFit * 0.5) };
    })
    .sort((a, b) => b.fit - a.fit);
}

/** Real (clickable) destinations contained in a world. */
export function worldDestinations(world: ExperienceWorld): Destination[] {
  return world.destinationIds
    .map((id) => DESTINATIONS_BY_ID[id])
    .filter((d): d is Destination => Boolean(d));
}

/** A short generated reason a destination matches the profile. */
export function matchReason(weights: PreferenceWeights, d: Destination): string {
  const signals: { label: string; value: number }[] = [
    { label: "low cost", value: weights.cost * d.costScore },
    { label: "nightlife", value: weights.nightlife * d.nightlifeScore },
    { label: "a queer-friendly scene", value: weights.queer * d.queerScore },
    { label: "safety", value: weights.safety * d.safetyScore },
    { label: "a strong contrast from Prague", value: weights.novelty * d.differentFromPragueScore },
    { label: "comfort", value: weights.comfort * d.comfortScore },
    { label: "sensory atmosphere", value: weights.sensory * d.sensoryScore },
  ];
  const top = signals.sort((a, b) => b.value - a.value).slice(0, 2).map((s) => s.label);
  return `Matches your vibe for ${top.join(" and ")}.`;
}

/** Convenience: top match for the current weights (used by Welcome / Simulate defaults). */
export function topMatch(weights: PreferenceWeights): Destination {
  return getTopMatches(weights, 1)[0].destination;
}

export { DESTINATIONS };
