import { cn } from "@/lib/format";

/** The lowercase "eurovibe" wordmark with a small fit-ring glyph. */
export function Wordmark({ dark, className }: { dark?: boolean; className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-2 select-none", className)}>
      <svg viewBox="0 0 32 32" className="h-7 w-7">
        <circle
          cx="16"
          cy="16"
          r="11"
          fill="none"
          stroke="url(#wm)"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeDasharray="55 18"
          transform="rotate(-90 16 16)"
        />
        <circle cx="16" cy="16" r="3.4" fill="#FFC979" />
        <defs>
          <linearGradient id="wm" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F8A981" />
            <stop offset="1" stopColor="#F6885B" />
          </linearGradient>
        </defs>
      </svg>
      <span
        className={cn(
          "font-editorial text-xl font-semibold tracking-tight lowercase",
          dark ? "text-white" : "text-ink-700",
        )}
      >
        eurovibe
      </span>
    </div>
  );
}
