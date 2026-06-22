import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, X, Heart, AlertTriangle, Repeat, GitCompareArrows, Bookmark, ThumbsUp } from "lucide-react";
import { PageContainer, SectionTitle, Card, EmptyState } from "@/components/ui/primitives";
import { PrimaryButton, SecondaryButton } from "@/components/ui/buttons";
import { useEurovibeStore } from "@/store/useEurovibeStore";
import { getDestinationById, calculateFitScore, getOppositeDestinations } from "@/lib/matching";
import { statusForTrip, tripLabel } from "@/lib/decision";

export default function DecisionCheckPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const d = id ? getDestinationById(id) : undefined;
  const weights = useEurovibeStore((s) => s.profile.preferenceWeights);
  const saveTrip = useEurovibeStore((s) => s.saveTrip);
  const setCompare = useEurovibeStore((s) => s.setCompare);
  const showToast = useEurovibeStore((s) => s.showToast);

  if (!d) {
    return (
      <PageContainer>
        <EmptyState title="Nothing to decide yet" action={<PrimaryButton onClick={() => navigate("/discover")}>Browse destinations</PrimaryButton>} />
      </PageContainer>
    );
  }

  const fit = calculateFitScore(weights, d);
  const ds = d.decisionSummary;
  const opposites = getOppositeDestinations(d, weights, 3);

  const commit = () => {
    saveTrip({
      id: crypto.randomUUID(),
      destinationId: d.id,
      label: tripLabel(d),
      fitScore: fit,
      status: statusForTrip(fit, d),
      createdAt: Date.now(),
      decisionSnapshot: ds,
    });
    showToast(`${d.city} locked in — saved to your trips`, "success");
    navigate("/saved");
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <SectionTitle
          eyebrow="Decision check"
          title={`Is ${d.city} the one?`}
          subtitle="An honest look at the trade — so you can choose without second-guessing."
        />

        <div className="grid gap-4 md:grid-cols-2">
          <DecisionBlock
            tone="gain"
            icon={<Check className="h-4 w-4" />}
            title="You gain"
            items={ds.youGain}
          />
          <DecisionBlock
            tone="give"
            icon={<X className="h-4 w-4" />}
            title="You give up"
            items={ds.youGiveUp}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-5 border-l-4 border-l-emerald-400">
            <h3 className="inline-flex items-center gap-2 font-semibold text-emerald-700">
              <Heart className="h-4 w-4" /> You may love it if
            </h3>
            <p className="mt-2 text-ink-600">{ds.loveItIf}</p>
          </Card>
          <Card className="p-5 border-l-4 border-l-amber-400">
            <h3 className="inline-flex items-center gap-2 font-semibold text-amber-700">
              <AlertTriangle className="h-4 w-4" /> You may be disappointed if
            </h3>
            <p className="mt-2 text-ink-600">{ds.disappointedIf}</p>
          </Card>
        </div>

        {/* Alternatives + regret */}
        <Card className="p-5">
          <h3 className="editorial-heading text-lg text-ink-700 mb-3">Alternatives checked</h3>
          <div className="flex flex-wrap gap-2">
            {ds.alternatives.map((a) => {
              const alt = getDestinationById(a.id);
              return (
                <button
                  key={a.id}
                  onClick={() => navigate(`/destination/${a.id}`)}
                  className="inline-flex items-center gap-2 rounded-2xl bg-ivory-100 border border-ink/5 px-4 py-2 hover:bg-ivory-200 transition-colors"
                >
                  <span className="font-semibold text-ink-700">{alt?.city ?? a.id}</span>
                  <span className="text-xs text-ink-400">· {a.reason}</span>
                </button>
              );
            })}
          </div>
        </Card>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-3xl bg-gradient-to-br from-ink-900 to-ink-700 p-6 text-white relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-coral/30 blur-3xl" />
          <p className="text-sm uppercase tracking-wide text-white/50 mb-1">Regret forecast</p>
          <p className="font-editorial text-xl leading-snug relative">{ds.regretForecast}</p>
        </motion.div>

        {/* Decision actions */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <PrimaryButton onClick={commit} icon={<ThumbsUp className="h-4 w-4" />} full>
            This fits me
          </PrimaryButton>
          <SecondaryButton onClick={() => navigate("/compare")} icon={<GitCompareArrows className="h-4 w-4" />} full>
            Compare again
          </SecondaryButton>
          <SecondaryButton onClick={() => navigate("/discover?sort=cheapest")} full>
            Find something less touristy
          </SecondaryButton>
          <SecondaryButton
            onClick={() => {
              setCompare([d.id, ...opposites.map((o) => o.destination.id)].slice(0, 4));
              navigate("/compare");
            }}
            icon={<Repeat className="h-4 w-4" />}
            full
          >
            Find the opposite
          </SecondaryButton>
          <SecondaryButton onClick={commit} icon={<Bookmark className="h-4 w-4" />} full>
            Save for later
          </SecondaryButton>
        </div>
      </div>
    </PageContainer>
  );
}

function DecisionBlock({
  tone, icon, title, items,
}: { tone: "gain" | "give"; icon: React.ReactNode; title: string; items: string[] }) {
  const gain = tone === "gain";
  return (
    <Card className="p-5">
      <h3 className={`inline-flex items-center gap-2 font-semibold ${gain ? "text-emerald-700" : "text-rose-600"}`}>
        <span className={`flex h-7 w-7 items-center justify-center rounded-full ${gain ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600"}`}>
          {icon}
        </span>
        {title}
      </h3>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-ink-600">
            <span className={`mt-1.5 h-1.5 w-1.5 flex-none rounded-full ${gain ? "bg-emerald-400" : "bg-rose-400"}`} />
            {item}
          </li>
        ))}
      </ul>
    </Card>
  );
}
