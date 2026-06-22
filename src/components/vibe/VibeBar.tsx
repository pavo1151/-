import { Sparkles } from "lucide-react";
import { useEurovibeStore } from "@/store/useEurovibeStore";
import { cn } from "@/lib/format";

/** Horizontal "active vibe" bar of chips, shown across discovery screens. */
export function VibeBar({
  dark,
  onEdit,
  className,
}: {
  dark?: boolean;
  onEdit?: () => void;
  className?: string;
}) {
  const tags = useEurovibeStore((s) => s.profile.activeVibeTags);
  if (tags.length === 0) return null;
  return (
    <div className={cn("flex items-center gap-2 overflow-x-auto no-scrollbar", className)}>
      <span
        className={cn(
          "inline-flex flex-none items-center gap-1 text-xs font-semibold uppercase tracking-wide",
          dark ? "text-white/60" : "text-ink-400",
        )}
      >
        <Sparkles className="h-3.5 w-3.5 text-coral-500" /> Your vibe
      </span>
      {tags.map((tag) => (
        <span
          key={tag}
          className={cn(
            "chip flex-none border text-xs",
            dark
              ? "bg-white/10 border-white/15 text-white"
              : "bg-white text-ink-600 border-ink/10",
          )}
        >
          {tag}
        </span>
      ))}
      {onEdit && (
        <button
          onClick={onEdit}
          className={cn(
            "chip flex-none border border-dashed text-xs",
            dark ? "border-white/25 text-white/70" : "border-coral-300 text-coral-600",
          )}
        >
          Edit
        </button>
      )}
    </div>
  );
}
