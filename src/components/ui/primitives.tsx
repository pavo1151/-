import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/format";

export function Card({
  children,
  className,
  onClick,
  interactive,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-3xl bg-white shadow-card border border-white/70",
        interactive && "cursor-pointer transition-all hover:shadow-lift hover:-translate-y-1",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function GlassPanel({
  children,
  className,
  dark,
}: {
  children: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={cn(dark ? "glass-dark" : "glass", "rounded-3xl", className)}>{children}</div>
  );
}

export function Chip({
  children,
  active,
  tone = "neutral",
  className,
  onClick,
  as = "button",
}: {
  children: ReactNode;
  active?: boolean;
  tone?: "neutral" | "coral" | "high" | "medium" | "low" | "ink";
  className?: string;
  onClick?: () => void;
  as?: "button" | "span";
}) {
  const tones: Record<string, string> = {
    neutral: active
      ? "bg-ink-700 text-white border-ink-700"
      : "bg-white/70 text-ink-600 border-ink/10 hover:border-ink/30",
    coral: active
      ? "bg-coral text-white border-coral shadow-glow"
      : "bg-coral-50 text-coral-700 border-coral-100 hover:border-coral-300",
    ink: "bg-ink-700/5 text-ink-600 border-ink/10",
    high: "bg-emerald-50 text-emerald-700 border-emerald-100",
    medium: "bg-amber-50 text-amber-700 border-amber-100",
    low: "bg-rose-50 text-rose-700 border-rose-100",
  };
  const Comp: any = as;
  return (
    <Comp
      onClick={onClick}
      className={cn("chip border", tones[tone], className)}
    >
      {children}
    </Comp>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-coral-600">{eyebrow}</p>
      )}
      <h1 className="editorial-heading text-3xl sm:text-4xl leading-tight text-balance">{title}</h1>
      {subtitle && <p className="text-ink-400 text-base sm:text-lg max-w-2xl">{subtitle}</p>}
    </div>
  );
}

export function PageContainer({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6 py-6 sm:py-10", className)}
    >
      {children}
    </motion.div>
  );
}

export function EmptyState({
  glyph = "🧭",
  title,
  body,
  action,
}: {
  glyph?: string;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="text-5xl mb-4">{glyph}</div>
      <h3 className="editorial-heading text-2xl text-ink-700 mb-2">{title}</h3>
      {body && <p className="text-ink-400 max-w-md mb-6">{body}</p>}
      {action}
    </div>
  );
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="h-10 w-10 rounded-full border-[3px] border-coral/30 border-t-coral animate-spin" />
      <p className="text-ink-400 text-sm">{label}</p>
    </div>
  );
}

/** Shimmer skeleton block. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-gradient-to-r from-ink/5 via-ink/10 to-ink/5 bg-[length:800px_100%] animate-shimmer",
        className,
      )}
    />
  );
}
