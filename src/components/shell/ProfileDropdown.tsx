import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Settings, Shield, RefreshCw, Sparkles } from "lucide-react";
import { useEurovibeStore } from "@/store/useEurovibeStore";
import { cn } from "@/lib/format";

/** Derives a playful "profile persona" name from the active vibe tags. */
function personaName(tags: string[]): string {
  if (tags.includes("Nightlife")) return "The Night Wanderer";
  if (tags.includes("Low cost") || tags.includes("Practical")) return "The Value Explorer";
  if (tags.includes("Queer friendly")) return "The Connector";
  if (tags.includes("Novelty") || tags.includes("Contrast")) return "The Contrast Seeker";
  if (tags.includes("Beautiful")) return "The Cultural Connector";
  return "The Explorer";
}

export function ProfileDropdown({ dark }: { dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const profile = useEurovibeStore((s) => s.profile);
  const resetProfile = useEurovibeStore((s) => s.resetProfile);
  const showToast = useEurovibeStore((s) => s.showToast);

  const persona = personaName(profile.activeVibeTags);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-2 rounded-full pl-1 pr-2.5 py-1 transition-all",
          dark ? "hover:bg-white/10 text-white" : "hover:bg-ink/5 text-ink-700",
        )}
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral-gradient text-white text-sm font-bold">
          {(profile.departureCity || "E").charAt(0).toUpperCase()}
        </span>
        <span className="hidden sm:flex flex-col items-start leading-tight">
          <span className={cn("text-[11px]", dark ? "text-white/60" : "text-ink-400")}>Your profile</span>
          <span className="text-sm font-semibold">{persona}</span>
        </span>
        <ChevronDown className="h-4 w-4 opacity-60" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-lift border border-ink/5 p-2 z-50 animate-fade-up">
          <div className="rounded-xl bg-ivory-100 p-3 mb-2">
            <p className="text-xs text-ink-400">Active profile</p>
            <p className="font-semibold text-ink-700">{persona}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {profile.activeVibeTags.slice(0, 4).map((t) => (
                <span key={t} className="rounded-full bg-white px-2 py-0.5 text-[11px] text-ink-500 border border-ink/5">
                  {t}
                </span>
              ))}
              {profile.activeVibeTags.length === 0 && (
                <span className="text-[11px] text-ink-400">No vibe set yet</span>
              )}
            </div>
          </div>
          <MenuItem icon={<Sparkles className="h-4 w-4" />} label="Adjust preferences" onClick={() => { setOpen(false); navigate("/profile-summary"); }} />
          <MenuItem icon={<Settings className="h-4 w-4" />} label="Settings & profile" onClick={() => { setOpen(false); navigate("/settings"); }} />
          <MenuItem icon={<Shield className="h-4 w-4" />} label="Trust & reports" onClick={() => { setOpen(false); navigate("/reports"); }} />
          <MenuItem
            icon={<RefreshCw className="h-4 w-4" />}
            label="Reset my vibe"
            onClick={() => {
              resetProfile();
              setOpen(false);
              showToast("Profile reset");
              navigate("/mood");
            }}
          />
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-ink-600 hover:bg-ivory-100 transition-colors"
    >
      <span className="text-coral-600">{icon}</span>
      {label}
    </button>
  );
}
