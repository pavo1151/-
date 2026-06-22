import { useNavigate } from "react-router-dom";
import { CalendarDays, Wallet, Plane, Luggage, MapPinned, Gauge } from "lucide-react";
import { PageContainer, SectionTitle, Card } from "@/components/ui/primitives";
import { PrimaryButton, BackButton } from "@/components/ui/buttons";
import { StepProgress } from "@/components/shell/StepProgress";
import { Slider } from "@/components/ui/Slider";
import { useEurovibeStore } from "@/store/useEurovibeStore";
import { cn } from "@/lib/format";
import type { LuggageMode, TripStyle } from "@/types";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function RealityBoundariesPage() {
  const navigate = useNavigate();
  const profile = useEurovibeStore((s) => s.profile);
  const setProfile = useEurovibeStore((s) => s.setProfile);

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <StepProgress step={2} total={3} />
        <SectionTitle
          eyebrow="Reality boundaries"
          title="Let's shape the real version of your trip."
          subtitle="A few details help us find matches that actually work for you."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {/* Days */}
          <Card className="p-5">
            <Label icon={<CalendarDays className="h-4 w-4" />}>How many days?</Label>
            <div className="mt-3 flex flex-wrap gap-2">
              {["3-4", "5-7", "8-10", "10+"].map((opt) => (
                <Pill key={opt} active={profile.tripLength === opt} onClick={() => setProfile({ tripLength: opt })}>
                  {opt} days
                </Pill>
              ))}
            </div>
          </Card>

          {/* Budget */}
          <Card className="p-5">
            <Label icon={<Wallet className="h-4 w-4" />}>Total budget?</Label>
            <div className="mt-4 flex items-center justify-between text-sm text-ink-500">
              <span>€{profile.budgetRange.max}</span>
              <span className="text-ink-300">{profile.budgetRange.max >= 2000 ? "€2000+" : "total"}</span>
            </div>
            <Slider
              value={profile.budgetRange.max}
              min={200}
              max={2000}
              step={50}
              onChange={(v) => setProfile({ budgetRange: { min: 200, max: v } })}
              className="mt-2"
            />
          </Card>

          {/* Departure */}
          <Card className="p-5">
            <Label icon={<Plane className="h-4 w-4" />}>Departure city?</Label>
            <input
              value={profile.departureCity}
              onChange={(e) => setProfile({ departureCity: e.target.value })}
              className="mt-3 w-full rounded-2xl bg-ivory-100 px-4 py-2.5 text-ink-700 focus:outline-none focus:ring-2 focus:ring-coral/30"
              placeholder="e.g. Prague"
            />
          </Card>

          {/* Month */}
          <Card className="p-5">
            <Label icon={<CalendarDays className="h-4 w-4" />}>Travel month?</Label>
            <select
              value={profile.travelMonth}
              onChange={(e) => setProfile({ travelMonth: e.target.value })}
              className="mt-3 w-full rounded-2xl bg-ivory-100 px-4 py-2.5 text-ink-700 focus:outline-none focus:ring-2 focus:ring-coral/30"
            >
              {MONTHS.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </Card>

          {/* Luggage */}
          <Card className="p-5">
            <Label icon={<Luggage className="h-4 w-4" />}>Light or luggage?</Label>
            <div className="mt-3 flex flex-wrap gap-2">
              {([["light","Light"],["dont-mind","I don't mind"],["full","Full luggage"]] as [LuggageMode,string][]).map(([v,l]) => (
                <Pill key={v} active={profile.luggageMode === v} onClick={() => setProfile({ luggageMode: v })}>
                  {l}
                </Pill>
              ))}
            </div>
          </Card>

          {/* One vs multi city */}
          <Card className="p-5">
            <Label icon={<MapPinned className="h-4 w-4" />}>One city or multi-city?</Label>
            <div className="mt-3 flex flex-wrap gap-2">
              {([["one-city","One city"],["multi-city","Multi-city"],["open","Open"]] as [TripStyle,string][]).map(([v,l]) => (
                <Pill key={v} active={profile.tripStyle === v} onClick={() => setProfile({ tripStyle: v })}>
                  {l}
                </Pill>
              ))}
            </div>
          </Card>

          {/* Friction */}
          <Card className="p-5 md:col-span-2">
            <Label icon={<Gauge className="h-4 w-4" />}>How much friction can you tolerate?</Label>
            <Slider
              value={profile.frictionTolerance}
              min={0}
              max={100}
              onChange={(v) => setProfile({ frictionTolerance: v })}
              className="mt-4"
            />
            <div className="mt-2 flex justify-between text-xs text-ink-400">
              <span>I want it easy</span>
              <span>Some adventure is ok</span>
              <span>Bring it on</span>
            </div>
          </Card>
        </div>

        <div className="flex items-center justify-between">
          <BackButton onClick={() => navigate("/mood")} label="Back to mood" />
          <PrimaryButton onClick={() => navigate("/tradeoffs")}>Show my matches</PrimaryButton>
        </div>
      </div>
    </PageContainer>
  );
}

function Label({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink-700">
      <span className="text-coral-600">{icon}</span>
      {children}
    </span>
  );
}

function Pill({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full px-4 py-2 text-sm font-medium transition-all border",
        active ? "bg-ink-900 text-white border-ink-900" : "bg-white text-ink-600 border-ink/10 hover:border-ink/30",
      )}
    >
      {children}
    </button>
  );
}
