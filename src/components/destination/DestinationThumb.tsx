import type { Destination } from "@/types";
import { cn } from "@/lib/format";

/**
 * A lightweight generated "photo" stand-in for a destination — layered gradient +
 * SVG skyline keyed off the destination's palette. Image slot for real photos later.
 */
export function DestinationThumb({
  destination,
  className,
  night,
}: {
  destination: Destination;
  className?: string;
  night?: boolean;
}) {
  const grad = night ? destination.portalBackgroundNight : destination.portalBackgroundDay;
  return (
    <div className={cn("overflow-hidden bg-gradient-to-br", grad, className)}>
      <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice" className="absolute bottom-0 h-full w-full">
        <g fill={night ? "#0f0b1c" : "#2a3a55"} opacity={night ? 0.85 : 0.45}>
          <path d="M0,200 L0,130 L30,130 L36,110 L42,130 L90,130 L90,95 L104,95 L112,78 L120,95 L120,130 L170,130 L170,108 L196,108 L204,86 L212,108 L240,108 L240,128 L300,128 L308,100 L316,128 L360,128 L360,98 L378,98 L386,80 L394,98 L400,98 L400,200 Z" />
        </g>
        {/* a couple of warm windows for night */}
        {night && (
          <g fill="#FFC979" opacity="0.9">
            <rect x="100" y="100" width="3" height="4" />
            <rect x="110" y="106" width="3" height="4" />
            <rect x="306" y="108" width="3" height="4" />
            <rect x="200" y="94" width="3" height="4" />
          </g>
        )}
      </svg>
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(255,255,255,0.25),transparent_60%)]" />
    </div>
  );
}
