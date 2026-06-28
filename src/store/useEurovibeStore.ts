import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  UserProfile,
  MoodId,
  PreferenceWeights,
  SavedTrip,
  SavedComparison,
  Simulation,
  RoutePlan,
  LensId,
  PortalMode,
  SoundscapeMode,
  TrustReport,
} from "@/types";
import { baselineWeights, buildPreferenceWeights, vibeTagsFromMoods } from "@/lib/profile";
import type { TradeChoice } from "@/data/tradeoffs";

function defaultProfile(): UserProfile {
  return {
    selectedMoods: [],
    freeTextMood: "",
    tripLength: "5-7",
    budgetRange: { min: 200, max: 2000 },
    departureCity: "Prague",
    travelMonth: "September",
    luggageMode: "dont-mind",
    tripStyle: "open",
    frictionTolerance: 45,
    preferenceWeights: baselineWeights(),
    activeVibeTags: [],
    selectedDestinations: [],
    selectedHotspotsForSimulation: [],
    selectedLens: "first-time",
    selectedPortalMode: "street",
    soundscapePreference: "off",
    trustPreferences: { preferHighConfidence: false, hideOutdated: false },
    onboarded: false,
  };
}

interface ToastState {
  id: number;
  message: string;
  tone?: "default" | "success";
}

interface EurovibeState {
  profile: UserProfile;
  language: "en" | "he";
  tradeChoices: Record<string, TradeChoice>;
  savedTrips: SavedTrip[];
  savedComparisons: SavedComparison[];
  savedSimulations: Simulation[];
  savedRoutes: RoutePlan[];
  trustReports: TrustReport[];
  toast: ToastState | null;

  // profile mutations
  setProfile: (patch: Partial<UserProfile>) => void;
  toggleMood: (mood: MoodId) => void;
  setFreeText: (text: string) => void;
  setTradeChoice: (id: string, choice: TradeChoice) => void;
  recomputeWeights: () => void;
  setWeights: (w: PreferenceWeights) => void;
  surpriseMe: () => void;
  resetProfile: () => void;

  // selections
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  setCompare: (ids: string[]) => void;
  toggleSimHotspot: (id: string) => void;

  // portal controls
  setLens: (lens: LensId) => void;
  setPortalMode: (mode: PortalMode) => void;
  setSoundscape: (mode: SoundscapeMode) => void;

  // saves
  saveTrip: (trip: SavedTrip) => void;
  removeTrip: (id: string) => void;
  saveComparison: (c: SavedComparison) => void;
  removeComparison: (id: string) => void;
  saveSimulation: (s: Simulation) => void;
  saveRoute: (r: RoutePlan) => void;
  removeRoute: (id: string) => void;
  addTrustReport: (r: TrustReport) => void;

  // language
  setLanguage: (lng: "en" | "he") => void;

  // toast
  showToast: (message: string, tone?: "default" | "success") => void;
  clearToast: () => void;
}

let toastSeq = 0;

export const useEurovibeStore = create<EurovibeState>()(
  persist(
    (set) => ({
      profile: defaultProfile(),
      language: "en",
      tradeChoices: {},
      savedTrips: [],
      savedComparisons: [],
      savedSimulations: [],
      savedRoutes: [],
      trustReports: [],
      toast: null,

      setProfile: (patch) => set((s) => ({ profile: { ...s.profile, ...patch } })),

      toggleMood: (mood) =>
        set((s) => {
          const has = s.profile.selectedMoods.includes(mood);
          const selectedMoods = has
            ? s.profile.selectedMoods.filter((m) => m !== mood)
            : [...s.profile.selectedMoods, mood];
          return {
            profile: {
              ...s.profile,
              selectedMoods,
              activeVibeTags: vibeTagsFromMoods(selectedMoods),
            },
          };
        }),

      setFreeText: (text) => set((s) => ({ profile: { ...s.profile, freeTextMood: text } })),

      setTradeChoice: (id, choice) =>
        set((s) => ({ tradeChoices: { ...s.tradeChoices, [id]: choice } })),

      recomputeWeights: () =>
        set((s) => ({
          profile: {
            ...s.profile,
            preferenceWeights: buildPreferenceWeights({
              selectedMoods: s.profile.selectedMoods,
              freeTextMood: s.profile.freeTextMood,
              tradeChoices: s.tradeChoices,
              frictionTolerance: s.profile.frictionTolerance,
            }),
            activeVibeTags: vibeTagsFromMoods(s.profile.selectedMoods),
            onboarded: true,
          },
        })),

      setWeights: (w) => set((s) => ({ profile: { ...s.profile, preferenceWeights: w } })),

      surpriseMe: () =>
        set((s) => {
          const selectedMoods: MoodId[] = [
            "beautiful-easy",
            "freedom-nightlife",
            "different-from-prague",
          ];
          return {
            profile: {
              ...s.profile,
              selectedMoods,
              preferenceWeights: buildPreferenceWeights({ selectedMoods }),
              activeVibeTags: ["Surprise me", "Balanced", "Nightlife", "Beautiful"],
              onboarded: true,
            },
          };
        }),

      resetProfile: () => set({ profile: defaultProfile(), tradeChoices: {} }),

      toggleCompare: (id) =>
        set((s) => {
          const has = s.profile.selectedDestinations.includes(id);
          const selectedDestinations = has
            ? s.profile.selectedDestinations.filter((d) => d !== id)
            : [...s.profile.selectedDestinations, id].slice(-4);
          return { profile: { ...s.profile, selectedDestinations } };
        }),

      clearCompare: () =>
        set((s) => ({ profile: { ...s.profile, selectedDestinations: [] } })),

      setCompare: (ids) =>
        set((s) => ({ profile: { ...s.profile, selectedDestinations: ids.slice(0, 4) } })),

      toggleSimHotspot: (id) =>
        set((s) => {
          const has = s.profile.selectedHotspotsForSimulation.includes(id);
          const selectedHotspotsForSimulation = has
            ? s.profile.selectedHotspotsForSimulation.filter((h) => h !== id)
            : [...s.profile.selectedHotspotsForSimulation, id];
          return { profile: { ...s.profile, selectedHotspotsForSimulation } };
        }),

      setLens: (lens) => set((s) => ({ profile: { ...s.profile, selectedLens: lens } })),
      setPortalMode: (mode) =>
        set((s) => ({ profile: { ...s.profile, selectedPortalMode: mode } })),
      setSoundscape: (mode) =>
        set((s) => ({ profile: { ...s.profile, soundscapePreference: mode } })),

      saveTrip: (trip) =>
        set((s) => {
          const without = s.savedTrips.filter((t) => t.destinationId !== trip.destinationId);
          return { savedTrips: [trip, ...without] };
        }),
      removeTrip: (id) => set((s) => ({ savedTrips: s.savedTrips.filter((t) => t.id !== id) })),

      saveComparison: (c) =>
        set((s) => ({ savedComparisons: [c, ...s.savedComparisons].slice(0, 12) })),
      removeComparison: (id) =>
        set((s) => ({ savedComparisons: s.savedComparisons.filter((c) => c.id !== id) })),

      saveSimulation: (sim) =>
        set((s) => {
          const without = s.savedSimulations.filter((x) => x.destinationId !== sim.destinationId);
          return { savedSimulations: [sim, ...without] };
        }),

      saveRoute: (r) => set((s) => ({ savedRoutes: [r, ...s.savedRoutes].slice(0, 12) })),
      removeRoute: (id) => set((s) => ({ savedRoutes: s.savedRoutes.filter((r) => r.id !== id) })),

      addTrustReport: (r) => set((s) => ({ trustReports: [r, ...s.trustReports] })),

      setLanguage: (lng) => set({ language: lng }),

      showToast: (message, tone = "default") =>
        set({ toast: { id: ++toastSeq, message, tone } }),
      clearToast: () => set({ toast: null }),
    }),
    {
      name: "eurovibe-store",
      partialize: (s) => ({
        profile: s.profile,
        language: s.language,
        tradeChoices: s.tradeChoices,
        savedTrips: s.savedTrips,
        savedComparisons: s.savedComparisons,
        savedSimulations: s.savedSimulations,
        savedRoutes: s.savedRoutes,
        trustReports: s.trustReports,
      }),
    },
  ),
);

/** Selector hook for the live preference weights. */
export const useWeights = () => useEurovibeStore((s) => s.profile.preferenceWeights);
