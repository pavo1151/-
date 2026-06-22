import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, Map as MapIcon, ArrowRight, Compass, Building2, Play, Scale } from "lucide-react";
import { PrimaryButton, SecondaryButton } from "@/components/ui/buttons";
import { FitScoreRing } from "@/components/score/FitScore";
import { DestinationThumb } from "@/components/destination/DestinationThumb";
import { useEurovibeStore } from "@/store/useEurovibeStore";
import { topMatch } from "@/lib/matching";
import { fitLabel } from "@/lib/format";
import { calculateFitScore } from "@/lib/matching";

const FEATURES = [
  { icon: Sparkles, label: "Mood-based matching" },
  { icon: Building2, label: "Destination portals" },
  { icon: Play, label: "Trip simulation" },
  { icon: Scale, label: "Honest trade-offs" },
];

export default function WelcomePage() {
  const navigate = useNavigate();
  const weights = useEurovibeStore((s) => s.profile.preferenceWeights);
  const surpriseMe = useEurovibeStore((s) => s.surpriseMe);
  const recommended = topMatch(weights);
  const fit = calculateFitScore(weights, recommended);

  return (
    <div className="relative overflow-hidden">
      {/* cinematic hero backdrop */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-peach-100 via-ivory to-sky-100" />
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-coral/20 blur-3xl" />
        <div className="absolute top-40 -left-24 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 py-12 lg:py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold text-coral-600 border border-white/60 shadow-card">
            <Sparkles className="h-3.5 w-3.5" /> A smarter way to choose where Europe fits you
          </span>
          <h1 className="editorial-heading text-4xl sm:text-5xl lg:text-6xl leading-[1.05] text-balance">
            Find the trip that fits <span className="text-coral-600">how you want to feel.</span>
          </h1>
          <p className="text-lg text-ink-400 max-w-xl">
            Not another travel list. Eurovibe turns a feeling into a personal trip profile — then helps
            you discover, enter, simulate and compare European destinations before you go.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <PrimaryButton onClick={() => navigate("/mood")} icon={<Sparkles className="h-4 w-4" />}>
              Start with my vibe
            </PrimaryButton>
            <SecondaryButton onClick={() => navigate("/map")} icon={<MapIcon className="h-4 w-4" />}>
              Explore the map
            </SecondaryButton>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {FEATURES.map((f) => (
              <span
                key={f.label}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-sm text-ink-500 border border-white/60"
              >
                <f.icon className="h-3.5 w-3.5 text-coral-500" />
                {f.label}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Floating recommended preview card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="relative"
        >
          <div className="relative mx-auto max-w-sm rounded-4xl bg-white/80 backdrop-blur-xl border border-white/70 shadow-lift p-3">
            <div className="relative h-48 rounded-3xl overflow-hidden">
              <DestinationThumb destination={recommended} night className="absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 to-transparent" />
              <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-coral-700">
                ❤ {fitLabel(fit)}
              </span>
              <div className="absolute bottom-3 left-4 text-white">
                <p className="text-xs text-white/70">Recommended for your default vibe</p>
                <h3 className="editorial-heading text-3xl leading-none">{recommended.city}</h3>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4">
              <FitScoreRing value={fit} size={72} />
              <div className="flex-1">
                <p className="text-sm text-ink-500 line-clamp-2">{recommended.shortVibe}</p>
                <button
                  onClick={() => navigate(`/destination/${recommended.id}`)}
                  className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-coral-600 hover:gap-2 transition-all"
                >
                  Open profile <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              surpriseMe();
              navigate("/profile-summary");
            }}
            className="mt-4 mx-auto flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-medium text-ink-500 border border-white/60 hover:bg-white"
          >
            <Compass className="h-4 w-4 text-coral-500" /> Or let us surprise you
          </button>
        </motion.div>
      </div>
    </div>
  );
}
