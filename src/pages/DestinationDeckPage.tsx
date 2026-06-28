import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Layers, GitCompareArrows } from "lucide-react";
import { PageContainer, SectionTitle } from "@/components/ui/primitives";
import { PrimaryButton } from "@/components/ui/buttons";
import { VibeBar } from "@/components/vibe/VibeBar";
import { DestinationCard } from "@/components/destination/DestinationCard";
import { useEurovibeStore } from "@/store/useEurovibeStore";
import { scoreAll } from "@/lib/matching";
import { EXPERIENCE_WORLDS } from "@/data/experienceWorlds";
import { cn } from "@/lib/format";
import { Seo } from "@/components/seo/Seo";

type Sort = "fit" | "cheapest" | "nightlife" | "queer";

const SORTS: { id: Sort; label: string }[] = [
  { id: "fit", label: "Fit" },
  { id: "cheapest", label: "Cheapest" },
  { id: "nightlife", label: "Most Nightlife" },
  { id: "queer", label: "Most Queer-Friendly" },
];

export default function DestinationDeckPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const sort = (params.get("sort") as Sort) || "fit";
  const worldId = params.get("world");
  const weights = useEurovibeStore((s) => s.profile.preferenceWeights);
  const selected = useEurovibeStore((s) => s.profile.selectedDestinations);

  const world = worldId ? EXPERIENCE_WORLDS.find((w) => w.id === worldId) : null;

  const cards = useMemo(() => {
    let scored = scoreAll(weights);
    if (world) {
      scored = scored.filter((s) => world.destinationIds.includes(s.destination.id));
    }
    const sorted = [...scored].sort((a, b) => {
      switch (sort) {
        case "cheapest":
          return b.destination.costScore - a.destination.costScore;
        case "nightlife":
          return b.destination.nightlifeScore - a.destination.nightlifeScore;
        case "queer":
          return b.destination.queerScore - a.destination.queerScore;
        case "fit":
        default:
          return b.fitScore - a.fitScore;
      }
    });
    return sorted;
  }, [weights, sort, world]);

  const setSort = (s: Sort) => {
    const next = new URLSearchParams(params);
    next.set("sort", s);
    setParams(next, { replace: true });
  };

  return (
    <PageContainer>
      <Seo
        title="Destinations that fit your vibe"
        description="Handpicked European cities matched to your energy, style and budget — with fit scores, daily costs, nightlife, queer-friendliness and honest trade-offs."
        path="/discover"
      />
      <div className="flex flex-col gap-5">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <SectionTitle
            eyebrow={world ? `World · ${world.title}` : "Destination deck"}
            title="Destinations that fit your vibe."
            subtitle="Handpicked cities that match your energy, your style, and your budget."
          />
          <VibeBar onEdit={() => navigate("/profile-summary")} className="lg:max-w-md" />
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {SORTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className={cn(
                  "chip flex-none border",
                  sort === s.id ? "bg-ink-900 text-white border-ink-900" : "bg-white text-ink-600 border-ink/10 hover:border-ink/30",
                )}
              >
                {s.label}
              </button>
            ))}
            {world && (
              <button
                onClick={() => setParams({}, { replace: true })}
                className="chip flex-none border border-dashed border-coral-300 text-coral-600"
              >
                Clear world filter ✕
              </button>
            )}
          </div>
          <button className="hidden sm:inline-flex chip border bg-white text-ink-500 border-ink/10">
            <Layers className="h-3.5 w-3.5" /> More filters
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c, i) => (
            <DestinationCard key={c.destination.id} destination={c.destination} fitScore={c.fitScore} rank={i + 1} />
          ))}
        </div>

        {selected.length > 0 && (
          <div className="sticky bottom-24 md:bottom-6 flex justify-center">
            <PrimaryButton onClick={() => navigate("/compare")} icon={<GitCompareArrows className="h-4 w-4" />}>
              Compare selected ({selected.length})
            </PrimaryButton>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
