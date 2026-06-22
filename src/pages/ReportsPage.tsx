import { ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { PageContainer, SectionTitle, Card, EmptyState } from "@/components/ui/primitives";
import { useEurovibeStore } from "@/store/useEurovibeStore";
import { getDestinationById } from "@/lib/matching";
import { relativeTime } from "@/lib/format";

export default function ReportsPage() {
  const reports = useEurovibeStore((s) => s.trustReports);
  const showToast = useEurovibeStore((s) => s.showToast);

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <SectionTitle
          eyebrow="Trust review"
          title="User reports & trust review."
          subtitle="Community flags help keep destination intelligence honest and current."
        />

        <Card className="p-5 bg-ivory-100/60">
          <p className="inline-flex items-center gap-2 text-sm text-ink-500">
            <ShieldCheck className="h-4 w-4 text-coral-600" />
            Every destination shows a confidence score and what may change over time. Flagged items are
            reviewed before the underlying data is updated.
          </p>
        </Card>

        {reports.length === 0 ? (
          <EmptyState
            glyph="🛡️"
            title="No open reports"
            body="When you flag a destination as outdated from its trust panel, it appears here for review."
          />
        ) : (
          <div className="space-y-3">
            {reports.map((r) => {
              const d = getDestinationById(r.destinationId);
              return (
                <Card key={r.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                      <Clock className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-ink-700">{d?.city ?? r.destinationId}</p>
                      <p className="text-sm text-ink-400">{r.note}</p>
                      <p className="text-xs text-ink-300 mt-0.5">{relativeTime(r.createdAt)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast("Marked as reviewed", "success")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ink/10 px-3 py-1.5 text-sm text-ink-600 hover:bg-ivory-100"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Mark reviewed
                  </button>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PageContainer>
  );
}
