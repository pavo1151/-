import { useNavigate } from "react-router-dom";
import { RefreshCw, Shield, Database, Sparkles, Trash2, Volume2, Languages, Coins } from "lucide-react";
import { useTranslation } from "react-i18next";
import { CURRENCIES } from "@/lib/liveData";
import { getBackendStatus } from "@/lib/backend";
import { PageContainer, SectionTitle, Card } from "@/components/ui/primitives";
import { SecondaryButton } from "@/components/ui/buttons";
import { VibeBar } from "@/components/vibe/VibeBar";
import { useEurovibeStore } from "@/store/useEurovibeStore";
import { LENSES } from "@/data/lenses";
import { cn } from "@/lib/format";

export default function SettingsPage() {
  const navigate = useNavigate();
  const profile = useEurovibeStore((s) => s.profile);
  const setProfile = useEurovibeStore((s) => s.setProfile);
  const resetProfile = useEurovibeStore((s) => s.resetProfile);
  const showToast = useEurovibeStore((s) => s.showToast);
  const language = useEurovibeStore((s) => s.language);
  const setLanguage = useEurovibeStore((s) => s.setLanguage);
  const displayCurrency = useEurovibeStore((s) => s.displayCurrency);
  const setDisplayCurrency = useEurovibeStore((s) => s.setDisplayCurrency);
  const { t } = useTranslation();

  const clearEverything = () => {
    localStorage.removeItem("eurovibe-store");
    showToast("All local data cleared");
    setTimeout(() => window.location.assign("/"), 600);
  };

  return (
    <PageContainer className="max-w-3xl">
      <div className="flex flex-col gap-6">
        <SectionTitle eyebrow="Settings & profile" title="Your Eurovibe profile." subtitle="Tune how matching, trust and the portal behave." />

        <Card className="p-5">
          <h2 className="font-semibold text-ink-700 mb-1 flex items-center gap-2">
            <Languages className="h-4 w-4 text-coral-600" /> {t("settings.language")}
          </h2>
          <p className="text-sm text-ink-400 mb-3">{t("settings.languageHint")}</p>
          <div className="flex flex-wrap gap-2">
            {(["en", "he"] as const).map((lng) => (
              <button
                key={lng}
                onClick={() => setLanguage(lng)}
                className={cn(
                  "chip border",
                  language === lng
                    ? "bg-ink-900 text-white border-ink-900"
                    : "bg-white text-ink-600 border-ink/10",
                )}
              >
                {lng === "en" ? t("settings.english") : t("settings.hebrew")}
              </button>
            ))}
          </div>

          <h2 className="font-semibold text-ink-700 mt-5 mb-1 flex items-center gap-2">
            <Coins className="h-4 w-4 text-coral-600" /> Display currency
          </h2>
          <p className="text-sm text-ink-400 mb-3">
            Costs are authored in EUR and converted with a live exchange rate (falls back to EUR offline).
          </p>
          <div className="flex flex-wrap gap-2">
            {CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => setDisplayCurrency(c.code)}
                className={cn(
                  "chip border",
                  displayCurrency === c.code
                    ? "bg-ink-900 text-white border-ink-900"
                    : "bg-white text-ink-600 border-ink/10",
                )}
              >
                {c.symbol} {c.code}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-semibold text-ink-700 mb-3 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-coral-600" /> Active vibe
          </h2>
          <VibeBar onEdit={() => navigate("/mood")} />
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <Field label="Departure city" value={profile.departureCity} />
            <Field label="Travel month" value={profile.travelMonth} />
            <Field label="Trip length" value={`${profile.tripLength} days`} />
            <Field label="Budget" value={`up to €${profile.budgetRange.max}`} />
          </div>
        </Card>

        {/* Trust preferences */}
        <Card className="p-5 space-y-3">
          <h2 className="font-semibold text-ink-700 flex items-center gap-2">
            <Shield className="h-4 w-4 text-coral-600" /> Trust preferences
          </h2>
          <Toggle
            label="Prefer high-confidence destinations"
            checked={profile.trustPreferences.preferHighConfidence}
            onChange={(v) => setProfile({ trustPreferences: { ...profile.trustPreferences, preferHighConfidence: v } })}
          />
          <Toggle
            label="Hide data flagged as outdated"
            checked={profile.trustPreferences.hideOutdated}
            onChange={(v) => setProfile({ trustPreferences: { ...profile.trustPreferences, hideOutdated: v } })}
          />
        </Card>

        {/* Default lens */}
        <Card className="p-5">
          <h2 className="font-semibold text-ink-700 mb-3 flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-coral-600" /> Default portal lens
          </h2>
          <div className="flex flex-wrap gap-2">
            {LENSES.map((l) => (
              <button
                key={l.id}
                onClick={() => setProfile({ selectedLens: l.id })}
                className={cn(
                  "chip border",
                  profile.selectedLens === l.id ? "bg-ink-900 text-white border-ink-900" : "bg-white text-ink-600 border-ink/10",
                )}
              >
                {l.glyph} {l.label}
              </button>
            ))}
          </div>
        </Card>

        {/* Data controls */}
        <Card className="p-5 space-y-3">
          <h2 className="font-semibold text-ink-700 flex items-center gap-2">
            <Database className="h-4 w-4 text-coral-600" /> Data & console
          </h2>
          <p className="text-sm text-ink-400">
            Storage:{" "}
            <span className="font-medium text-ink-600">
              {getBackendStatus() === "remote"
                ? "Shared backend (Supabase)"
                : "This device (localStorage)"}
            </span>
          </p>
          <div className="flex flex-wrap gap-3">
            <SecondaryButton onClick={() => navigate("/admin")} icon={<Database className="h-4 w-4" />}>
              Open data console
            </SecondaryButton>
            <SecondaryButton onClick={() => navigate("/reports")} icon={<Shield className="h-4 w-4" />}>
              Trust reports
            </SecondaryButton>
            <SecondaryButton onClick={() => navigate("/methodology")} icon={<Shield className="h-4 w-4" />}>
              How we score
            </SecondaryButton>
            <SecondaryButton
              onClick={() => { resetProfile(); showToast("Profile reset"); navigate("/mood"); }}
              icon={<RefreshCw className="h-4 w-4" />}
            >
              Reset my vibe
            </SecondaryButton>
            <button
              onClick={clearEverything}
              className="inline-flex items-center gap-2 rounded-full bg-rose-50 text-rose-600 border border-rose-100 px-5 py-3 text-[15px] font-semibold hover:bg-rose-100"
            >
              <Trash2 className="h-4 w-4" /> Clear all local data
            </button>
          </div>
        </Card>
      </div>
    </PageContainer>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-ivory-100/60 border border-ink/5 px-3 py-2">
      <p className="text-xs text-ink-400">{label}</p>
      <p className="font-medium text-ink-700 capitalize">{value}</p>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!checked)} className="flex w-full items-center justify-between">
      <span className="text-sm text-ink-600">{label}</span>
      <span className={cn("relative h-6 w-11 rounded-full transition-colors", checked ? "bg-coral" : "bg-ink/15")}>
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", checked ? "left-[22px]" : "left-0.5")} />
      </span>
    </button>
  );
}
