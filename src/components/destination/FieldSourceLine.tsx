import { BadgeCheck, Radio, PenLine } from "lucide-react";
import type { FieldSource } from "@/types";
import { cn } from "@/lib/format";

/** Small "verified <date> · source" affordance shown under a reality section. */
export function FieldSourceLine({ source, dark }: { source?: FieldSource; dark?: boolean }) {
  if (!source) return null;
  return (
    <div
      className={cn(
        "mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px]",
        dark ? "text-white/55" : "text-ink-400",
      )}
    >
      <span className="inline-flex items-center gap-1 font-medium">
        <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
        Verified {source.verifiedAt}
      </span>
      <span aria-hidden>·</span>
      <span>{source.source}</span>
      <LiveBadge live={source.live} />
    </div>
  );
}

export function LiveBadge({ live }: { live: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold border",
        live
          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
          : "bg-ink-700/5 text-ink-400 border-ink/10",
      )}
    >
      {live ? <Radio className="h-2.5 w-2.5" /> : <PenLine className="h-2.5 w-2.5" />}
      {live ? "Live" : "Editorial"}
    </span>
  );
}
