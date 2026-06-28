/**
 * Backend abstraction.
 *
 * Today everything persists to localStorage via the zustand `persist` middleware
 * (see store/useEurovibeStore.ts). This module documents the opt-in path to a shared, auditable
 * Supabase backend for profiles, saved trips, comparisons, routes and trust reports.
 *
 * To enable Supabase later (no code changes needed here beyond wiring the adapter):
 *   1. npm i @supabase/supabase-js
 *   2. set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY at build time
 *   3. implement `createSupabaseAdapter()` against the StorageAdapter interface
 *
 * Until both env vars are present, `getBackendStatus()` reports "local" and the app keeps using
 * localStorage — so this is completely inert without keys.
 */

export interface StorageAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T): Promise<void>;
}

export const localStorageAdapter: StorageAdapter = {
  async get<T>(key: string) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },
  async set<T>(key: string, value: T) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore quota / serialization errors */
    }
  },
};

export function isRemoteBackendConfigured(): boolean {
  return Boolean(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);
}

export function getBackendStatus(): "local" | "remote" {
  return isRemoteBackendConfigured() ? "remote" : "local";
}
