import type { Destination, DayNight } from "@/types";
import { cn } from "@/lib/format";

/**
 * Stylized cinematic street scene built from layered SVG silhouettes + gradients.
 * Not a photo — an editorial, atmospheric stand-in (photography can drop in later).
 */
export function CityStreetScene({
  destination,
  mode,
  className,
}: {
  destination: Destination;
  mode: DayNight;
  className?: string;
}) {
  const night = mode === "night";
  const sky = night
    ? `bg-gradient-to-b ${destination.portalBackgroundNight}`
    : `bg-gradient-to-b ${destination.portalBackgroundDay}`;

  return (
    <div className={cn("absolute inset-0 overflow-hidden grain", sky, className)}>
      {/* sun / moon glow */}
      <div
        className={cn(
          "absolute rounded-full blur-2xl transition-all duration-700",
          night ? "bg-twilight-gold/40 h-40 w-40" : "bg-amber-200/60 h-56 w-56",
        )}
        style={{ top: night ? "12%" : "8%", left: night ? "62%" : "18%" }}
      />
      {/* distant skyline */}
      <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" className="absolute bottom-0 left-0 w-full h-[62%]">
        <g fill={night ? "#1a1430" : "#3a4a66"} opacity={night ? 0.85 : 0.45}>
          <SkylineBack />
        </g>
      </svg>
      {/* bridge / mid silhouette */}
      <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" className="absolute bottom-0 left-0 w-full h-[52%]">
        <g fill={night ? "#0f0b1c" : "#2a3a55"} opacity={night ? 0.92 : 0.6}>
          <BridgeMid />
        </g>
      </svg>
      {/* river reflection */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-[26%]",
          night
            ? "bg-gradient-to-b from-twilight-rose/10 to-night-950/80"
            : "bg-gradient-to-b from-sky-200/30 to-sky-300/50",
        )}
      />
      {/* warm lamp dots */}
      {night &&
        LAMP_POSITIONS.map((p, i) => (
          <span
            key={i}
            className="absolute h-1.5 w-1.5 rounded-full bg-lamp shadow-lamp animate-glow-pulse"
            style={{ left: `${p.x}%`, top: `${p.y}%`, animationDelay: `${i * 0.3}s` }}
          />
        ))}
      {/* foreground cobblestone gradient */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 h-[14%]",
          night ? "bg-gradient-to-t from-night-950 to-transparent" : "bg-gradient-to-t from-stone-400/40 to-transparent",
        )}
      />
      {/* vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_30%,transparent_40%,rgba(8,5,16,0.55)_100%)]" />
    </div>
  );
}

const LAMP_POSITIONS = [
  { x: 12, y: 56 }, { x: 24, y: 50 }, { x: 38, y: 58 }, { x: 50, y: 52 },
  { x: 63, y: 60 }, { x: 74, y: 54 }, { x: 86, y: 58 }, { x: 33, y: 64 },
  { x: 58, y: 66 }, { x: 80, y: 64 },
];

function SkylineBack() {
  return (
    <path d="M0,400 L0,210 L40,210 L48,180 L56,210 L120,210 L120,150 L140,150 L150,120 L160,150 L160,210 L240,210 L240,170 L280,170 L290,140 L300,170 L340,170 L340,200 L420,200 L430,150 L440,200 L520,200 L520,160 L540,160 L552,120 L564,160 L620,160 L620,210 L700,210 L710,175 L720,210 L800,210 L800,150 L830,150 L840,115 L850,150 L880,150 L880,210 L960,210 L970,170 L980,210 L1060,210 L1060,160 L1090,160 L1100,130 L1110,160 L1160,160 L1160,210 L1200,210 L1200,400 Z" />
  );
}

function BridgeMid() {
  return (
    <g>
      {/* bridge deck */}
      <rect x="0" y="250" width="1200" height="30" />
      {/* arches */}
      {[60, 240, 420, 600, 780, 960].map((x) => (
        <path key={x} d={`M${x},280 Q${x + 90},190 ${x + 180},280 Z`} />
      ))}
      {/* towers */}
      <rect x="540" y="150" width="40" height="130" />
      <path d="M540,150 L560,120 L580,150 Z" />
      <rect x="640" y="160" width="34" height="120" />
      <path d="M640,160 L657,134 L674,160 Z" />
    </g>
  );
}

/**
 * Stylized city map — river, bridges, old-town core, nightlife / shopping zones.
 * Used inside the portal map view.
 */
export function CityMapScene({
  destination,
  mode,
  className,
}: {
  destination: Destination;
  mode: DayNight;
  className?: string;
}) {
  const night = mode === "night";
  return (
    <div
      data-map-style={destination.portalMapStyle}
      className={cn(
        "absolute inset-0 overflow-hidden",
        night ? "bg-night-900" : "bg-[#e9e2d4]",
        className,
      )}
    >
      <svg viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        {/* land base */}
        <rect width="1000" height="700" fill={night ? "#15112a" : "#ece5d7"} />
        {/* parks / green zones */}
        <circle cx="180" cy="180" r="90" fill={night ? "#173026" : "#cfe0bf"} opacity="0.7" />
        <circle cx="820" cy="540" r="110" fill={night ? "#173026" : "#cfe0bf"} opacity="0.7" />
        {/* the river */}
        <path
          d="M-50,120 C200,180 280,320 380,400 C480,480 520,620 700,700 L820,700 C640,560 600,440 520,360 C420,260 360,160 120,80 Z"
          fill={night ? "#1f3a5f" : "#bcd6e8"}
          opacity={night ? 0.85 : 1}
        />
        {/* bridges crossing the river */}
        {[
          [330, 360, 420, 410],
          [430, 440, 520, 480],
          [250, 290, 350, 340],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={night ? "#f2b65a" : "#8a6d3b"} strokeWidth="6" strokeLinecap="round" />
        ))}
        {/* street grid (old town core) */}
        <g stroke={night ? "rgba(255,255,255,0.07)" : "rgba(60,80,110,0.14)"} strokeWidth="2">
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`h${i}`} x1="540" y1={120 + i * 60} x2="960" y2={120 + i * 60} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`v${i}`} x1={540 + i * 60} y1="120" x2={540 + i * 60} y2="540" />
          ))}
        </g>
        {/* old town core highlight */}
        <circle cx="640" cy="280" r="70" fill={night ? "rgba(242,182,90,0.12)" : "rgba(246,136,91,0.14)"} />
      </svg>
      {/* zone glows for night nightlife emphasis */}
      {night && (
        <>
          <div className="absolute h-32 w-32 rounded-full bg-violet-500/20 blur-2xl" style={{ left: "60%", top: "30%" }} />
          <div className="absolute h-24 w-24 rounded-full bg-coral/20 blur-2xl" style={{ left: "40%", top: "55%" }} />
        </>
      )}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_55%,rgba(8,5,16,0.35)_100%)]" />
    </div>
  );
}
