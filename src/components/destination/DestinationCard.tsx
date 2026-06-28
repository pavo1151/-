import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, HeartCrack, GitCompareArrows, Play, Sparkles, Wallet, Moon, Compass } from "lucide-react";
import type { Destination } from "@/types";
import { cn, scoreLabel } from "@/lib/format";
import { ScoreChip } from "@/components/score/Scores";
import { FitScoreBadge } from "@/components/score/FitScore";
import { SaveButton } from "@/components/ui/buttons";
import { Modal } from "@/components/ui/overlays";
import { WhyYesBlock, WhyNotBlock } from "./WhyBlocks";
import { useEurovibeStore } from "@/store/useEurovibeStore";
import { DestinationThumb } from "./DestinationThumb";
import { useCostConverter } from "@/lib/liveData";

export function DestinationCard({
  destination,
  fitScore,
  rank,
}: {
  destination: Destination;
  fitScore: number;
  rank?: number;
}) {
  const navigate = useNavigate();
  const [why, setWhy] = useState<null | "yes" | "no">(null);
  const selectedDestinations = useEurovibeStore((s) => s.profile.selectedDestinations);
  const toggleCompare = useEurovibeStore((s) => s.toggleCompare);
  const savedTrips = useEurovibeStore((s) => s.savedTrips);
  const showToast = useEurovibeStore((s) => s.showToast);

  const inCompare = selectedDestinations.includes(destination.id);
  const isSaved = savedTrips.some((t) => t.destinationId === destination.id);
  const { convert } = useCostConverter();
  const cost = convert(destination.dailyCostNormal);

  const quickSave = () => {
    showToast(`${destination.city} added to comparison`, "default");
    toggleCompare(destination.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-3xl bg-white shadow-card border border-white/70 overflow-hidden hover:shadow-lift hover:-translate-y-1 transition-all"
    >
      <div
        className="relative h-40 cursor-pointer"
        onClick={() => navigate(`/destination/${destination.id}`)}
      >
        <DestinationThumb destination={destination} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/60 via-transparent to-transparent" />
        {rank && (
          <span className="absolute top-3 left-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-ink-700 text-sm font-bold shadow-card">
            {rank}
          </span>
        )}
        <div className="absolute top-3 right-3">
          <FitScoreBadge value={fitScore} dark />
        </div>
        <div className="absolute bottom-3 left-4 text-white">
          <h3 className="editorial-heading text-2xl leading-none">{destination.city}</h3>
          <p className="text-white/80 text-sm">{destination.country}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <p className="text-sm text-ink-500 line-clamp-2">{destination.shortVibe}</p>

        <div className="flex items-center justify-between text-sm">
          <span className="inline-flex items-center gap-1.5 text-ink-600 font-medium">
            <Wallet className="h-4 w-4 text-coral-600" />
            {cost.text}/day
            {cost.live && (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="Live exchange rate" />
            )}
          </span>
          <span className="text-xs text-ink-400">{scoreLabel(destination.costScore)} value</span>
        </div>

        <div className="grid grid-cols-4 gap-2 border-y border-ink/5 py-3">
          <ScoreChip label="Queer" score={destination.queerScore} icon={<Heart className="h-3 w-3" />} />
          <ScoreChip label="Nightlife" score={destination.nightlifeScore} icon={<Moon className="h-3 w-3" />} />
          <ScoreChip label="Different" score={destination.differentFromPragueScore} icon={<Compass className="h-3 w-3" />} />
          <ScoreChip label="Comfort" score={destination.comfortScore} icon={<Sparkles className="h-3 w-3" />} />
        </div>

        {/* actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setWhy("yes")}
            className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1.5 text-xs font-medium hover:bg-emerald-100"
          >
            <Heart className="h-3.5 w-3.5" /> Why yes
          </button>
          <button
            onClick={() => setWhy("no")}
            className="inline-flex items-center gap-1 rounded-full bg-rose-50 text-rose-600 px-3 py-1.5 text-xs font-medium hover:bg-rose-100"
          >
            <HeartCrack className="h-3.5 w-3.5" /> Why not
          </button>
          <button
            onClick={quickSave}
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium border",
              inCompare
                ? "bg-ink-900 text-white border-ink-900"
                : "bg-white text-ink-600 border-ink/10 hover:border-ink/30",
            )}
          >
            <GitCompareArrows className="h-3.5 w-3.5" /> {inCompare ? "In compare" : "Compare"}
          </button>
          <button
            onClick={() => navigate(`/destination/${destination.id}/simulate`)}
            className="inline-flex items-center gap-1 rounded-full bg-white text-ink-600 border border-ink/10 px-3 py-1.5 text-xs font-medium hover:border-ink/30"
          >
            <Play className="h-3.5 w-3.5" /> Simulate
          </button>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={() => navigate(`/destination/${destination.id}/atmosphere`)}
            className="flex-1 rounded-full bg-coral-gradient text-white py-2.5 text-sm font-semibold shadow-glow hover:-translate-y-0.5 transition-all"
          >
            Visit {destination.city}
          </button>
          <SaveButton
            saved={isSaved}
            onClick={() => navigate(`/destination/${destination.id}`)}
            compact
          />
        </div>
      </div>

      <Modal open={why !== null} onClose={() => setWhy(null)} title={`${destination.city} — ${why === "yes" ? "Why yes" : "Why maybe not"}`}>
        {why === "yes" ? <WhyYesBlock items={destination.whyYes} /> : <WhyNotBlock items={destination.whyNot} />}
      </Modal>
    </motion.div>
  );
}
