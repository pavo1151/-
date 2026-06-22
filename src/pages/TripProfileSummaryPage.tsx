import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Map as MapIcon, SlidersHorizontal, ArrowRight } from "lucide-react";
import { PageContainer, SectionTitle, Card } from "@/components/ui/primitives";
import { PrimaryButton, SecondaryButton } from "@/components/ui/buttons";
import { VibeBar } from "@/components/vibe/VibeBar";
import { useEurovibeStore } from "@/store/useEurovibeStore";
import { generateProfileSummary } from "@/lib/decision";
import { priorityIndicators } from "@/lib/profile";
import { cn } from "@/lib/format";

export default function TripProfileSummaryPage() {
  const navigate = useNavigate();
  const weights = useEurovibeStore((s) => s.profile.preferenceWeights);
  const summary = generateProfileSummary(weights);
  const priorities = priorityIndicators(weights);

  const levelTone = (level: string) =>
    level === "High"
      ? "bg-emerald-50 text-emerald-700 border-emerald-100"
      : level === "Medium"
        ? "bg-amber-50 text-amber-700 border-amber-100"
        : "bg-ink-700/5 text-ink-400 border-ink/10";

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <SectionTitle eyebrow="Trip profile" title="Your trip vibe is taking shape." />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-gradient-to-br from-ink-900 to-ink-700 p-7 text-white shadow-lift relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-coral/30 blur-3xl" />
          <p className="text-sm uppercase tracking-[0.18em] text-white/50 mb-3">What we understood</p>
          <p className="font-editorial text-2xl sm:text-3xl leading-snug text-balance relative">
            {summary}
          </p>
        </motion.div>

        <Card className="p-5">
          <VibeBar onEdit={() => navigate("/mood")} />
        </Card>

        <div>
          <h2 className="editorial-heading text-xl text-ink-700 mb-3">Your priorities</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {priorities.map((p) => (
              <button
                key={p.key}
                onClick={() => navigate("/boundaries")}
                className="rounded-2xl bg-white shadow-card border border-white/70 p-4 text-left hover:shadow-lift hover:-translate-y-0.5 transition-all"
              >
                <p className="text-sm text-ink-500">{p.label}</p>
                <span className={cn("mt-2 inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold", levelTone(p.level))}>
                  {p.level}
                </span>
              </button>
            ))}
          </div>
        </div>

        <Card className="p-5 bg-ivory-100/60">
          <p className="text-sm text-ink-500">
            <span className="font-semibold text-ink-700">How fit works:</span> we weight each destination's
            cost, nightlife, queer scene, safety, comfort, sensory atmosphere and how different it feels
            from Prague against your priorities — then subtract friction and tourist density you'd rather avoid.
          </p>
        </Card>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <SecondaryButton onClick={() => navigate("/mood")} icon={<SlidersHorizontal className="h-4 w-4" />}>
            Adjust preferences
          </SecondaryButton>
          <div className="flex gap-3">
            <SecondaryButton onClick={() => navigate("/discover")} icon={<ArrowRight className="h-4 w-4" />}>
              Skip to destinations
            </SecondaryButton>
            <PrimaryButton onClick={() => navigate("/map")} icon={<MapIcon className="h-4 w-4" />}>
              Show my map
            </PrimaryButton>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
