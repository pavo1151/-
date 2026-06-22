import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bookmark, ArrowDown, Wallet, Plane, Sparkles } from "lucide-react";
import { PageContainer, SectionTitle, Card, EmptyState } from "@/components/ui/primitives";
import { PrimaryButton, SecondaryButton } from "@/components/ui/buttons";
import { DestinationThumb } from "@/components/destination/DestinationThumb";
import { useEurovibeStore } from "@/store/useEurovibeStore";
import { generateRoutePreview, ROUTE_MODES } from "@/lib/route";
import { getDestinationById } from "@/lib/matching";
import { cn } from "@/lib/format";
import type { RouteMode } from "@/types";

export default function RouteBuilderPage() {
  const navigate = useNavigate();
  const savedTrips = useEurovibeStore((s) => s.savedTrips);
  const selected = useEurovibeStore((s) => s.profile.selectedDestinations);
  const saveRoute = useEurovibeStore((s) => s.saveRoute);
  const showToast = useEurovibeStore((s) => s.showToast);
  const [mode, setMode] = useState<RouteMode>("balanced");

  // Source destinations: saved trips first, else compare selection, else a sensible default.
  const sourceIds = useMemo(() => {
    const fromSaved = savedTrips.map((t) => t.destinationId);
    const ids = fromSaved.length >= 2 ? fromSaved : selected.length >= 2 ? selected : ["belgrade", "budapest", "sofia"];
    return [...new Set(ids)];
  }, [savedTrips, selected]);

  const route = useMemo(() => generateRoutePreview(sourceIds, mode), [sourceIds, mode]);

  if (sourceIds.length < 2) {
    return (
      <PageContainer>
        <EmptyState
          glyph="🗺️"
          title="Add a few cities first"
          body="Save or compare at least two destinations and we'll sketch a route between them."
          action={<PrimaryButton onClick={() => navigate("/discover")}>Browse destinations</PrimaryButton>}
        />
      </PageContainer>
    );
  }

  const totalDays = route.steps.reduce((a, s) => a + s.days, 0);

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <SectionTitle
          eyebrow="Route builder"
          title="Turn saved cities into a route."
          subtitle={`A ${totalDays}-day shape across ${route.steps.length} cities — direction, not a rigid plan.`}
        />

        {/* Mode chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {ROUTE_MODES.map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                "chip flex-none border",
                mode === m.id ? "bg-ink-900 text-white border-ink-900" : "bg-white text-ink-600 border-ink/10 hover:border-ink/30",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Steps */}
        <div className="space-y-1">
          {route.steps.map((step, i) => {
            const d = getDestinationById(step.destinationId);
            if (!d) return null;
            return (
              <div key={step.destinationId}>
                <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                  <Card className="p-4 flex flex-col sm:flex-row gap-4">
                    <div className="relative h-24 sm:h-auto sm:w-32 flex-none overflow-hidden rounded-2xl">
                      <DestinationThumb destination={d} night className="absolute inset-0" />
                      <span className="absolute top-2 left-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 font-bold text-ink-700 text-sm">
                        {i + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="editorial-heading text-xl text-ink-700">{d.city}</h3>
                        <span className="rounded-full bg-coral-50 text-coral-700 px-3 py-1 text-sm font-semibold">{step.days} days</span>
                      </div>
                      <p className="text-sm text-ink-500 mt-1">{step.vibe}</p>
                      <div className="mt-3 grid gap-2 sm:grid-cols-2">
                        <Info icon={<Sparkles className="h-3.5 w-3.5" />} label="Why it belongs" text={step.reason} />
                        <Info icon={<Wallet className="h-3.5 w-3.5" />} label="Daily cost" text={step.cost} />
                        <Info icon={<Plane className="h-3.5 w-3.5" />} label="Transfer" text={step.transferFriction} />
                        <Info icon={<ArrowDown className="h-3.5 w-3.5" />} label="Movement" text={step.movementNote} />
                      </div>
                    </div>
                  </Card>
                </motion.div>
                {i < route.steps.length - 1 && (
                  <div className="flex justify-center py-1">
                    <ArrowDown className="h-5 w-5 text-ink-300" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <SecondaryButton onClick={() => navigate("/saved")}>Back to saved</SecondaryButton>
          <PrimaryButton
            onClick={() => {
              saveRoute(route);
              showToast("Route saved", "success");
              navigate("/saved");
            }}
            icon={<Bookmark className="h-4 w-4" />}
          >
            Save this route
          </PrimaryButton>
        </div>
      </div>
    </PageContainer>
  );
}

function Info({ icon, label, text }: { icon: React.ReactNode; label: string; text: string }) {
  return (
    <div className="rounded-2xl bg-ivory-100/60 border border-ink/5 px-3 py-2">
      <p className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-ink-400">
        <span className="text-coral-500">{icon}</span> {label}
      </p>
      <p className="text-sm text-ink-600">{text}</p>
    </div>
  );
}
