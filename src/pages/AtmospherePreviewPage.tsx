import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Volume2, VolumeX, ChevronLeft } from "lucide-react";
import { Wordmark } from "@/components/shell/Wordmark";
import { CityStreetScene } from "@/components/portal/Scenes";
import { GhostButton } from "@/components/ui/buttons";
import { getDestinationById } from "@/lib/matching";

export default function AtmospherePreviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sound, setSound] = useState(false);
  const d = id ? getDestinationById(id) : undefined;

  if (!d) {
    navigate("/discover");
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-night-950 text-white">
      <CityStreetScene destination={d} mode="night" />

      {/* top bar */}
      <div className="relative z-10 flex items-center justify-between px-5 sm:px-8 py-5">
        <button onClick={() => navigate(`/destination/${d.id}`)} className="flex items-center gap-1 text-white/70 hover:text-white">
          <ChevronLeft className="h-5 w-5" /> Back
        </button>
        <Wordmark dark />
        <button
          onClick={() => setSound((s) => !s)}
          className="flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs backdrop-blur-md hover:bg-white/20"
        >
          {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          Soundscape {sound ? "On" : "Off"}
        </button>
      </div>

      {/* center content */}
      <div className="relative z-10 flex min-h-[calc(100vh-160px)] flex-col items-center justify-end sm:justify-center px-6 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-white/60 uppercase tracking-[0.3em] text-xs mb-3">Step into the experience</p>
          <h1 className="editorial-heading text-6xl sm:text-7xl mb-4 drop-shadow-lg">{d.city}</h1>
          <p className="text-white/80 max-w-md mx-auto mb-6">{d.shortVibe}</p>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {d.atmosphereTags.map((t, i) => (
              <motion.span
                key={t}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="rounded-full bg-white/10 border border-white/15 px-3.5 py-1.5 text-sm backdrop-blur-md"
              >
                {t}
              </motion.span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate(`/destination/${d.id}/portal`)}
              className="inline-flex items-center gap-2 rounded-full bg-coral-gradient px-8 py-4 text-lg font-semibold text-white shadow-glow hover:-translate-y-0.5 transition-all"
            >
              Enter {d.city} Portal <ArrowRight className="h-5 w-5" />
            </button>
            <GhostButton onClick={() => navigate(`/destination/${d.id}`)}>Skip to profile</GhostButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
