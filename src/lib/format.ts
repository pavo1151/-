import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind-aware className combiner. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** 0..10 score → label. */
export function scoreLabel(score: number): string {
  if (score >= 9) return "Excellent";
  if (score >= 7.5) return "Very high";
  if (score >= 6) return "Good";
  if (score >= 4.5) return "Medium";
  if (score >= 3) return "Low–Medium";
  return "Low";
}

/** 0..10 score → qualitative level for chips. */
export function scoreLevel(score: number): "high" | "medium" | "low" {
  if (score >= 7) return "high";
  if (score >= 4.5) return "medium";
  return "low";
}

export function frictionLabel(score: number): string {
  if (score <= 3) return "Low friction";
  if (score <= 5) return "Some friction";
  return "Higher friction";
}

export function fitLabel(fit: number): string {
  if (fit >= 88) return "Great match";
  if (fit >= 80) return "Strong match";
  if (fit >= 70) return "Good match";
  if (fit >= 55) return "Worth a look";
  return "Lower match";
}

export function pluralize(n: number, word: string): string {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

export function relativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}
