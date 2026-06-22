import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { PageContainer, SectionTitle } from "@/components/ui/primitives";
import { BackButton } from "@/components/ui/buttons";
import { StepProgress } from "@/components/shell/StepProgress";
import { TRADEOFFS, type TradeChoice } from "@/data/tradeoffs";
import { useEurovibeStore } from "@/store/useEurovibeStore";
import { cn } from "@/lib/format";

export default function TradeoffPage() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const setTradeChoice = useEurovibeStore((s) => s.setTradeChoice);
  const recompute = useEurovibeStore((s) => s.recomputeWeights);
  const tradeChoices = useEurovibeStore((s) => s.tradeChoices);

  const current = TRADEOFFS[index];

  const choose = (choice: TradeChoice) => {
    setTradeChoice(current.id, choice);
    setTimeout(() => {
      if (index < TRADEOFFS.length - 1) {
        setIndex((i) => i + 1);
      } else {
        recompute();
        navigate("/profile-summary");
      }
    }, 220);
  };

  const back = () => {
    if (index === 0) navigate("/boundaries");
    else setIndex((i) => i - 1);
  };

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <StepProgress step={3} total={3} />
        <SectionTitle
          eyebrow={`Trade-off ${index + 1} of ${TRADEOFFS.length}`}
          title="Help us understand your trade-offs."
          subtitle="There's no perfect answer. Choose what feels more true for this trip."
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="relative grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <TradeCard
              data={current.left}
              selected={tradeChoices[current.id] === "left"}
              onClick={() => choose("left")}
            />
            <TradeCard
              data={current.right}
              selected={tradeChoices[current.id] === "right"}
              onClick={() => choose("right")}
            />
            <div className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 sm:flex">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink-900 text-white font-editorial font-bold shadow-lift">
                VS
              </span>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-center gap-3">
          <ChoiceButton onClick={() => choose("both")}>Both</ChoiceButton>
          <ChoiceButton onClick={() => choose("neutral")}>Neutral</ChoiceButton>
        </div>

        <div className="flex items-center justify-between">
          <BackButton onClick={back} />
          <div className="flex gap-1.5">
            {TRADEOFFS.map((t, i) => (
              <span
                key={t.id}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-6 bg-coral" : i < index ? "w-1.5 bg-coral/50" : "w-1.5 bg-ink/15",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

function TradeCard({
  data,
  selected,
  onClick,
}: {
  data: { title: string; cue: string; gradient: string };
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-3xl p-8 text-left transition-all border-2 min-h-[180px]",
        "bg-gradient-to-br",
        data.gradient,
        selected ? "border-coral shadow-glow" : "border-transparent shadow-card hover:-translate-y-1 hover:shadow-lift",
      )}
    >
      <h3 className="font-editorial text-2xl font-semibold text-ink-700 leading-tight">{data.title}</h3>
      <p className="mt-2 text-ink-500">{data.cue}</p>
      <span className="absolute bottom-4 right-5 text-sm font-semibold text-ink-400 group-hover:text-coral-600 transition-colors">
        Choose →
      </span>
    </button>
  );
}

function ChoiceButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-ink-600 border border-ink/10 shadow-card hover:bg-ivory-100 hover:-translate-y-0.5 transition-all"
    >
      {children}
    </button>
  );
}
