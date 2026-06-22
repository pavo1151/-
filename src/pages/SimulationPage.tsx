import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { GitCompareArrows, CheckCircle2, Bookmark, ChevronLeft, Route as RouteIcon } from "lucide-react";
import { PageContainer, SectionTitle, Card } from "@/components/ui/primitives";
import { PrimaryButton, SecondaryButton } from "@/components/ui/buttons";
import { VibeBar } from "@/components/vibe/VibeBar";
import { useEurovibeStore } from "@/store/useEurovibeStore";
import { getDestinationById } from "@/lib/matching";
import { getSimulationForDestination, simulationTitle, MODIFIERS } from "@/lib/simulation";
import { cn } from "@/lib/format";
import type { SimulationModifier } from "@/types";

export default function SimulationPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const d = id ? getDestinationById(id) : undefined;
  const selectedHotspots = useEurovibeStore((s) => s.profile.selectedHotspotsForSimulation);
  const saveSimulation = useEurovibeStore((s) => s.saveSimulation);
  const showToast = useEurovibeStore((s) => s.showToast);
  const [mods, setMods] = useState<SimulationModifier[]>([]);

  const sim = useMemo(
    () => (d ? getSimulationForDestination(d.id, selectedHotspots, mods) : null),
    [d, selectedHotspots, mods],
  );

  if (!d || !sim) {
    navigate("/discover");
    return null;
  }

  const toggleMod = (m: SimulationModifier) => {
    if (m === "add-second") {
      navigate("/route");
      return;
    }
    setMods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <button onClick={() => navigate(`/destination/${d.id}/portal`)} className="flex items-center gap-1 text-sm text-ink-500 hover:text-ink-700">
          <ChevronLeft className="h-4 w-4" /> Back to portal
        </button>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
          <SectionTitle
            eyebrow="Trip simulation"
            title={simulationTitle(d.id, sim.days.length)}
            subtitle="Based on your vibe, selected hotspots, and travel boundaries."
          />
          <VibeBar className="lg:max-w-md" />
        </div>

        {/* Modifier chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {MODIFIERS.map((m) => (
            <button
              key={m.id}
              onClick={() => toggleMod(m.id)}
              className={cn(
                "chip flex-none border",
                m.id === "add-second"
                  ? "bg-ink-900 text-white border-ink-900"
                  : mods.includes(m.id)
                    ? "bg-coral text-white border-coral shadow-glow"
                    : "bg-white text-ink-600 border-ink/10 hover:border-ink/30",
              )}
            >
              {m.id === "add-second" && <RouteIcon className="h-3.5 w-3.5" />}
              {m.label}
            </button>
          ))}
        </div>

        {/* Day cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {sim.days.map((day, i) => (
            <motion.div
              key={day.day}
              layout
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-5 h-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-coral-gradient text-white font-bold text-sm">
                    {day.day}
                  </span>
                  <h3 className="editorial-heading text-lg text-ink-700">{day.title}</h3>
                </div>
                <p className="text-sm text-ink-500">{day.body}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {day.tags.map((t) => (
                    <span key={t} className="rounded-full bg-ivory-100 px-2.5 py-0.5 text-xs font-medium text-ink-500 border border-ink/5">
                      {t}
                    </span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SecondaryButton onClick={() => navigate("/compare")} icon={<GitCompareArrows className="h-4 w-4" />}>
            Compare this destination
          </SecondaryButton>
          <div className="flex flex-wrap gap-3">
            <SecondaryButton
              onClick={() => {
                saveSimulation(sim);
                showToast("Simulation saved", "success");
              }}
              icon={<Bookmark className="h-4 w-4" />}
            >
              Save simulation
            </SecondaryButton>
            <PrimaryButton onClick={() => navigate(`/destination/${d.id}/decision`)} icon={<CheckCircle2 className="h-4 w-4" />}>
              Decision check
            </PrimaryButton>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
