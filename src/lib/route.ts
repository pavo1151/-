import type { Destination, RouteMode, RoutePlan, RouteStep } from "@/types";
import { getDestinationById } from "./matching";

export interface RouteModeMeta {
  id: RouteMode;
  label: string;
}

export const ROUTE_MODES: RouteModeMeta[] = [
  { id: "balanced", label: "Balanced" },
  { id: "cheapest", label: "Cheapest" },
  { id: "queer-nightlife", label: "Queer nightlife" },
  { id: "less-friction", label: "Less friction" },
  { id: "more-different", label: "More different from Prague" },
];

/** Order destinations for a route mode. */
function sortForMode(destinations: Destination[], mode: RouteMode): Destination[] {
  const list = [...destinations];
  switch (mode) {
    case "cheapest":
      return list.sort((a, b) => b.costScore - a.costScore);
    case "queer-nightlife":
      return list.sort(
        (a, b) => b.queerScore + b.nightlifeScore - (a.queerScore + a.nightlifeScore),
      );
    case "less-friction":
      return list.sort((a, b) => a.frictionScore - b.frictionScore);
    case "more-different":
      return list.sort((a, b) => b.differentFromPragueScore - a.differentFromPragueScore);
    case "balanced":
    default:
      return list.sort((a, b) => b.fitBaseScore - a.fitBaseScore);
  }
}

/** Suggested nights per stop, scaled a little by how much there is to do. */
function suggestedDays(d: Destination): number {
  const richness = d.nightlifeScore + d.sensoryScore + d.touristDensityScore;
  if (richness >= 24) return 4;
  if (richness >= 18) return 3;
  return 3;
}

function transferFriction(from: Destination, to: Destination): string {
  if (from.region === to.region) return "Short hop — easy regional transfer.";
  if (from.region === "Central Europe" && to.region === "Balkans")
    return "Medium — bus or budget flight, plan a half-day.";
  if (to.region === "Mediterranean" || from.region === "Mediterranean")
    return "Longer — likely a flight; budget most of a travel day.";
  return "Medium — check buses, trains and budget flights.";
}

/**
 * Build a route preview from a set of saved destination ids.
 */
export function generateRoutePreview(
  destinationIds: string[],
  mode: RouteMode = "balanced",
): RoutePlan {
  const destinations = destinationIds
    .map((id) => getDestinationById(id))
    .filter((d): d is Destination => Boolean(d));

  const ordered = sortForMode(destinations, mode);

  const steps: RouteStep[] = ordered.map((d, i) => {
    const prev = ordered[i - 1];
    return {
      destinationId: d.id,
      days: suggestedDays(d),
      vibe: d.shortVibe,
      cost: d.dailyCostNormal,
      reason: routeReason(d, mode),
      transferFriction: prev ? transferFriction(prev, d) : "Start point — fly in here.",
      movementNote: i === 0 ? "Begin the route here." : `From ${prev?.city}.`,
    };
  });

  return { id: crypto.randomUUID(), mode, steps, createdAt: Date.now() };
}

function routeReason(d: Destination, mode: RouteMode): string {
  switch (mode) {
    case "cheapest":
      return `Keeps the route affordable (${d.dailyCostNormal}/day).`;
    case "queer-nightlife":
      return `Adds nightlife and a visible scene to the route.`;
    case "less-friction":
      return `Low-friction stop that keeps the trip smooth.`;
    case "more-different":
      return `Pushes the route further from a classic Central-Europe feel.`;
    case "balanced":
    default:
      return `Balanced anchor: ${d.atmosphereTags.slice(0, 2).join(", ").toLowerCase()}.`;
  }
}
