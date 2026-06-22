import { motion } from "framer-motion";
import { cn } from "@/lib/format";
import { fitLabel } from "@/lib/format";

/** Animated circular fit-score ring (cinematic + editorial). */
export function FitScoreRing({
  value,
  size = 88,
  stroke = 8,
  dark,
  label = true,
  className,
}: {
  value: number;
  size?: number;
  stroke?: number;
  dark?: boolean;
  label?: boolean;
  className?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / 100);
  return (
    <div className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={dark ? "rgba(255,255,255,0.14)" : "rgba(30,58,95,0.10)"}
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="url(#fitGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="fitGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#F8A981" />
            <stop offset="1" stopColor="#F6885B" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn("font-editorial font-semibold leading-none", dark ? "text-white" : "text-ink-700")} style={{ fontSize: size * 0.28 }}>
          {value}
        </span>
        {label && (
          <span className={cn("text-[10px] font-semibold tracking-wide mt-0.5", dark ? "text-white/60" : "text-ink-400")}>
            % FIT
          </span>
        )}
      </div>
    </div>
  );
}

/** Compact pill badge with fit % + label. */
export function FitScoreBadge({
  value,
  dark,
  className,
}: {
  value: number;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3 py-1.5",
        dark ? "bg-white/10 border border-white/15 text-white" : "bg-coral-50 border border-coral-100",
        className,
      )}
    >
      <span className={cn("font-editorial font-bold text-lg leading-none", dark ? "text-white" : "text-coral-700")}>
        {value}%
      </span>
      <span className={cn("text-xs font-medium", dark ? "text-white/70" : "text-coral-600")}>
        {fitLabel(value)}
      </span>
    </div>
  );
}
