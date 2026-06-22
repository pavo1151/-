import type { LensId } from "@/types";

export interface LensData {
  id: LensId;
  label: string;
  glyph: string;
  blurb: string;
}

/** Portal lenses — re-highlight hotspots for a traveler type. */
export const LENSES: LensData[] = [
  { id: "first-time", label: "First-time traveler", glyph: "🧳", blurb: "Landmarks, walking, easy orientation." },
  { id: "budget", label: "Budget traveler", glyph: "🪙", blurb: "Cheap eats, best buys, value." },
  { id: "solo", label: "Solo traveler", glyph: "🧍", blurb: "Safe routes, social spots, comfort." },
  { id: "queer", label: "Queer traveler", glyph: "🏳️‍🌈", blurb: "Community, nightlife, safety." },
  { id: "nightlife", label: "Nightlife traveler", glyph: "🪩", blurb: "Bars, clubs, late food." },
  { id: "shopping", label: "Shopping traveler", glyph: "🛍️", blurb: "Design, vintage, local makers." },
  { id: "food", label: "Food traveler", glyph: "🍽️", blurb: "Markets, tavernas, late snacks." },
  { id: "local-reality", label: "Local reality traveler", glyph: "🧭", blurb: "Beyond the tourist core." },
  { id: "post-prague", label: "Post-Prague contrast", glyph: "🔄", blurb: "How different does this feel?" },
];

export const LENS_BY_ID = Object.fromEntries(LENSES.map((l) => [l.id, l])) as Record<
  LensId,
  LensData
>;
