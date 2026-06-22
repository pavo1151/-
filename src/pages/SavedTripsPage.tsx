import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, GitCompareArrows, Building2, Trash2, Route as RouteIcon, RotateCw } from "lucide-react";
import { PageContainer, SectionTitle, Card, EmptyState } from "@/components/ui/primitives";
import { PrimaryButton } from "@/components/ui/buttons";
import { FitScoreBadge } from "@/components/score/FitScore";
import { DestinationThumb } from "@/components/destination/DestinationThumb";
import { useEurovibeStore } from "@/store/useEurovibeStore";
import { getDestinationById } from "@/lib/matching";
import { relativeTime } from "@/lib/format";

export default function SavedTripsPage() {
  const navigate = useNavigate();
  const savedTrips = useEurovibeStore((s) => s.savedTrips);
  const savedComparisons = useEurovibeStore((s) => s.savedComparisons);
  const savedSimulations = useEurovibeStore((s) => s.savedSimulations);
  const savedRoutes = useEurovibeStore((s) => s.savedRoutes);
  const removeTrip = useEurovibeStore((s) => s.removeTrip);
  const showToast = useEurovibeStore((s) => s.showToast);

  const statusTone: Record<string, string> = {
    "Ready to plan": "bg-emerald-50 text-emerald-700 border-emerald-100",
    "Compare again": "bg-amber-50 text-amber-700 border-amber-100",
    "Needs more checks": "bg-rose-50 text-rose-600 border-rose-100",
  };

  if (savedTrips.length === 0 && savedComparisons.length === 0 && savedRoutes.length === 0) {
    return (
      <PageContainer>
        <EmptyState
          glyph="🔖"
          title="No saved trips yet"
          body="When you save a destination, simulation, comparison or route, it lands here — ready to resume."
          action={<PrimaryButton onClick={() => navigate("/discover")}>Find your trip</PrimaryButton>}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="flex flex-col gap-7">
        <SectionTitle eyebrow="Saved" title="Your saved trips." subtitle="Decisions, simulations, comparisons and routes — all in one place." />

        {/* Saved trips */}
        {savedTrips.length > 0 && (
          <section className="space-y-3">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {savedTrips.map((trip, i) => {
                const d = getDestinationById(trip.destinationId);
                if (!d) return null;
                const hasSim = savedSimulations.some((s) => s.destinationId === trip.destinationId);
                return (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Card className="overflow-hidden">
                      <div className="relative h-28">
                        <DestinationThumb destination={d} night className="absolute inset-0" />
                        <div className="absolute inset-0 bg-gradient-to-t from-ink-900/70 to-transparent" />
                        <div className="absolute top-3 right-3"><FitScoreBadge value={trip.fitScore} dark /></div>
                        <div className="absolute bottom-2.5 left-4 text-white">
                          <h3 className="editorial-heading text-2xl leading-none">{d.city}</h3>
                          <p className="text-xs text-white/75">{trip.label}</p>
                        </div>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusTone[trip.status]}`}>
                            {trip.status}
                          </span>
                          <span className="text-xs text-ink-400">{relativeTime(trip.createdAt)}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          <Action icon={<RotateCw className="h-3.5 w-3.5" />} label="Resume" onClick={() => navigate(`/destination/${d.id}`)} />
                          <Action icon={<GitCompareArrows className="h-3.5 w-3.5" />} label="Compare" onClick={() => navigate("/compare")} />
                          {hasSim && <Action icon={<Play className="h-3.5 w-3.5" />} label="Simulation" onClick={() => navigate(`/destination/${d.id}/simulate`)} />}
                          <Action icon={<Building2 className="h-3.5 w-3.5" />} label="Portal" onClick={() => navigate(`/destination/${d.id}/portal`)} />
                          <Action
                            icon={<Trash2 className="h-3.5 w-3.5" />}
                            label="Remove"
                            danger
                            onClick={() => { removeTrip(trip.id); showToast("Removed from saved"); }}
                          />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* Saved comparisons */}
        {savedComparisons.length > 0 && (
          <section className="space-y-3">
            <h2 className="editorial-heading text-xl text-ink-700">Saved comparisons</h2>
            <div className="flex flex-wrap gap-3">
              {savedComparisons.map((c) => (
                <button
                  key={c.id}
                  onClick={() => navigate("/compare")}
                  className="rounded-2xl bg-white shadow-card border border-white/70 px-4 py-3 text-left hover:shadow-lift transition-all"
                >
                  <p className="text-xs text-ink-400">{relativeTime(c.createdAt)}</p>
                  <p className="font-semibold text-ink-700">
                    {c.destinationIds.map((id) => getDestinationById(id)?.city ?? id).join(" · ")}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Saved routes */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="editorial-heading text-xl text-ink-700">Routes</h2>
            <PrimaryButton onClick={() => navigate("/route")} icon={<RouteIcon className="h-4 w-4" />}>
              Build a route
            </PrimaryButton>
          </div>
          {savedRoutes.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {savedRoutes.map((r) => (
                <button
                  key={r.id}
                  onClick={() => navigate("/route")}
                  className="rounded-2xl bg-white shadow-card border border-white/70 px-4 py-3 text-left hover:shadow-lift transition-all"
                >
                  <p className="text-xs text-ink-400 capitalize">{r.mode.replace("-", " ")} route</p>
                  <p className="font-semibold text-ink-700">
                    {r.steps.map((s) => getDestinationById(s.destinationId)?.city ?? s.destinationId).join(" → ")}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-ink-400">No routes yet — turn your saved cities into a multi-stop trip.</p>
          )}
        </section>
      </div>
    </PageContainer>
  );
}

function Action({ icon, label, onClick, danger }: { icon: React.ReactNode; label: string; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium border transition-colors ${
        danger ? "text-rose-500 border-rose-100 hover:bg-rose-50" : "text-ink-600 border-ink/10 hover:bg-ivory-100"
      }`}
    >
      {icon} {label}
    </button>
  );
}
