import { motion } from "framer-motion";
import { cn } from "@/lib/format";

/** Onboarding step indicator: "Step N of M" + animated bar. */
export function StepProgress({
  step,
  total,
  className,
}: {
  step: number;
  total: number;
  className?: string;
}) {
  const pct = (step / total) * 100;
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-xs font-semibold text-ink-400 whitespace-nowrap">
        Step {step} of {total}
      </span>
      <div className="h-1.5 w-32 sm:w-48 overflow-hidden rounded-full bg-ink/8">
        <motion.div
          className="h-full rounded-full bg-coral-gradient"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
