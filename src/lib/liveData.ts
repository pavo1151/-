import { useEffect, useState } from "react";
import { useEurovibeStore } from "@/store/useEurovibeStore";

/**
 * Live currency rates. Fetched at runtime in the browser from a keyless endpoint, cached in
 * localStorage for a day. All cost data is authored in EUR; this converts it for display. On any
 * failure we simply keep showing the editorial EUR values (graceful fallback).
 */
const RATES_URL = "https://open.er-api.com/v6/latest/EUR";
const CACHE_KEY = "eurovibe-rates";
const TTL_MS = 24 * 60 * 60 * 1000;

export interface RatesState {
  rates: Record<string, number> | null;
  /** true once a live (non-editorial) rate set is available */
  live: boolean;
}

interface CachedRates {
  rates: Record<string, number>;
  ts: number;
}

let memo: Record<string, number> | null = null;

function readCache(): Record<string, number> | null {
  if (memo) return memo;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedRates;
    if (Date.now() - parsed.ts > TTL_MS) return null;
    memo = parsed.rates;
    return memo;
  } catch {
    return null;
  }
}

async function fetchRates(): Promise<Record<string, number> | null> {
  try {
    const res = await fetch(RATES_URL);
    if (!res.ok) return null;
    const data = await res.json();
    const rates = data?.rates as Record<string, number> | undefined;
    if (!rates || typeof rates.USD !== "number") return null;
    memo = rates;
    localStorage.setItem(CACHE_KEY, JSON.stringify({ rates, ts: Date.now() }));
    return rates;
  } catch {
    return null;
  }
}

/** Hook: returns live EUR→* rates (cached), fetching once on mount. */
export function useRates(): RatesState {
  const [rates, setRates] = useState<Record<string, number> | null>(() => readCache());

  useEffect(() => {
    let active = true;
    if (!rates) {
      fetchRates().then((r) => {
        if (active && r) setRates(r);
      });
    }
    return () => {
      active = false;
    };
  }, [rates]);

  return { rates, live: rates !== null };
}

export const CURRENCIES: { code: string; symbol: string; label: string }[] = [
  { code: "EUR", symbol: "€", label: "Euro" },
  { code: "USD", symbol: "$", label: "US Dollar" },
  { code: "GBP", symbol: "£", label: "British Pound" },
  { code: "CZK", symbol: "Kč", label: "Czech Koruna" },
  { code: "HUF", symbol: "Ft", label: "Hungarian Forint" },
  { code: "RSD", symbol: "дин", label: "Serbian Dinar" },
  { code: "BGN", symbol: "лв", label: "Bulgarian Lev" },
];

const SYMBOL = Object.fromEntries(CURRENCIES.map((c) => [c.code, c.symbol]));

/** Parse a EUR cost string like "€75–115" or "€55–75" into numeric bounds. */
function parseEuroRange(s: string): [number, number] | null {
  const nums = s.match(/\d+/g);
  if (!nums || nums.length === 0) return null;
  const a = Number(nums[0]);
  const b = nums.length > 1 ? Number(nums[1]) : a;
  return [a, b];
}

function roundNice(n: number): number {
  if (n >= 1000) return Math.round(n / 50) * 50;
  if (n >= 100) return Math.round(n / 5) * 5;
  return Math.round(n);
}

/**
 * Convert an EUR cost-range string into the target currency.
 * Returns the (possibly unchanged) display string + whether a live rate was applied.
 */
export function convertCostString(
  euro: string,
  currency: string,
  rates: Record<string, number> | null,
): { text: string; live: boolean } {
  if (currency === "EUR" || !rates || !rates[currency]) return { text: euro, live: false };
  const range = parseEuroRange(euro);
  if (!range) return { text: euro, live: false };
  const rate = rates[currency];
  const sym = SYMBOL[currency] ?? "";
  const lo = roundNice(range[0] * rate);
  const hi = roundNice(range[1] * rate);
  const fmt = (v: number) => v.toLocaleString("en-US");
  const text = lo === hi ? `${sym}${fmt(lo)}` : `${sym}${fmt(lo)}–${fmt(hi)}`;
  return { text, live: true };
}

/** Hook returning a converter bound to the user's display currency + live rates. */
export function useCostConverter() {
  const currency = useEurovibeStore((s) => s.displayCurrency);
  const { rates } = useRates();
  return {
    currency,
    convert: (euro: string) => convertCostString(euro, currency, rates),
  };
}
