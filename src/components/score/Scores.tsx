import { motion } from "framer-motion";
import { cn, scoreLabel, scoreLevel } from "@/lib/format";

/** A row of 10 dots representing a 0..10 score (compare-card style). */
export function ScoreDots({
  score,
  color = "coral",
  dark,
}: {
  score: number;
  color?: "coral" | "violet" | "emerald" | "sky" | "amber";
  dark?: boolean;
}) {
  const filledColor: Record<string, string> = {
    coral: "bg-coral-500",
    violet: "bg-violet-500",
    emerald: "bg-emerald-500",
    sky: "bg-sky-500",
    amber: "bg-amber-500",
  };
  const empty = dark ? "bg-white/15" : "bg-ink/10";
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 10 }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: i * 0.02, type: "spring", stiffness: 400, damping: 20 }}
          className={cn("h-2 w-2 rounded-full", i < Math.round(score) ? filledColor[color] : empty)}
        />
      ))}
    </div>
  );
}

/** Horizontal score bar with label. */
export function ScoreBar({
  label,
  score,
  dark,
}: {
  label: string;
  score: number;
  dark?: boolean;
}) {
  const level = scoreLevel(score);
  const barColor =
    level === "high" ? "bg-emerald-500" : level === "medium" ? "bg-amber-500" : "bg-rose-400";
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className={cn("font-medium", dark ? "text-white/80" : "text-ink-600")}>{label}</span>
        <span className={cn("text-xs", dark ? "text-white/50" : "text-ink-400")}>
          {scoreLabel(score)}
        </span>
      </div>
      <div className={cn("h-2 rounded-full overflow-hidden", dark ? "bg-white/10" : "bg-ink/8")}>
        <motion.div
          className={cn("h-full rounded-full", barColor)}
          initial={{ width: 0 }}
          animate={{ width: `${score * 10}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

/** Small inline score chip used on destination cards. */
export function ScoreChip({
  label,
  score,
  icon,
  dark,
}: {
  label: string;
  score: number;
  icon?: React.ReactNode;
  dark?: boolean;
}) {
  const level = scoreLevel(score);
  const tones: Record<string, string> = {
    high: dark ? "text-emerald-300" : "text-emerald-600",
    medium: dark ? "text-amber-300" : "text-amber-600",
    low: dark ? "text-rose-300" : "text-rose-500",
  };
  return (
    <div className="flex flex-col items-start gap-0.5">
      <div className={cn("flex items-center gap-1 text-xs font-semibold", tones[level])}>
        {icon}
        {scoreLabel(score)}
      </div>
      <span className={cn("text-[11px]", dark ? "text-white/50" : "text-ink-400")}>{label}</span>
    </div>
  );
}
