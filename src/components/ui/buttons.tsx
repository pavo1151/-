import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { ArrowLeft, Bookmark, BookmarkCheck } from "lucide-react";
import { cn } from "@/lib/format";

type BaseProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  full?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

export const PrimaryButton = forwardRef<HTMLButtonElement, BaseProps>(
  ({ className, children, icon, full, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        base,
        "bg-coral-gradient text-white px-6 py-3 text-[15px] shadow-glow hover:shadow-lift hover:-translate-y-0.5",
        full && "w-full",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  ),
);
PrimaryButton.displayName = "PrimaryButton";

export const SecondaryButton = forwardRef<HTMLButtonElement, BaseProps>(
  ({ className, children, icon, full, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        base,
        "bg-white/80 text-ink-700 px-6 py-3 text-[15px] border border-ink/10 shadow-card hover:bg-white hover:-translate-y-0.5",
        full && "w-full",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  ),
);
SecondaryButton.displayName = "SecondaryButton";

/** Ghost button for dark/cinematic surfaces. */
export const GhostButton = forwardRef<HTMLButtonElement, BaseProps>(
  ({ className, children, icon, full, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        base,
        "bg-white/10 text-white px-5 py-2.5 text-sm border border-white/15 backdrop-blur-md hover:bg-white/20",
        full && "w-full",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  ),
);
GhostButton.displayName = "GhostButton";

export function BackButton({
  onClick,
  label = "Back",
  className,
}: {
  onClick?: () => void;
  label?: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 hover:text-ink-700 transition-colors",
        className,
      )}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </button>
  );
}

export function SaveButton({
  saved,
  onClick,
  className,
  compact,
}: {
  saved?: boolean;
  onClick?: () => void;
  className?: string;
  compact?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={saved}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium transition-all border",
        compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
        saved
          ? "bg-coral text-white border-coral shadow-glow"
          : "bg-white/80 text-ink-600 border-ink/10 hover:border-coral/40",
        className,
      )}
    >
      {saved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {saved ? "Saved" : "Save"}
    </button>
  );
}
