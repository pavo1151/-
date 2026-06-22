import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { useEurovibeStore } from "@/store/useEurovibeStore";

/** Global toast confirmation, mounted once in the app shell. */
export function ToastHost() {
  const toast = useEurovibeStore((s) => s.toast);
  const clearToast = useEurovibeStore((s) => s.clearToast);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(clearToast, 2600);
    return () => clearTimeout(t);
  }, [toast, clearToast]);

  return (
    <div className="fixed inset-x-0 bottom-24 sm:bottom-8 z-[60] flex justify-center px-4 pointer-events-none">
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ y: 24, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 12, opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 360, damping: 28 }}
            className="pointer-events-auto flex items-center gap-2.5 rounded-full bg-ink-900 text-white pl-3 pr-5 py-2.5 shadow-lift"
          >
            <span
              className={`flex h-6 w-6 items-center justify-center rounded-full ${
                toast.tone === "success" ? "bg-emerald-400/90" : "bg-coral"
              }`}
            >
              {toast.tone === "success" ? (
                <Check className="h-3.5 w-3.5 text-ink-900" />
              ) : (
                <Sparkles className="h-3.5 w-3.5 text-white" />
              )}
            </span>
            <span className="text-sm font-medium">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
