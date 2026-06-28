import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { PageContainer, SectionTitle } from "@/components/ui/primitives";
import { PrimaryButton, SecondaryButton } from "@/components/ui/buttons";
import { StepProgress } from "@/components/shell/StepProgress";
import { MOODS } from "@/data/moods";
import { useEurovibeStore } from "@/store/useEurovibeStore";
import { cn } from "@/lib/format";
import { useTranslation } from "react-i18next";
import { Seo } from "@/components/seo/Seo";

export default function TripMoodPage() {
  const navigate = useNavigate();
  const selected = useEurovibeStore((s) => s.profile.selectedMoods);
  const freeText = useEurovibeStore((s) => s.profile.freeTextMood);
  const toggleMood = useEurovibeStore((s) => s.toggleMood);
  const setFreeText = useEurovibeStore((s) => s.setFreeText);
  const recompute = useEurovibeStore((s) => s.recomputeWeights);
  const surpriseMe = useEurovibeStore((s) => s.surpriseMe);
  const showToast = useEurovibeStore((s) => s.showToast);
  const { t } = useTranslation();

  const proceed = () => {
    if (selected.length === 0 && freeText.trim() === "") {
      showToast(t("mood.toast"));
      return;
    }
    recompute();
    navigate("/boundaries");
  };

  return (
    <PageContainer>
      <Seo title="Trip mood" path="/mood" />
      <div className="flex flex-col gap-6">
        <StepProgress step={1} total={3} />
        <SectionTitle
          eyebrow={t("mood.eyebrow")}
          title={t("mood.title")}
          subtitle={t("mood.subtitle")}
        />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {MOODS.map((mood, i) => {
            const isSel = selected.includes(mood.id);
            return (
              <motion.button
                key={mood.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                onClick={() => toggleMood(mood.id)}
                className={cn(
                  "group relative overflow-hidden rounded-3xl p-4 sm:p-5 text-left transition-all border-2",
                  "bg-gradient-to-br",
                  mood.gradient,
                  isSel
                    ? "border-coral shadow-glow -translate-y-1"
                    : "border-transparent shadow-card hover:-translate-y-1 hover:shadow-lift",
                )}
              >
                {isSel && (
                  <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-coral text-white shadow">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                )}
                <div className="text-3xl sm:text-4xl mb-3 drop-shadow-sm">{mood.glyph}</div>
                <h3 className="font-editorial text-lg font-semibold text-ink-700 leading-tight">
                  {t(`mood.cards.${mood.id}.title`)}
                </h3>
                <p className="text-sm text-ink-500/90 mt-1">{t(`mood.cards.${mood.id}.cue`)}</p>
              </motion.button>
            );
          })}
        </div>

        <div className="rounded-3xl bg-white shadow-card border border-white/70 p-2">
          <input
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder={t("mood.describe")}
            className="w-full rounded-2xl bg-transparent px-4 py-3 text-ink-700 placeholder:text-ink-300 focus:outline-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm text-ink-400">
            {selected.length > 0 ? t("mood.selected", { count: selected.length }) : t("mood.pickHint")}
          </p>
          <div className="flex gap-3">
            <SecondaryButton
              onClick={() => {
                surpriseMe();
                navigate("/profile-summary");
              }}
              icon={<Sparkles className="h-4 w-4" />}
            >
              {t("mood.surprise")}
            </SecondaryButton>
            <PrimaryButton onClick={proceed} icon={<ArrowRight className="h-4 w-4" />}>
              {t("mood.show")}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
