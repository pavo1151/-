import { Compass, Map, GitCompareArrows, Play, Bookmark } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  /** routes that should also light this item as active */
  match?: string[];
}

/** Primary navigation: Discover, Map, Compare, Simulate, Saved. */
export const NAV_ITEMS: NavItem[] = [
  { label: "Discover", to: "/discover", icon: Compass, match: ["/discover", "/worlds", "/destination"] },
  { label: "Map", to: "/map", icon: Map, match: ["/map"] },
  { label: "Compare", to: "/compare", icon: GitCompareArrows, match: ["/compare"] },
  { label: "Simulate", to: "/simulate", icon: Play, match: ["/simulate"] },
  { label: "Saved", to: "/saved", icon: Bookmark, match: ["/saved", "/route"] },
];

export function isNavActive(item: NavItem, pathname: string): boolean {
  return (item.match ?? [item.to]).some((m) => pathname.startsWith(m));
}
