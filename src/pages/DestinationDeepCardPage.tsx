import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Play, GitCompareArrows, ArrowRight, Wallet, Moon, Heart, Utensils, ShoppingBag,
  Compass, MapPin,
} from "lucide-react";
import { PageContainer, Card, EmptyState } from "@/components/ui/primitives";
import { PrimaryButton, SecondaryButton, BackButton, SaveButton } from "@/components/ui/buttons";
import { FitScoreRing } from "@/components/score/FitScore";
import { WhyYesBlock, WhyNotBlock } from "@/components/destination/WhyBlocks";
import { TrustBadge } from "@/components/destination/Trust";
import { DestinationThumb } from "@/components/destination/DestinationThumb";
import { useEurovibeStore } from "@/store/useEurovibeStore";
import { getDestinationById, calculateFitScore } from "@/lib/matching";
import { whyItFitsYou, statusForTrip, tripLabel } from "@/lib/decision";
import { cn } from "@/lib/format";

export default function DestinationDeepCardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const weights = useEurovibeStore((s) => s.profile.preferenceWeights);
  const toggleCompare = useEurovibeStore((s) => s.toggleCompare);
  const selected = useEurovibeStore((s) => s.profile.selectedDestinations);
  const saveTrip = useEurovibeStore((s) => s.saveTrip);
  const savedTrips = useEurovibeStore((s) => s.savedTrips);
  const showToast = useEurovibeStore((s) => s.showToast);

  const d = id ? getDestinationById(id) : undefined;
  if (!d) {
    return (
      <PageContainer>
        <EmptyState title="Destination not found" body="This city isn't in the deck yet." action={<PrimaryButton onClick={() => navigate("/discover")}>Back to deck</PrimaryButton>} />
      </PageContainer>
    );
  }

  const fit = calculateFitScore(weights, d);
  const isSaved = savedTrips.some((t) => t.destinationId === d.id);
  const inCompare = selected.includes(d.id);

  const handleSave = () => {
    saveTrip({
      id: crypto.randomUUID(),
      destinationId: d.id,
      label: tripLabel(d),
      fitScore: fit,
      status: statusForTrip(fit, d),
      createdAt: Date.now(),
    });
    showToast(`${d.city} saved to your trips`, "success");
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <BackButton onClick={() => navigate("/discover")} label="Back to results" />

        {/* Header */}
        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-3xl h-64 shadow-card"
          >
            <DestinationThumb destination={d} night className="absolute inset-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 via-ink-900/20 to-transparent" />
            <div className="absolute bottom-5 left-6 text-white">
              <p className="text-white/70 text-sm flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" /> {d.country} · {d.region}
              </p>
              <h1 className="editorial-heading text-5xl leading-none mt-1">{d.city}</h1>
              <p className="text-white/80 mt-2 max-w-md">{d.shortVibe}</p>
            </div>
          </motion.div>

          <Card className="p-5 flex flex-col">
            <div className="flex items-center gap-4">
              <FitScoreRing value={fit} size={92} />
              <div>
                <p className="text-sm text-ink-400">Your fit for {d.city}</p>
                <p className="font-editorial text-xl text-ink-700">{whyItFitsYou(weights, d).split(",")[0]}</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-ink-500">{whyItFitsYou(weights, d)}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {d.atmosphereTags.map((t) => (
                <span key={t} className="rounded-full bg-ivory-100 px-3 py-1 text-xs font-medium text-ink-500 border border-ink/5">
                  {t}
                </span>
              ))}
            </div>
            <div className="mt-auto pt-4">
              <TrustBadge destination={d} />
            </div>
          </Card>
        </div>

        {/* Why blocks */}
        <div className="grid gap-5 md:grid-cols-2">
          <Card className="p-5">
            <h2 className="editorial-heading text-xl text-emerald-700 mb-3">Why yes</h2>
            <WhyYesBlock items={d.whyYes} />
          </Card>
          <Card className="p-5">
            <h2 className="editorial-heading text-xl text-rose-600 mb-3">Why maybe not</h2>
            <WhyNotBlock items={d.whyNot} />
          </Card>
        </div>

        {/* Reality sections */}
        <div className="grid gap-4 md:grid-cols-2">
          <Reality icon={<Wallet className="h-4 w-4" />} title="Budget reality" body={d.budgetReality} extra={`${d.dailyCostBudget} budget · ${d.dailyCostNormal} normal · ${d.dailyCostComfort} comfort`} />
          <Reality icon={<Moon className="h-4 w-4" />} title="Nightlife reality" body={d.nightlifeSummary} />
          <Reality icon={<Heart className="h-4 w-4" />} title="Queer reality" body={d.queerSummary} />
          <Reality icon={<Utensils className="h-4 w-4" />} title="Food reality" body={d.foodSummary} />
          <Reality icon={<ShoppingBag className="h-4 w-4" />} title="Shopping reality" body={d.shoppingSummary} />
          <Reality icon={<Compass className="h-4 w-4" />} title="Different from Prague" body={d.pragueDifferenceText} />
        </div>

        <Card className="p-5 bg-ivory-100/60">
          <h2 className="editorial-heading text-lg text-ink-700 mb-2">Local reality</h2>
          <p className="text-ink-500">{d.localReality}</p>
        </Card>

        {/* CTA bar */}
        <div className="sticky bottom-24 md:bottom-6 z-20">
          <div className="rounded-full bg-white/90 backdrop-blur-xl border border-white/70 shadow-lift p-2 flex flex-wrap items-center gap-2 justify-center">
            <PrimaryButton onClick={() => navigate(`/destination/${d.id}/atmosphere`)} icon={<ArrowRight className="h-4 w-4" />}>
              Visit destination
            </PrimaryButton>
            <SecondaryButton onClick={() => navigate(`/destination/${d.id}/simulate`)} icon={<Play className="h-4 w-4" />}>
              Simulate
            </SecondaryButton>
            <button
              onClick={() => { toggleCompare(d.id); showToast(`${d.city} ${inCompare ? "removed from" : "added to"} compare`); }}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-5 py-3 text-[15px] font-semibold border",
                inCompare ? "bg-coral-50 text-coral-700 border-coral-200" : "bg-white text-ink-600 border-ink/10",
              )}
            >
              <GitCompareArrows className="h-4 w-4" /> {inCompare ? "In compare" : "Compare"}
            </button>
            <SaveButton saved={isSaved} onClick={handleSave} />
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

function Reality({ icon, title, body, extra }: { icon: React.ReactNode; title: string; body: string; extra?: string }) {
  return (
    <Card className="p-5">
      <h3 className="inline-flex items-center gap-2 font-semibold text-ink-700">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-coral-50 text-coral-600">{icon}</span>
        {title}
      </h3>
      <p className="mt-2 text-sm text-ink-500">{body}</p>
      {extra && <p className="mt-2 text-xs font-medium text-coral-600">{extra}</p>}
    </Card>
  );
}
