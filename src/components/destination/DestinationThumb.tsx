import { useState } from "react";
import type { Destination } from "@/types";
import { cn } from "@/lib/format";

/**
 * Destination thumbnail. Prefers a real photo (loaded in the browser); if there's no image or it
 * fails to load, falls back to layered gradient + SVG skyline art keyed off the destination palette.
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
  const [imgError, setImgError] = useState(false);
  const grad = night ? destination.portalBackgroundNight : destination.portalBackgroundDay;
  const showArt = !destination.image || imgError;

  return (
    <div className={cn("overflow-hidden bg-gradient-to-br", grad, className)}>
      {destination.image && !imgError && (
        <img
          src={destination.image}
          alt={`${destination.city}, ${destination.country}`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      )}

      {showArt && (
        <>
          <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice" className="absolute bottom-0 h-full w-full">
            <g fill={night ? "#0f0b1c" : "#2a3a55"} opacity={night ? 0.85 : 0.45}>
              <path d="M0,200 L0,130 L30,130 L36,110 L42,130 L90,130 L90,95 L104,95 L112,78 L120,95 L120,130 L170,130 L170,108 L196,108 L204,86 L212,108 L240,108 L240,128 L300,128 L308,100 L316,128 L360,128 L360,98 L378,98 L386,80 L394,98 L400,98 L400,200 Z" />
            </g>
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
        </>
      )}
    </div>
  );
}
