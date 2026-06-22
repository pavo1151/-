import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Building2, Map as MapIcon, Volume2, VolumeX, Eye, ChevronDown } from "lucide-react";
import type { DayNight, PortalMode, LensId, SoundscapeMode } from "@/types";
import { LENSES, LENS_BY_ID } from "@/data/lenses";
import { cn } from "@/lib/format";

/** Day / Night segmented toggle. */
export function DayNightToggle({ value, onChange }: { value: DayNight; onChange: (v: DayNight) => void }) {
  return (
    <Segmented
      options={[
        { id: "day", label: "Day", icon: <Sun className="h-4 w-4" /> },
        { id: "night", label: "Night", icon: <Moon className="h-4 w-4" /> },
      ]}
      value={value}
      onChange={(v) => onChange(v as DayNight)}
    />
  );
}

/** Street / Map segmented toggle. */
export function StreetMapToggle({ value, onChange }: { value: PortalMode; onChange: (v: PortalMode) => void }) {
  return (
    <Segmented
      options={[
        { id: "street", label: "Street", icon: <Building2 className="h-4 w-4" /> },
        { id: "map", label: "Map", icon: <MapIcon className="h-4 w-4" /> },
      ]}
      value={value}
      onChange={(v) => onChange(v as PortalMode)}
    />
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { id: string; label: string; icon: React.ReactNode }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex items-center rounded-full bg-white/10 border border-white/15 p-1 backdrop-blur-md">
      {options.map((o) => (
        <button
          key={o.id}
          onClick={() => onChange(o.id)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all",
            value === o.id ? "bg-white text-ink-900 shadow" : "text-white/70 hover:text-white",
          )}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}

const SOUND_OPTIONS: { id: SoundscapeMode; label: string }[] = [
  { id: "off", label: "Off" },
  { id: "street", label: "Street" },
  { id: "night", label: "Night" },
  { id: "quiet", label: "Quiet" },
  { id: "no-voices", label: "No voices" },
];

export function SoundscapeToggle({ value, onChange }: { value: SoundscapeMode; onChange: (v: SoundscapeMode) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-sm text-white backdrop-blur-md hover:bg-white/20"
      >
        {value === "off" ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        <span className="hidden sm:inline">Soundscape</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-2xl bg-night-800/95 backdrop-blur-xl border border-white/10 p-1.5 z-30 shadow-sheet">
          {SOUND_OPTIONS.map((o) => (
            <button
              key={o.id}
              onClick={() => { onChange(o.id); setOpen(false); }}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm",
                value === o.id ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10",
              )}
            >
              {o.label}
              {value === o.id && <span className="h-2 w-2 rounded-full bg-coral" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function LensSelector({ value, onChange }: { value: LensId; onChange: (v: LensId) => void }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const current = LENS_BY_ID[value];
  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-sm text-white backdrop-blur-md hover:bg-white/20"
      >
        <Eye className="h-4 w-4" />
        <span className="hidden sm:inline">{current.glyph} {current.label}</span>
        <span className="sm:hidden">{current.glyph}</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-night-800/95 backdrop-blur-xl border border-white/10 p-1.5 z-30 shadow-sheet max-h-80 overflow-y-auto no-scrollbar">
          {LENSES.map((l) => (
            <button
              key={l.id}
              onClick={() => { onChange(l.id); setOpen(false); }}
              className={cn(
                "flex w-full items-start gap-2 rounded-xl px-3 py-2 text-left",
                value === l.id ? "bg-white/15" : "hover:bg-white/10",
              )}
            >
              <span className="text-lg">{l.glyph}</span>
              <div>
                <p className="text-sm font-medium text-white">{l.label}</p>
                <p className="text-xs text-white/55">{l.blurb}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
