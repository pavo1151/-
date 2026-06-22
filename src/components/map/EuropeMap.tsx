import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/format";

/**
 * Stylized, illustrated Europe — intentionally not a geographic map.
 * A warm "desire map" canvas onto which markers and heat zones are layered.
 */
export function EuropeMapCanvas({
  children,
  heatZones = [],
}: {
  children: ReactNode;
  heatZones?: { x: number; y: number; intensity: number; hue: string }[];
}) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-sky-100 via-sky-50 to-emerald-50 shadow-card border border-white/70">
      {/* sea texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(186,214,232,0.5),transparent_50%)]" />
      <svg viewBox="0 0 800 600" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full">
        {/* stylized landmass blobs (continental Europe + peninsulas) */}
        <g>
          <path
            d="M260,90 C360,60 520,70 600,120 C660,156 640,210 660,260 C684,320 640,360 600,380 C560,400 540,360 500,370 C470,378 470,420 430,440 C400,455 380,430 360,400 C340,372 300,380 280,360 C250,330 270,300 250,270 C230,240 180,240 170,200 C162,168 200,120 260,90 Z"
            fill="#d8c9a8"
            stroke="#c9b894"
            strokeWidth="3"
          />
          {/* Iberia */}
          <path d="M170,360 C200,350 240,360 250,400 C256,430 220,460 180,450 C150,442 140,400 150,380 C156,368 160,362 170,360 Z" fill="#d8c9a8" stroke="#c9b894" strokeWidth="3" />
          {/* Italy boot */}
          <path d="M430,360 C450,360 460,400 470,440 C478,470 460,500 445,495 C435,492 440,460 430,440 C420,420 415,375 430,360 Z" fill="#d8c9a8" stroke="#c9b894" strokeWidth="3" />
          {/* Balkans + Greece */}
          <path d="M520,360 C560,360 575,400 560,440 C548,472 510,490 500,470 C492,454 510,440 505,420 C500,398 505,372 520,360 Z" fill="#d8c9a8" stroke="#c9b894" strokeWidth="3" />
          {/* Scandinavia hint */}
          <path d="M430,40 C470,30 500,60 490,110 C484,140 450,150 440,120 C432,96 410,70 430,40 Z" fill="#d8c9a8" stroke="#c9b894" strokeWidth="3" opacity="0.85" />
        </g>
        {/* soft mountains */}
        <g fill="#bfae8a" opacity="0.5">
          <path d="M330,250 l20,-34 l20,34 Z" />
          <path d="M360,255 l16,-26 l16,26 Z" />
          <path d="M470,300 l18,-30 l18,30 Z" />
        </g>
        {/* coastline glow */}
        <path
          d="M260,90 C360,60 520,70 600,120 C660,156 640,210 660,260 C684,320 640,360 600,380"
          fill="none"
          stroke="rgba(255,255,255,0.6)"
          strokeWidth="2"
        />
      </svg>

      {/* heat zones */}
      {heatZones.map((z, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 0.5 * z.intensity, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="absolute rounded-full blur-2xl pointer-events-none"
          style={{
            left: `${z.x}%`,
            top: `${z.y}%`,
            width: `${60 + z.intensity * 90}px`,
            height: `${60 + z.intensity * 90}px`,
            transform: "translate(-50%, -50%)",
            background: z.hue,
          }}
        />
      ))}

      {children}
    </div>
  );
}

/** A glowing destination marker placed by percentage. */
export function MapMarker({
  x,
  y,
  label,
  score,
  active,
  pinOnly,
  onClick,
  rank,
}: {
  x: number;
  y: number;
  label: string;
  score?: number;
  active?: boolean;
  pinOnly?: boolean;
  onClick?: () => void;
  rank?: number;
}) {
  return (
    <button
      onClick={onClick}
      className="absolute -translate-x-1/2 -translate-y-full group"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "rounded-full px-2.5 py-1 text-xs font-semibold shadow-card border transition-all whitespace-nowrap",
            pinOnly
              ? "bg-white/80 text-ink-400 border-white/60"
              : active
                ? "bg-ink-900 text-white border-ink-900 scale-105"
                : "bg-white text-ink-700 border-white/70 group-hover:scale-105 group-hover:shadow-lift",
          )}
        >
          {rank && !pinOnly && (
            <span className="mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-coral text-white text-[10px]">
              {rank}
            </span>
          )}
          {label}
          {score !== undefined && !pinOnly && (
            <span className="ml-1.5 text-coral-600 font-bold">{score}%</span>
          )}
        </div>
        {/* pin stem + pulse */}
        <div className="relative mt-0.5">
          <span
            className={cn(
              "block h-3 w-3 rounded-full border-2 border-white",
              pinOnly ? "bg-ink-300" : "bg-coral shadow-glow",
            )}
          />
          {!pinOnly && (
            <span className="absolute inset-0 rounded-full bg-coral/50 animate-pulse-marker" />
          )}
        </div>
      </div>
    </button>
  );
}
