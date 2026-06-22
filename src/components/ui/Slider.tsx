import { cn } from "@/lib/format";

/** Editorial range slider with coral fill. */
export function Slider({
  value,
  min,
  max,
  step = 1,
  onChange,
  className,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  className?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={cn(
        "w-full h-2 appearance-none rounded-full cursor-pointer accent-coral",
        "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5",
        "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:border-[3px]",
        "[&::-webkit-slider-thumb]:border-coral [&::-webkit-slider-thumb]:shadow-glow [&::-webkit-slider-thumb]:cursor-grab",
        "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:rounded-full",
        "[&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:border-[3px] [&::-moz-range-thumb]:border-coral",
        className,
      )}
      style={{
        background: `linear-gradient(to right, #F6885B 0%, #F8A981 ${pct}%, rgba(30,58,95,0.12) ${pct}%, rgba(30,58,95,0.12) 100%)`,
      }}
    />
  );
}
