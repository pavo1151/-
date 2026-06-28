import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { User, Play, GitCompareArrows, Bookmark, LogOut } from "lucide-react";
import { Wordmark } from "@/components/shell/Wordmark";
import { CityStreetScene, CityMapScene } from "@/components/portal/Scenes";
import { FitScoreRing } from "@/components/score/FitScore";
import {
  DayNightToggle, StreetMapToggle, SoundscapeToggle, LensSelector,
} from "@/components/portal/PortalControls";
import { HotspotSheet } from "@/components/portal/HotspotSheet";
import { useEurovibeStore } from "@/store/useEurovibeStore";
import { getDestinationById, calculateFitScore, lensHotspotIds } from "@/lib/matching";
import { statusForTrip, tripLabel } from "@/lib/decision";
import { cn } from "@/lib/format";
import type { DayNight, PortalHotspot } from "@/types";

const CATEGORY_GLYPH: Record<PortalHotspot["category"], string> = {
  streets: "🏙️", food: "🍽️", nightlife: "🪩", shops: "🛍️", "local-reality": "🧭",
  bars: "🍺", "best-buys": "🎁", "tourist-core": "📸", "safe-way-back": "🛡️",
};

export default function PortalPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const d = id ? getDestinationById(id) : undefined;

  const weights = useEurovibeStore((s) => s.profile.preferenceWeights);
  const lens = useEurovibeStore((s) => s.profile.selectedLens);
  const setLens = useEurovibeStore((s) => s.setLens);
  const soundscape = useEurovibeStore((s) => s.profile.soundscapePreference);
  const setSoundscape = useEurovibeStore((s) => s.setSoundscape);
  const portalMode = useEurovibeStore((s) => s.profile.selectedPortalMode);
  const setPortalMode = useEurovibeStore((s) => s.setPortalMode);
  const saveTrip = useEurovibeStore((s) => s.saveTrip);
  const showToast = useEurovibeStore((s) => s.showToast);

  const [mode, setMode] = useState<DayNight>("night");
  const [openHotspot, setOpenHotspot] = useState<PortalHotspot | null>(null);

  const highlighted = useMemo(() => (d ? lensHotspotIds(d, lens) : []), [d, lens]);

  if (!d) {
    navigate("/discover");
    return null;
  }
  const fit = calculateFitScore(weights, d);

  // Day/Night emphasis: which hotspots glow brighter
  const isEmphasized = (h: PortalHotspot) =>
    (h.emphasis === mode || h.emphasis === "both") && highlighted.includes(h.id);

  const handleSave = () => {
    saveTrip({
      id: crypto.randomUUID(),
      destinationId: d.id,
      label: tripLabel(d),
      fitScore: fit,
      status: statusForTrip(fit, d),
      createdAt: Date.now(),
    });
    showToast(`${d.city} saved`, "success");
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-night-950 text-white">
      {/* Background scene */}
      <AnimatePresence mode="wait">
        <motion.div
          key={portalMode + mode}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          {portalMode === "street" ? (
            <CityStreetScene destination={d} mode={mode} />
          ) : (
            <CityMapScene destination={d} mode={mode} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Header */}
      <div className="relative z-20 flex flex-wrap items-start justify-between gap-3 px-4 sm:px-6 py-4">
        <div className="flex items-center gap-3">
          <Wordmark dark />
          <div className="hidden sm:block h-8 w-px bg-white/15" />
          <div className="hidden sm:block">
            <p className="text-xs text-white/50">Destination Portal</p>
            <p className="font-editorial text-lg leading-none">{d.city}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <DayNightToggle value={mode} onChange={setMode} />
          <StreetMapToggle value={portalMode} onChange={setPortalMode} />
          <SoundscapeToggle value={soundscape} onChange={setSoundscape} />
          <LensSelector value={lens} onChange={setLens} />
        </div>
      </div>

      {/* Fit + tags (left rail) */}
      <div className="relative z-20 px-4 sm:px-6 flex items-center gap-4">
        <div className="rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/10 p-2.5 flex items-center gap-3">
          <FitScoreRing value={fit} size={56} dark label={false} />
          <div className="pr-2">
            <p className="text-[11px] text-white/55">Your fit</p>
            <p className="font-semibold leading-none">{fit}% match</p>
          </div>
        </div>
        <div className="hidden md:flex flex-wrap gap-1.5">
          {d.atmosphereTags.slice(0, 4).map((t) => (
            <span key={t} className="rounded-full bg-white/10 border border-white/15 px-3 py-1 text-xs backdrop-blur-md">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Hotspots */}
      <div className="absolute inset-0 z-10">
        {d.portalHotspots.map((h) => {
          const pos = portalMode === "street" ? h.street : h.map;
          const emphasized = isEmphasized(h);
          const dimmed = highlighted.length > 0 && !highlighted.includes(h.id);
          return (
            <button
              key={h.id}
              onClick={() => setOpenHotspot(h)}
              aria-label={`${h.title} — open details`}
              className={cn(
                "absolute -translate-x-1/2 -translate-y-1/2 group transition-all",
                dimmed ? "opacity-40" : "opacity-100",
              )}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium border backdrop-blur-md transition-all whitespace-nowrap",
                  emphasized
                    ? "bg-coral text-white border-coral shadow-glow scale-105"
                    : "bg-night-900/70 text-white border-white/20 group-hover:bg-night-800",
                )}
              >
                <span>{CATEGORY_GLYPH[h.category]}</span>
                {h.title.replace(`${d.city} `, "").replace("in " + d.city, "")}
              </span>
              {emphasized && (
                <span className="absolute -inset-1 rounded-full bg-coral/30 blur-md animate-glow-pulse -z-10" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom action bar */}
      <div className="absolute bottom-0 inset-x-0 z-20 px-4 sm:px-6 pb-5 pt-10 bg-gradient-to-t from-night-950 to-transparent">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white/[0.07] backdrop-blur-xl border border-white/12 p-2 flex items-center justify-between gap-1">
          <PortalAction icon={<User className="h-5 w-5" />} label="Profile" onClick={() => navigate(`/destination/${d.id}`)} />
          <PortalAction icon={<Play className="h-5 w-5" />} label="Simulate" onClick={() => navigate(`/destination/${d.id}/simulate`)} />
          <PortalAction icon={<GitCompareArrows className="h-5 w-5" />} label="Compare" onClick={() => navigate("/compare")} />
          <PortalAction icon={<Bookmark className="h-5 w-5" />} label="Save" onClick={handleSave} />
          <PortalAction icon={<LogOut className="h-5 w-5" />} label="Exit" onClick={() => navigate(`/destination/${d.id}`)} accent />
        </div>
      </div>

      <HotspotSheet
        destination={d}
        hotspot={openHotspot}
        open={openHotspot !== null}
        onClose={() => setOpenHotspot(null)}
        onShowOnMap={
          portalMode === "street"
            ? () => { setPortalMode("map"); setOpenHotspot(null); }
            : undefined
        }
      />
    </div>
  );
}

function PortalAction({
  icon, label, onClick, accent,
}: { icon: React.ReactNode; label: string; onClick: () => void; accent?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 flex-col items-center gap-1 rounded-2xl py-2.5 text-xs font-medium transition-all",
        accent ? "text-coral-300 hover:bg-white/10" : "text-white/80 hover:bg-white/10",
      )}
    >
      {icon}
      {label}
    </button>
  );
}
