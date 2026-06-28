import { Compass, Map, GitCompareArrows, Play, Bookmark } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  /** i18n key under "nav.*" */
  labelKey: string;
  to: string;
  icon: LucideIcon;
  /** routes that should also light this item as active */
  match?: string[];
}

/** Primary navigation: Discover, Map, Compare, Simulate, Saved. */
export const NAV_ITEMS: NavItem[] = [
  { labelKey: "nav.discover", to: "/discover", icon: Compass, match: ["/discover", "/worlds", "/destination"] },
  { labelKey: "nav.map", to: "/map", icon: Map, match: ["/map"] },
  { labelKey: "nav.compare", to: "/compare", icon: GitCompareArrows, match: ["/compare"] },
  { labelKey: "nav.simulate", to: "/simulate", icon: Play, match: ["/simulate"] },
  { labelKey: "nav.saved", to: "/saved", icon: Bookmark, match: ["/saved", "/route"] },
];

export function isNavActive(item: NavItem, pathname: string): boolean {
  return (item.match ?? [item.to]).some((m) => pathname.startsWith(m));
}
