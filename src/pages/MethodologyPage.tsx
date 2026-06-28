import { useNavigate } from "react-router-dom";
import { Scale, ShieldCheck, Radio, PenLine, Heart } from "lucide-react";
import { PageContainer, SectionTitle, Card } from "@/components/ui/primitives";
import { SecondaryButton } from "@/components/ui/buttons";
import { Seo } from "@/components/seo/Seo";

export default function MethodologyPage() {
  const navigate = useNavigate();
  return (
    <PageContainer className="max-w-3xl">
      <Seo
        title="How Eurovibe scores"
        description="How Eurovibe computes fit scores from your preferences, how confidence and per-field provenance work, and the content-safety principles behind queer and sensitive content."
        path="/methodology"
      />
      <div className="flex flex-col gap-6">
        <SectionTitle
          eyebrow="Methodology"
          title="How Eurovibe scores."
          subtitle="No magic — just a transparent model over honest, dated data."
        />

        <Card className="p-6">
          <h2 className="inline-flex items-center gap-2 editorial-heading text-xl text-ink-700 mb-3">
            <Scale className="h-5 w-5 text-coral-600" /> The fit score
          </h2>
          <p className="text-ink-500">
            Every destination carries scores from 0–10 across cost, nightlife, queer scene, safety,
            difference from Prague, sensory atmosphere, comfort, shopping, friction and tourist density.
            Your moods and trade-offs become <strong>weights</strong> over those same dimensions. The fit
            score multiplies each weight by the matching score, subtracts the friction and tourist-density
            you'd rather avoid, and normalizes to 0–100:
          </p>
          <pre className="mt-3 overflow-x-auto rounded-2xl bg-ink-900 p-4 text-xs text-white/90">{`fit = costW·cost + nightlifeW·nightlife + queerW·queer
    + safetyW·safety + noveltyW·differentFromPrague
    + sensoryW·sensory + comfortW·comfort + shoppingW·shopping
    + localRealityW·(10 − touristDensity)
    − lowFrictionW·friction − touristAvoidanceW·touristDensity`}</pre>
          <p className="mt-3 text-sm text-ink-400">
            The result is lightly blended with each destination's editorial base score for stability, then
            rounded. Change your priorities and every screen re-ranks instantly.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="inline-flex items-center gap-2 editorial-heading text-xl text-ink-700 mb-3">
            <ShieldCheck className="h-5 w-5 text-coral-600" /> Confidence & provenance
          </h2>
          <p className="text-ink-500">
            Each destination has an overall confidence score, and each detail (cost, nightlife, safety,
            queer scene…) carries its own <strong>"verified" date</strong>, source and confidence. Fields
            that change quickly — nightlife and the queer scene — are rated more cautiously and framed as
            "check before you go."
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-ivory-100/70 p-4">
              <p className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                <Radio className="h-4 w-4" /> Live
              </p>
              <p className="text-sm text-ink-500 mt-1">
                Pulled from a live data source (e.g. cost / currency). Updated automatically.
              </p>
            </div>
            <div className="rounded-2xl bg-ivory-100/70 p-4">
              <p className="inline-flex items-center gap-1.5 font-semibold text-ink-500">
                <PenLine className="h-4 w-4" /> Editorial
              </p>
              <p className="text-sm text-ink-500 mt-1">
                A curated human assessment. Honest, but a snapshot — flag anything outdated and it goes to
                review.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="inline-flex items-center gap-2 editorial-heading text-xl text-ink-700 mb-3">
            <Heart className="h-5 w-5 text-coral-600" /> Content principles
          </h2>
          <ul className="space-y-2 text-sm text-ink-500">
            <li>• Queer travel content is respectful, practical and safety-aware — community visibility,
              venue types and "check before you go", never explicit.</li>
            <li>• Sensitive legal topics (e.g. CBD/cannabis) only ever cover legal status, visibility and
              caution — never sourcing or how-to.</li>
            <li>• We surface trade-offs, not hype: every destination shows why it might <em>not</em> fit.</li>
          </ul>
        </Card>

        <SecondaryButton onClick={() => navigate("/reports")}>See trust reports</SecondaryButton>
      </div>
    </PageContainer>
  );
}
