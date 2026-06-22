import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Map as MapIcon } from "lucide-react";
import { PageContainer, SectionTitle } from "@/components/ui/primitives";
import { SecondaryButton } from "@/components/ui/buttons";
import { useEurovibeStore } from "@/store/useEurovibeStore";
import { getExperienceWorlds, worldDestinations } from "@/lib/matching";
import { DESTINATIONS_BY_ID } from "@/data/destinations";

export default function ExperienceWorldsPage() {
  const navigate = useNavigate();
  const weights = useEurovibeStore((s) => s.profile.preferenceWeights);
  const worlds = useMemo(() => getExperienceWorlds(weights), [weights]);

  return (
    <PageContainer>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <SectionTitle
            eyebrow="Experience worlds"
            title="Worlds that match your energy."
            subtitle="Less scrolling, more feeling — destinations grouped into emotional worlds."
          />
          <SecondaryButton onClick={() => navigate("/map")} icon={<MapIcon className="h-4 w-4" />}>
            Back to map
          </SecondaryButton>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {worlds.map((world, i) => {
            const real = worldDestinations(world);
            return (
              <motion.div
                key={world.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="group relative overflow-hidden rounded-3xl bg-white shadow-card border border-white/70 hover:shadow-lift transition-all"
              >
                <div className={`relative h-36 bg-gradient-to-br ${world.gradient}`}>
                  <span className="absolute top-4 left-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 font-editorial text-lg font-bold text-ink-700">
                    {i + 1}
                  </span>
                  <span className="absolute top-4 right-4 rounded-full bg-ink-900/80 px-3 py-1 text-sm font-bold text-white">
                    {world.fit}% fit
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="editorial-heading text-2xl text-ink-700">{world.title}</h3>
                  <p className="mt-1 text-ink-500">{world.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {world.destinationIds.map((id) => {
                      const known = DESTINATIONS_BY_ID[id];
                      return (
                        <span
                          key={id}
                          className={
                            known
                              ? "rounded-full bg-coral-50 text-coral-700 border border-coral-100 px-3 py-1 text-xs font-medium"
                              : "rounded-full bg-ivory-100 text-ink-400 border border-ink/5 px-3 py-1 text-xs"
                          }
                        >
                          {known ? known.city : id.charAt(0).toUpperCase() + id.slice(1)}
                        </span>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => navigate(`/discover?world=${world.id}`)}
                    disabled={real.length === 0}
                    className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-ink-900 text-white px-5 py-2.5 text-sm font-semibold hover:gap-2.5 transition-all disabled:opacity-40"
                  >
                    Explore this world <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}
