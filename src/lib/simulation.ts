import type { Simulation, SimulationDay, SimulationModifier } from "@/types";
import { getDestinationById } from "./matching";

export interface ModifierMeta {
  id: SimulationModifier;
  label: string;
  /** extra line appended to relevant days */
  note: string;
  tag: string;
}

export const MODIFIERS: ModifierMeta[] = [
  { id: "cheaper", label: "Make it cheaper", note: "Swap a paid stop for a free walk; eat where locals do.", tag: "Cheaper" },
  { id: "less-touristy", label: "Less touristy", note: "Trade the core for a quieter neighborhood this day.", tag: "Quieter" },
  { id: "more-queer", label: "More queer", note: "Add a queer-friendly venue or event (check current listings).", tag: "Queer" },
  { id: "more-nightlife", label: "More nightlife", note: "Push the evening later — bars, then somewhere with music.", tag: "Nightlife" },
  { id: "more-local", label: "More local", note: "Skip the obvious; ask a local where they actually go.", tag: "Local" },
  { id: "add-shopping", label: "Add shopping", note: "Carve out time for design, vintage or best-buy pockets.", tag: "Shopping" },
  { id: "reduce-friction", label: "Reduce friction", note: "Keep it nearby and unhurried — less transit, more ease.", tag: "Easy" },
  { id: "add-second", label: "Add second destination", note: "Leave a day open to bridge toward a second city.", tag: "Route" },
];

export const MODIFIER_BY_ID = Object.fromEntries(MODIFIERS.map((m) => [m.id, m])) as Record<
  SimulationModifier,
  ModifierMeta
>;

/**
 * Build a mood-based simulation from a destination's template, mutated by modifiers.
 * Each active modifier appends a note + tag to the most relevant day.
 */
export function getSimulationForDestination(
  destinationId: string,
  selectedHotspots: string[] = [],
  modifiers: SimulationModifier[] = [],
): Simulation {
  const dest = getDestinationById(destinationId);
  const template = dest?.simulationTemplates ?? [];

  const days: SimulationDay[] = template.map((t) => ({
    day: t.day,
    title: t.title,
    body: t.body,
    tags: [...t.tags],
  }));

  // Map a modifier to the day index it most naturally affects.
  const targetDay: Record<SimulationModifier, number> = {
    cheaper: 1,
    "less-touristy": 3,
    "more-queer": 2,
    "more-nightlife": 2,
    "more-local": 3,
    "add-shopping": 2,
    "reduce-friction": 0,
    "add-second": days.length - 1,
  };

  for (const mod of modifiers) {
    const meta = MODIFIER_BY_ID[mod];
    const idx = Math.min(Math.max(targetDay[mod] ?? 0, 0), days.length - 1);
    if (!days[idx]) continue;
    days[idx] = {
      ...days[idx],
      body: `${days[idx].body} ${meta.note}`,
      tags: days[idx].tags.includes(meta.tag) ? days[idx].tags : [...days[idx].tags, meta.tag],
    };
  }

  // Fold selected hotspots into day 1 context (lightweight personalization).
  if (selectedHotspots.length && days[0]) {
    const names = selectedHotspots
      .map((id) => dest?.portalHotspots.find((h) => h.id === id)?.title)
      .filter(Boolean) as string[];
    if (names.length) {
      days[0] = {
        ...days[0],
        body: `${days[0].body} You've pinned: ${names.join(", ")}.`,
      };
    }
  }

  return { destinationId, days, modifiers, selectedHotspots };
}

export function simulationTitle(destinationId: string, dayCount: number): string {
  const dest = getDestinationById(destinationId);
  return `How could ${dayCount} days in ${dest?.city ?? "this city"} feel?`;
}
