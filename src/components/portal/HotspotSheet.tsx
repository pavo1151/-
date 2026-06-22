import { useNavigate } from "react-router-dom";
import { Check, X, Plus, GitCompareArrows, Repeat, Map as MapIcon } from "lucide-react";
import type { Destination, PortalHotspot } from "@/types";
import { BottomSheet } from "@/components/ui/overlays";
import { useEurovibeStore } from "@/store/useEurovibeStore";
import { getOppositeDestinations } from "@/lib/matching";

const CATEGORY_GLYPH: Record<PortalHotspot["category"], string> = {
  streets: "🏙️",
  food: "🍽️",
  nightlife: "🪩",
  shops: "🛍️",
  "local-reality": "🧭",
  bars: "🍺",
  "best-buys": "🎁",
  "tourist-core": "📸",
  "safe-way-back": "🛡️",
};

export function HotspotSheet({
  destination,
  hotspot,
  open,
  onClose,
  onShowOnMap,
}: {
  destination: Destination;
  hotspot: PortalHotspot | null;
  open: boolean;
  onClose: () => void;
  onShowOnMap?: () => void;
}) {
  const navigate = useNavigate();
  const weights = useEurovibeStore((s) => s.profile.preferenceWeights);
  const simHotspots = useEurovibeStore((s) => s.profile.selectedHotspotsForSimulation);
  const toggleSim = useEurovibeStore((s) => s.toggleSimHotspot);
  const setCompare = useEurovibeStore((s) => s.setCompare);
  const showToast = useEurovibeStore((s) => s.showToast);

  if (!hotspot) return null;
  const inSim = simHotspots.includes(hotspot.id);
  const opposites = getOppositeDestinations(destination, weights, 3);

  return (
    <BottomSheet open={open} onClose={onClose}>
      <div className="space-y-5">
        <div className="flex items-start gap-3 pr-8">
          <span className="text-3xl">{CATEGORY_GLYPH[hotspot.category]}</span>
          <div>
            <h2 className="editorial-heading text-2xl text-white">{hotspot.title}</h2>
            <p className="text-white/70 mt-1">{hotspot.summary}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div className="rounded-2xl bg-emerald-400/10 border border-emerald-400/20 p-4">
            <p className="text-emerald-300 font-semibold text-sm mb-2">Good for</p>
            <ul className="space-y-1.5">
              {hotspot.goodFor.map((g) => (
                <li key={g} className="flex items-start gap-2 text-sm text-white/80">
                  <Check className="h-3.5 w-3.5 mt-0.5 flex-none text-emerald-300" /> {g}
                </li>
              ))}
            </ul>
          </div>
          {hotspot.maybeNotFor.length > 0 && (
            <div className="rounded-2xl bg-rose-400/10 border border-rose-400/20 p-4">
              <p className="text-rose-300 font-semibold text-sm mb-2">Maybe not for</p>
              <ul className="space-y-1.5">
                {hotspot.maybeNotFor.map((g) => (
                  <li key={g} className="flex items-start gap-2 text-sm text-white/80">
                    <X className="h-3.5 w-3.5 mt-0.5 flex-none text-rose-300" /> {g}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* subtopic cards */}
        <div className="grid sm:grid-cols-2 gap-3">
          {hotspot.subtopics.map((s) => (
            <div key={s.title} className="rounded-2xl bg-white/[0.06] border border-white/10 p-4">
              <p className="font-semibold text-white">{s.title}</p>
              <p className="text-sm text-white/65 mt-1">{s.body}</p>
            </div>
          ))}
        </div>

        {onShowOnMap && (
          <button
            onClick={onShowOnMap}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white/[0.06] border border-white/10 py-3 text-sm text-white/80 hover:bg-white/10"
          >
            <MapIcon className="h-4 w-4" /> Show this on the {destination.city} map
          </button>
        )}

        {/* actions */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              toggleSim(hotspot.id);
              showToast(inSim ? "Removed from simulation" : "Added to simulation", "success");
            }}
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold ${
              inSim ? "bg-emerald-400 text-ink-900" : "bg-coral-gradient text-white shadow-glow"
            }`}
          >
            <Plus className="h-4 w-4" /> {inSim ? "Added to simulation" : "Add to Simulation"}
          </button>
          {hotspot.related && hotspot.related.length > 0 && (
            <button
              onClick={() => {
                setCompare([destination.id, ...hotspot.related!].slice(0, 4));
                navigate("/compare");
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/20"
            >
              <GitCompareArrows className="h-4 w-4" /> Compare related
            </button>
          )}
          <button
            onClick={() => {
              setCompare([destination.id, ...opposites.map((o) => o.destination.id)].slice(0, 4));
              navigate("/compare");
            }}
            className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-4 py-2.5 text-sm font-medium text-white hover:bg-white/20"
          >
            <Repeat className="h-4 w-4" /> Find opposite
          </button>
        </div>
      </div>
    </BottomSheet>
  );
}
