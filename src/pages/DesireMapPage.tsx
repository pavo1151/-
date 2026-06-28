import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompareArrows, Sparkles, X } from "lucide-react";
import { PageContainer, SectionTitle, Card } from "@/components/ui/primitives";
import { PrimaryButton } from "@/components/ui/buttons";
import { VibeBar } from "@/components/vibe/VibeBar";
import { EuropeMapCanvas, MapMarker } from "@/components/map/EuropeMap";
import { FitScoreRing } from "@/components/score/FitScore";
import { DestinationThumb } from "@/components/destination/DestinationThumb";
import { useEurovibeStore } from "@/store/useEurovibeStore";
import { DESTINATIONS, EXTENDED_PINS } from "@/data/destinations";
import { rankByLayer, calculateFitScore, type MapLayer } from "@/lib/matching";
import { cn } from "@/lib/format";
import { Seo } from "@/components/seo/Seo";
import type { Destination } from "@/types";

const LAYERS: { id: MapLayer; label: string; glyph: string; hue: string }[] = [
  { id: "overall", label: "Overall Fit", glyph: "✨", hue: "rgba(246,136,91,0.6)" },
  { id: "cheap", label: "Cheap", glyph: "🪙", hue: "rgba(245,158,11,0.55)" },
  { id: "queer", label: "Queer", glyph: "🏳️‍🌈", hue: "rgba(217,70,160,0.5)" },
  { id: "nightlife", label: "Nightlife", glyph: "🪩", hue: "rgba(139,92,246,0.5)" },
  { id: "different", label: "Different from Prague", glyph: "🧭", hue: "rgba(16,185,129,0.5)" },
  { id: "comfort", label: "Comfort", glyph: "🛋️", hue: "rgba(59,130,246,0.45)" },
  { id: "adventure", label: "Adventure", glyph: "🎒", hue: "rgba(20,184,166,0.5)" },
  { id: "safety", label: "Safety", glyph: "🛡️", hue: "rgba(34,197,94,0.45)" },
];

export default function DesireMapPage() {
  const navigate = useNavigate();
  const [layer, setLayer] = useState<MapLayer>("overall");
  const [activeId, setActiveId] = useState<string | null>(null);
  const weights = useEurovibeStore((s) => s.profile.preferenceWeights);
  const selected = useEurovibeStore((s) => s.profile.selectedDestinations);
  const toggleCompare = useEurovibeStore((s) => s.toggleCompare);
  const showToast = useEurovibeStore((s) => s.showToast);

  const ranked = useMemo(() => rankByLayer(layer, weights), [layer, weights]);
  const scoreById = useMemo(
    () => Object.fromEntries(ranked.map((r) => [r.destination.id, r.fitScore])),
    [ranked],
  );
  const layerMeta = LAYERS.find((l) => l.id === layer)!;

  const heatZones = ranked.map((r) => ({
    x: r.destination.mapPosition.x,
    y: r.destination.mapPosition.y,
    intensity: r.fitScore / 100,
    hue: layerMeta.hue,
  }));

  const active = activeId ? DESTINATIONS.find((d) => d.id === activeId) : null;

  return (
    <PageContainer className="max-w-7xl">
      <Seo
        title="Your European desire map"
        description="See where your travel vibe fits strongest across Europe — an interactive desire map with fit layers for cost, queer-friendliness, nightlife, comfort, adventure and safety."
        path="/map"
      />
      <div className="flex flex-col gap-5">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <SectionTitle
            eyebrow="Desire map"
            title="Where your trip vibe fits best."
            subtitle="Explore the map to see where your travel vibe matches strongest — and why."
          />
          <VibeBar onEdit={() => navigate("/profile-summary")} className="lg:max-w-md" />
        </div>

        {/* Layer chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {LAYERS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLayer(l.id)}
              className={cn(
                "chip flex-none border",
                layer === l.id
                  ? "bg-ink-900 text-white border-ink-900 shadow-card"
                  : "bg-white text-ink-600 border-ink/10 hover:border-ink/30",
              )}
            >
              <span>{l.glyph}</span>
              {l.label}
            </button>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
          {/* Map */}
          <div className="relative">
            <EuropeMapCanvas heatZones={heatZones}>
              {DESTINATIONS.map((d) => (
                <MapMarker
                  key={d.id}
                  x={d.mapPosition.x}
                  y={d.mapPosition.y}
                  label={d.city}
                  score={scoreById[d.id]}
                  active={activeId === d.id}
                  rank={ranked.findIndex((r) => r.destination.id === d.id) + 1}
                  onClick={() => setActiveId(d.id === activeId ? null : d.id)}
                />
              ))}
              {EXTENDED_PINS.map((p) => (
                <MapMarker key={p.id} x={p.mapPosition.x} y={p.mapPosition.y} label={p.city} pinOnly />
              ))}
            </EuropeMapCanvas>

            {/* Preview popover */}
            <AnimatePresence>
              {active && (
                <PreviewPopover
                  destination={active}
                  fit={calculateFitScore(weights, active)}
                  inCompare={selected.includes(active.id)}
                  onClose={() => setActiveId(null)}
                  onOpen={() => navigate(`/destination/${active.id}`)}
                  onVisit={() => navigate(`/destination/${active.id}/atmosphere`)}
                  onCompare={() => {
                    toggleCompare(active.id);
                    showToast(`${active.city} ${selected.includes(active.id) ? "removed from" : "added to"} compare`);
                  }}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Top matches panel */}
          <Card className="p-4 self-start">
            <div className="flex items-center justify-between mb-3">
              <h2 className="editorial-heading text-lg text-ink-700 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-coral-500" /> Top matches
              </h2>
              <span className="text-xs text-ink-400">{layerMeta.label}</span>
            </div>
            <div className="space-y-2">
              {ranked.map((r, i) => (
                <button
                  key={r.destination.id}
                  onClick={() => navigate(`/destination/${r.destination.id}`)}
                  onMouseEnter={() => setActiveId(r.destination.id)}
                  className="flex w-full items-center gap-3 rounded-2xl p-2 text-left hover:bg-ivory-100 transition-colors"
                >
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-coral text-white text-xs font-bold">
                    {i + 1}
                  </span>
                  <div className="relative h-11 w-11 flex-none overflow-hidden rounded-xl">
                    <DestinationThumb destination={r.destination} className="absolute inset-0" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-ink-700 leading-tight">{r.destination.city}</p>
                    <p className="text-xs text-ink-400 truncate">{r.destination.shortVibe}</p>
                  </div>
                  <span className="font-editorial font-bold text-coral-600">{r.fitScore}%</span>
                </button>
              ))}
            </div>
            <PrimaryButton
              full
              className="mt-4"
              onClick={() => navigate("/compare")}
              icon={<GitCompareArrows className="h-4 w-4" />}
            >
              Compare matches{selected.length > 0 ? ` (${selected.length})` : ""}
            </PrimaryButton>
            <button
              onClick={() => navigate("/discover")}
              className="mt-2 w-full text-center text-sm font-medium text-ink-500 hover:text-coral-600"
            >
              Open destination deck →
            </button>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}

function PreviewPopover({
  destination,
  fit,
  inCompare,
  onClose,
  onOpen,
  onVisit,
  onCompare,
}: {
  destination: Destination;
  fit: number;
  inCompare: boolean;
  onClose: () => void;
  onOpen: () => void;
  onVisit: () => void;
  onCompare: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.97 }}
      className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 rounded-3xl bg-white/90 backdrop-blur-xl border border-white/70 shadow-lift p-4 z-10"
    >
      <button onClick={onClose} className="absolute top-3 right-3 text-ink-300 hover:text-ink-500">
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-center gap-3">
        <FitScoreRing value={fit} size={60} label={false} />
        <div>
          <h3 className="editorial-heading text-xl text-ink-700 leading-none">{destination.city}</h3>
          <p className="text-xs text-ink-400">{destination.country}</p>
        </div>
      </div>
      <p className="mt-3 text-sm text-ink-500">{destination.shortVibe}</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <button onClick={onOpen} className="rounded-xl bg-ink-900 text-white py-2 text-xs font-semibold hover:bg-ink-700">
          Open
        </button>
        <button onClick={onVisit} className="rounded-xl bg-coral-gradient text-white py-2 text-xs font-semibold">
          Visit
        </button>
        <button
          onClick={onCompare}
          className={cn(
            "rounded-xl py-2 text-xs font-semibold border",
            inCompare ? "bg-coral-50 text-coral-700 border-coral-200" : "bg-white text-ink-600 border-ink/10",
          )}
        >
          {inCompare ? "Added" : "Compare"}
        </button>
      </div>
    </motion.div>
  );
}
