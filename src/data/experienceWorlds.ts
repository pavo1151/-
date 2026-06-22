import type { ExperienceWorld } from "@/types";

/**
 * Experience Worlds group destinations into emotional clusters.
 * Only ids present in our dataset become clickable; others render as descriptive chips.
 */
export const EXPERIENCE_WORLDS: ExperienceWorld[] = [
  {
    id: "cheap-lively-rough",
    title: "Cheap, Lively & Rough",
    description: "Low costs, raw energy and social nights over polish.",
    destinationIds: ["belgrade", "sofia", "bucharest", "skopje"],
    fit: 91,
    gradient: "from-orange-200 via-amber-100 to-rose-200",
  },
  {
    id: "mediterranean-different",
    title: "Mediterranean & Different",
    description: "Warm, ancient and a real break from Central Europe.",
    destinationIds: ["athens", "thessaloniki", "heraklion", "catania"],
    fit: 88,
    gradient: "from-sky-200 via-cyan-100 to-amber-100",
  },
  {
    id: "queer-night-oriented",
    title: "Queer & Night-Oriented",
    description: "Visible community and strong, welcoming nightlife.",
    destinationIds: ["athens", "budapest", "barcelona", "berlin"],
    fit: 86,
    gradient: "from-pink-200 via-fuchsia-100 to-violet-200",
  },
  {
    id: "comfortable-urban-energy",
    title: "Comfortable Urban Energy",
    description: "Beautiful, easy cities with reliable comfort and buzz.",
    destinationIds: ["budapest", "vienna", "lisbon", "milan"],
    fit: 82,
    gradient: "from-blue-200 via-indigo-100 to-sky-200",
  },
  {
    id: "adventurous-uncertain",
    title: "Adventurous with Some Uncertainty",
    description: "More surprise, more friction, more reward.",
    destinationIds: ["tbilisi", "batumi", "tirana", "sarajevo"],
    fit: 79,
    gradient: "from-emerald-200 via-teal-100 to-lime-200",
  },
];
