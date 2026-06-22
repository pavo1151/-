import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEurovibeStore } from "@/store/useEurovibeStore";
import { topMatch } from "@/lib/matching";
import { LoadingState } from "@/components/ui/primitives";

/** The "Simulate" nav item routes here, then forwards to the top match's simulation. */
export default function SimulateEntryPage() {
  const navigate = useNavigate();
  const weights = useEurovibeStore((s) => s.profile.preferenceWeights);
  const savedSimulations = useEurovibeStore((s) => s.savedSimulations);

  useEffect(() => {
    const target = savedSimulations[0]?.destinationId ?? topMatch(weights).id;
    navigate(`/destination/${target}/simulate`, { replace: true });
  }, [navigate, weights, savedSimulations]);

  return <LoadingState label="Building your simulation…" />;
}
