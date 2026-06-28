import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Info, Clock, Database } from "lucide-react";
import type { Destination, FieldSource } from "@/types";
import { Modal } from "@/components/ui/overlays";
import { cn } from "@/lib/format";
import { useEurovibeStore } from "@/store/useEurovibeStore";
import { LiveBadge } from "./FieldSourceLine";

function confidenceTone(c: number) {
  if (c >= 85) return { label: "High confidence", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-100" };
  if (c >= 70) return { label: "Good confidence", color: "text-amber-600", bg: "bg-amber-50 border-amber-100" };
  return { label: "Lower confidence", color: "text-rose-500", bg: "bg-rose-50 border-rose-100" };
}

export function TrustBadge({ destination, dark }: { destination: Destination; dark?: boolean }) {
  const [open, setOpen] = useState(false);
  const tone = confidenceTone(destination.sourceMetadata.confidence);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium border transition-all",
          dark
            ? "bg-white/10 border-white/15 text-white hover:bg-white/20"
            : `${tone.bg} ${tone.color} hover:brightness-95`,
        )}
      >
        <ShieldCheck className="h-4 w-4" />
        Trust: {destination.sourceMetadata.confidence}%
      </button>
      <TrustDetailsModal destination={destination} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function TrustDetailsModal({
  destination,
  open,
  onClose,
}: {
  destination: Destination;
  open: boolean;
  onClose: () => void;
}) {
  const meta = destination.sourceMetadata;
  const tone = confidenceTone(meta.confidence);
  const addReport = useEurovibeStore((s) => s.addTrustReport);
  const showToast = useEurovibeStore((s) => s.showToast);
  const [reported, setReported] = useState(false);

  const report = () => {
    addReport({
      id: crypto.randomUUID(),
      destinationId: destination.id,
      field: "general",
      note: "Marked as possibly outdated by a user.",
      status: "open",
      createdAt: Date.now(),
    });
    setReported(true);
    showToast("Thanks — flagged for review", "success");
  };

  return (
    <Modal open={open} onClose={onClose} title="How much can you trust this?">
      <div className="space-y-5">
        <div className={cn("rounded-2xl border p-4 flex items-center justify-between", tone.bg)}>
          <div>
            <p className={cn("font-semibold", tone.color)}>{tone.label}</p>
            <p className="text-sm text-ink-400">Confidence score</p>
          </div>
          <span className="font-editorial text-3xl font-bold text-ink-700">{meta.confidence}%</span>
        </div>

        <TrustRow icon={<Info className="h-4 w-4" />} title="What this is based on" body={meta.basedOn} />
        <TrustRow icon={<Clock className="h-4 w-4" />} title="What may change" body={meta.mayChange} />
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-ivory-100 p-3">
            <p className="text-xs text-ink-400">Last updated</p>
            <p className="font-medium text-ink-700">{meta.lastUpdated}</p>
          </div>
          <div className="rounded-2xl bg-ivory-100 p-3">
            <p className="text-xs text-ink-400 flex items-center gap-1">
              <Database className="h-3 w-3" /> Source type
            </p>
            <p className="font-medium text-ink-700 text-sm">{meta.sourceType}</p>
          </div>
        </div>

        {destination.fieldSources && (
          <div>
            <p className="text-sm font-semibold text-ink-700 mb-2">Where each detail comes from</p>
            <div className="space-y-1.5">
              {(Object.entries(destination.fieldSources) as [string, FieldSource][]).map(
                ([field, src]) => (
                  <div
                    key={field}
                    className="flex items-center justify-between gap-3 rounded-xl bg-ivory-100/70 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-ink-700 capitalize">
                        {FIELD_LABELS[field] ?? field}
                      </p>
                      <p className="text-[11px] text-ink-400 truncate">
                        {src.source} · verified {src.verifiedAt}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-none">
                      <span className="text-xs font-semibold text-ink-500">{src.confidence}%</span>
                      <LiveBadge live={src.live} />
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-3">
          <Link
            to="/methodology"
            onClick={onClose}
            className="text-sm font-medium text-coral-600 hover:underline"
          >
            How we score →
          </Link>
          <button
            onClick={report}
            disabled={reported}
            className="rounded-full border border-ink/10 px-4 py-2.5 text-sm font-medium text-ink-500 hover:bg-ink/5 disabled:opacity-50"
          >
            {reported ? "Reported — thank you" : "Report as outdated"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

const FIELD_LABELS: Record<string, string> = {
  cost: "Cost / value",
  nightlife: "Nightlife",
  safety: "Safety",
  queer: "Queer scene",
  comfort: "Comfort",
  sensory: "Atmosphere",
  differentFromPrague: "Different from Prague",
  shopping: "Shopping",
  touristDensity: "Tourist density",
};

function TrustRow({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 flex h-8 w-8 flex-none items-center justify-center rounded-full bg-coral-50 text-coral-600">
        {icon}
      </div>
      <div>
        <p className="font-medium text-ink-700">{title}</p>
        <p className="text-sm text-ink-400">{body}</p>
      </div>
    </div>
  );
}
