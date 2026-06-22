import { type ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/format";

function useLockScroll(open: boolean) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);
}

/** Centered modal dialog (editorial light by default). */
export function Modal({
  open,
  onClose,
  children,
  title,
  className,
  dark,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: ReactNode;
  className?: string;
  dark?: boolean;
}) {
  useLockScroll(open);
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.94, y: 12, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className={cn(
              "relative w-full max-w-lg rounded-3xl p-6 shadow-lift",
              dark ? "bg-night-800 text-white border border-white/10" : "bg-white",
              className,
            )}
          >
            {title && (
              <div className="flex items-center justify-between mb-4">
                <h3 className={cn("editorial-heading text-xl", dark ? "text-white" : "text-ink-700")}>
                  {title}
                </h3>
              </div>
            )}
            <button
              onClick={onClose}
              className={cn(
                "absolute top-5 right-5 rounded-full p-1.5 transition-colors",
                dark ? "hover:bg-white/10 text-white/70" : "hover:bg-ink/5 text-ink-400",
              )}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/** Bottom sheet — native-feeling on mobile, used heavily in the portal. */
export function BottomSheet({
  open,
  onClose,
  children,
  dark = true,
  maxWidth = "max-w-2xl",
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  dark?: boolean;
  maxWidth?: string;
}) {
  useLockScroll(open);
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ y: "100%", opacity: 0.6 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0.4 }}
            transition={{ type: "spring", stiffness: 280, damping: 30 }}
            className={cn(
              "relative w-full rounded-t-4xl sm:rounded-4xl p-5 sm:p-6 max-h-[88vh] overflow-y-auto no-scrollbar shadow-sheet",
              maxWidth,
              dark
                ? "bg-night-800/95 backdrop-blur-2xl text-white border-t sm:border border-white/10"
                : "bg-white",
            )}
          >
            <div
              className={cn(
                "mx-auto mb-4 h-1.5 w-12 rounded-full sm:hidden",
                dark ? "bg-white/25" : "bg-ink/15",
              )}
            />
            <button
              onClick={onClose}
              className={cn(
                "absolute top-4 right-4 rounded-full p-1.5 transition-colors z-10",
                dark ? "hover:bg-white/10 text-white/70" : "hover:bg-ink/5 text-ink-400",
              )}
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

/** Right-side detail drawer for the portal map view. */
export function Drawer({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  useLockScroll(open);
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 280, damping: 32 }}
            className="relative h-full w-full max-w-md bg-night-800/95 backdrop-blur-2xl text-white border-l border-white/10 p-6 overflow-y-auto no-scrollbar shadow-sheet"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 rounded-full p-1.5 hover:bg-white/10 text-white/70"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
