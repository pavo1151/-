import { useMemo, useState } from "react";
import { Database, Sliders, RotateCcw } from "lucide-react";
import { PageContainer, SectionTitle, Card } from "@/components/ui/primitives";
import { Slider } from "@/components/ui/Slider";
import { FitScoreBadge } from "@/components/score/FitScore";
import { DESTINATIONS } from "@/data/destinations";
import { calculateFitScore } from "@/lib/matching";
import { useEurovibeStore } from "@/store/useEurovibeStore";
import type { Destination, FieldSource } from "@/types";
import { cn } from "@/lib/format";

type Overrides = Record<string, Partial<Record<keyof Destination, number>>>;

const EDITABLE: { key: keyof Destination; label: string }[] = [
  { key: "costScore", label: "Cost" },
  { key: "queerScore", label: "Queer" },
  { key: "nightlifeScore", label: "Nightlife" },
  { key: "safetyScore", label: "Safety" },
  { key: "differentFromPragueScore", label: "Different" },
  { key: "sensoryScore", label: "Sensory" },
  { key: "comfortScore", label: "Comfort" },
  { key: "frictionScore", label: "Friction" },
  { key: "touristDensityScore", label: "Tourist density" },
  { key: "confidenceScore", label: "Confidence" },
];

export default function AdminPage() {
  const weights = useEurovibeStore((s) => s.profile.preferenceWeights);
  const [overrides, setOverrides] = useState<Overrides>({});
  const [liveOverrides, setLiveOverrides] = useState<Record<string, boolean>>({});
  const [activeId, setActiveId] = useState(DESTINATIONS[0].id);

  const merged = useMemo<Destination[]>(
    () => DESTINATIONS.map((d) => ({ ...d, ...(overrides[d.id] ?? {}) }) as Destination),
    [overrides],
  );
  const active = merged.find((d) => d.id === activeId)!;

  const setScore = (id: string, key: keyof Destination, value: number) =>
    setOverrides((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }));

  const resetOne = (id: string) =>
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });

  return (
    <PageContainer className="max-w-6xl">
      <div className="flex flex-col gap-6">
        <SectionTitle
          eyebrow="Data console"
          title="Destination intelligence."
          subtitle="Edit the mock data and watch fit scores recompute live. Changes stay in this session."
        />

        {/* Destination table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="bg-ivory-100/60 text-ink-400 text-xs uppercase tracking-wide">
                  <th className="text-left font-semibold px-4 py-3">City</th>
                  <th className="text-left font-semibold px-4 py-3">Region</th>
                  <th className="text-left font-semibold px-4 py-3">Cost</th>
                  <th className="text-left font-semibold px-4 py-3">Nightlife</th>
                  <th className="text-left font-semibold px-4 py-3">Different</th>
                  <th className="text-left font-semibold px-4 py-3">Live fit</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {merged.map((d) => (
                  <tr
                    key={d.id}
                    className={cn(
                      "border-t border-ink/5 cursor-pointer hover:bg-ivory-100/50",
                      activeId === d.id && "bg-coral-50/50",
                    )}
                    onClick={() => setActiveId(d.id)}
                  >
                    <td className="px-4 py-3 font-semibold text-ink-700">{d.city}</td>
                    <td className="px-4 py-3 text-ink-400">{d.region}</td>
                    <td className="px-4 py-3">{d.costScore}</td>
                    <td className="px-4 py-3">{d.nightlifeScore}</td>
                    <td className="px-4 py-3">{d.differentFromPragueScore}</td>
                    <td className="px-4 py-3"><FitScoreBadge value={calculateFitScore(weights, d)} /></td>
                    <td className="px-4 py-3 text-right">
                      {overrides[d.id] && (
                        <button onClick={(e) => { e.stopPropagation(); resetOne(d.id); }} className="text-ink-300 hover:text-coral-600">
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Scores editor */}
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="p-5">
            <h2 className="inline-flex items-center gap-2 editorial-heading text-lg text-ink-700 mb-4">
              <Sliders className="h-4 w-4 text-coral-600" /> Scores editor — {active.city}
            </h2>
            <div className="space-y-4">
              {EDITABLE.map((f) => (
                <div key={f.key as string}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-ink-600">{f.label}</span>
                    <span className="font-semibold text-ink-700">{active[f.key] as number}</span>
                  </div>
                  <Slider
                    value={active[f.key] as number}
                    min={0}
                    max={10}
                    onChange={(v) => setScore(active.id, f.key, v)}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Metadata panels */}
          <div className="space-y-5">
            <Card className="p-5">
              <h3 className="inline-flex items-center gap-2 font-semibold text-ink-700 mb-3">
                <Database className="h-4 w-4 text-coral-600" /> Trust metadata
              </h3>
              <dl className="space-y-2 text-sm">
                <Row label="Confidence" value={`${active.sourceMetadata.confidence}%`} />
                <Row label="Source type" value={active.sourceMetadata.sourceType} />
                <Row label="Last updated" value={active.sourceMetadata.lastUpdated} />
                <Row label="Based on" value={active.sourceMetadata.basedOn} />
              </dl>
            </Card>

            {active.fieldSources && (
              <Card className="p-5">
                <h3 className="inline-flex items-center gap-2 font-semibold text-ink-700 mb-3">
                  <Database className="h-4 w-4 text-coral-600" /> Field provenance
                </h3>
                <div className="space-y-1.5">
                  {(Object.entries(active.fieldSources) as [string, FieldSource][]).map(
                    ([field, src]) => {
                      const isLive = liveOverrides[`${active.id}:${field}`] ?? src.live;
                      return (
                        <div
                          key={field}
                          className="flex items-center justify-between gap-3 rounded-xl bg-ivory-100/70 px-3 py-2"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-ink-700 capitalize">{field}</p>
                            <p className="text-[11px] text-ink-400 truncate">
                              {src.confidence}% · verified {src.verifiedAt}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              setLiveOverrides((prev) => ({
                                ...prev,
                                [`${active.id}:${field}`]: !isLive,
                              }))
                            }
                            className={cn(
                              "flex-none rounded-full px-2.5 py-1 text-[10px] font-semibold border transition-colors",
                              isLive
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-ink-700/5 text-ink-400 border-ink/10",
                            )}
                          >
                            {isLive ? "Live" : "Editorial"}
                          </button>
                        </div>
                      );
                    },
                  )}
                </div>
                <p className="mt-2 text-[11px] text-ink-400">
                  Toggle a field's source between live and editorial (in-session demo).
                </p>
              </Card>
            )}
            <Card className="p-5">
              <h3 className="font-semibold text-ink-700 mb-2">Simulation templates</h3>
              <ul className="space-y-1.5 text-sm text-ink-500">
                {active.simulationTemplates.map((t) => (
                  <li key={t.day} className="flex gap-2">
                    <span className="font-semibold text-coral-600">Day {t.day}</span> {t.title}
                  </li>
                ))}
              </ul>
            </Card>
            <Card className="p-5">
              <h3 className="font-semibold text-ink-700 mb-2">Hotspots & route compatibility</h3>
              <p className="text-sm text-ink-500">{active.portalHotspots.length} hotspots configured.</p>
              <p className="text-sm text-ink-500 mt-1">
                Pairs well with: {active.routeCompatibility.join(", ") || "—"}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-ink-400 flex-none">{label}</dt>
      <dd className="text-ink-600 text-right">{value}</dd>
    </div>
  );
}
