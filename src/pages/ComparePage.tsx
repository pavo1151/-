import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Bookmark, SlidersHorizontal, X, Info } from "lucide-react";
import { PageContainer, SectionTitle, Card, EmptyState } from "@/components/ui/primitives";
import { SecondaryButton, PrimaryButton } from "@/components/ui/buttons";
import { ScoreDots } from "@/components/score/Scores";
import { DestinationThumb } from "@/components/destination/DestinationThumb";
import { FitScoreBadge } from "@/components/score/FitScore";
import { useEurovibeStore } from "@/store/useEurovibeStore";
import { getDestinationById, calculateFitScore } from "@/lib/matching";
import type { Destination } from "@/types";
import { cn } from "@/lib/format";

const DEFAULT_IDS = ["sofia", "belgrade", "budapest"];

interface Metric {
  key: string;
  label: string;
  tooltip: string;
  value: (d: Destination, fit: number) => { score?: number; text?: string };
  color?: "coral" | "violet" | "emerald" | "sky" | "amber";
}

const METRICS: Metric[] = [
  { key: "fit", label: "Fit score", tooltip: "Overall match to your profile.", value: (_d, fit) => ({ score: fit / 10 }), color: "coral" },
  { key: "cost", label: "Cost (value)", tooltip: "Higher = better value / cheaper.", value: (d) => ({ score: d.costScore }), color: "amber" },
  { key: "nightlife", label: "Nightlife", tooltip: "Strength of bars, clubs and late energy.", value: (d) => ({ score: d.nightlifeScore }), color: "violet" },
  { key: "queer", label: "Queer scene", tooltip: "Visibility and welcome of the queer scene.", value: (d) => ({ score: d.queerScore }), color: "coral" },
  { key: "comfort", label: "Comfort", tooltip: "Ease, smoothness and predictability.", value: (d) => ({ score: d.comfortScore }), color: "sky" },
  { key: "safety", label: "Safety", tooltip: "General sense of safety.", value: (d) => ({ score: d.safetyScore }), color: "emerald" },
  { key: "novelty", label: "Different from Prague", tooltip: "How much it contrasts with Prague.", value: (d) => ({ score: d.differentFromPragueScore }), color: "emerald" },
  { key: "tourist", label: "Tourist density", tooltip: "Higher = more touristy.", value: (d) => ({ score: d.touristDensityScore }), color: "amber" },
  { key: "friction", label: "Friction", tooltip: "Higher = more effort / less smooth.", value: (d) => ({ score: d.frictionScore }), color: "coral" },
  { key: "sensory", label: "Sensory match", tooltip: "Atmosphere and sensory richness.", value: (d) => ({ score: d.sensoryScore }), color: "violet" },
  { key: "regret", label: "Regret risk", tooltip: "Risk you'd wish you'd chosen otherwise.", value: (d) => ({ text: d.regretRisk }) },
  { key: "confidence", label: "Confidence", tooltip: "How sure we are about this data.", value: (d) => ({ score: d.confidenceScore }), color: "sky" },
];

export default function ComparePage() {
  const navigate = useNavigate();
  const selected = useEurovibeStore((s) => s.profile.selectedDestinations);
  const toggleCompare = useEurovibeStore((s) => s.toggleCompare);
  const weights = useEurovibeStore((s) => s.profile.preferenceWeights);
  const saveComparison = useEurovibeStore((s) => s.saveComparison);
  const showToast = useEurovibeStore((s) => s.showToast);

  const ids = selected.length >= 2 ? selected : DEFAULT_IDS;
  const dests = useMemo(
    () => ids.map((id) => getDestinationById(id)).filter((d): d is Destination => Boolean(d)),
    [ids],
  );
  const fits = useMemo(
    () => Object.fromEntries(dests.map((d) => [d.id, calculateFitScore(weights, d)])),
    [dests, weights],
  );

  if (dests.length < 2) {
    return (
      <PageContainer>
        <EmptyState
          glyph="⚖️"
          title="Pick at least two cities to compare"
          body="Add destinations from the deck or map, then come back to weigh them side by side."
          action={<PrimaryButton onClick={() => navigate("/discover")}>Browse destinations</PrimaryButton>}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="max-w-6xl">
      <div className="flex flex-col gap-6">
        <SectionTitle
          eyebrow="Compare mode"
          title="Compare your best matches."
          subtitle="See the trade-offs side by side. The decision feels easier — not harder."
        />

        {/* Columns / swipeable on mobile */}
        <div className="overflow-x-auto no-scrollbar -mx-4 px-4">
          <div className="min-w-[640px]">
            {/* header row */}
            <div
              className="grid gap-3 mb-3"
              style={{ gridTemplateColumns: `160px repeat(${dests.length}, minmax(140px, 1fr))` }}
            >
              <div />
              {dests.map((d) => (
                <Card key={d.id} className="relative p-3 text-center">
                  {selected.length >= 2 && (
                    <button
                      onClick={() => toggleCompare(d.id)}
                      className="absolute top-2 right-2 text-ink-300 hover:text-rose-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <div className="relative mx-auto h-16 w-16 overflow-hidden rounded-2xl mb-2">
                    <DestinationThumb destination={d} className="absolute inset-0" />
                  </div>
                  <p className="font-editorial text-lg text-ink-700 leading-none">{d.city}</p>
                  <p className="text-xs text-ink-400 mb-2">{d.country}</p>
                  <FitScoreBadge value={fits[d.id]} />
                </Card>
              ))}
            </div>

            {/* metric rows */}
            <div className="rounded-3xl bg-white shadow-card border border-white/70 overflow-hidden">
              {METRICS.map((m, idx) => (
                <div
                  key={m.key}
                  className={cn("grid gap-3 items-center px-3 py-3", idx % 2 === 0 && "bg-ivory-100/40")}
                  style={{ gridTemplateColumns: `160px repeat(${dests.length}, minmax(140px, 1fr))` }}
                >
                  <div className="group relative flex items-center gap-1 text-sm font-medium text-ink-600 px-2">
                    {m.label}
                    <Info className="h-3 w-3 text-ink-300" />
                    <span className="pointer-events-none absolute left-0 top-full z-10 mt-1 w-48 rounded-xl bg-ink-900 px-3 py-2 text-xs text-white opacity-0 shadow-lift transition-opacity group-hover:opacity-100">
                      {m.tooltip}
                    </span>
                  </div>
                  {dests.map((d) => {
                    const v = m.value(d, fits[d.id]);
                    return (
                      <div key={d.id} className="flex justify-center px-1">
                        {v.score !== undefined ? (
                          <ScoreDots score={v.score} color={m.color} />
                        ) : (
                          <span
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-semibold",
                              v.text === "Low" ? "bg-emerald-50 text-emerald-700" :
                              v.text === "High" ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-700",
                            )}
                          >
                            {v.text}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendation strip */}
        <Card className="p-5">
          <h2 className="editorial-heading text-lg text-ink-700 mb-3">If your priority is…</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Reco emoji="💰" label="Budget" pick="Sofia" />
            <Reco emoji="🪩" label="Nightlife + energy" pick="Belgrade" />
            <Reco emoji="🛋️" label="Comfort + tourism" pick="Budapest" />
            <Reco emoji="🏛️" label="Classic beauty" pick="Prague" />
            <Reco emoji="🌊" label="Mediterranean contrast" pick="Athens" />
          </div>
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <SecondaryButton onClick={() => navigate("/profile-summary")} icon={<SlidersHorizontal className="h-4 w-4" />}>
            Adjust preferences
          </SecondaryButton>
          <div className="flex flex-wrap gap-3">
            <SecondaryButton
              onClick={() => navigate(`/destination/${dests[0].id}/simulate`)}
              icon={<Play className="h-4 w-4" />}
            >
              Simulate my trip
            </SecondaryButton>
            <PrimaryButton
              onClick={() => {
                saveComparison({ id: crypto.randomUUID(), destinationIds: dests.map((d) => d.id), createdAt: Date.now() });
                showToast("Comparison saved", "success");
              }}
              icon={<Bookmark className="h-4 w-4" />}
            >
              Save comparison
            </PrimaryButton>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

function Reco({ emoji, label, pick }: { emoji: string; label: string; pick: string }) {
  const navigate = useNavigate();
  const id = pick.toLowerCase();
  return (
    <button
      onClick={() => navigate(`/destination/${id}`)}
      className="flex items-center gap-3 rounded-2xl bg-ivory-100/60 border border-ink/5 p-3 text-left hover:bg-ivory-100 transition-colors"
    >
      <span className="text-2xl">{emoji}</span>
      <div>
        <p className="text-xs text-ink-400">{label}</p>
        <p className="font-semibold text-ink-700">{pick} →</p>
      </div>
    </button>
  );
}
