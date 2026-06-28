import { createBrowserRouter, Outlet, ScrollRestoration } from "react-router-dom";
import { AppShell } from "./components/shell/AppShell";

// Onboarding
import WelcomePage from "./pages/WelcomePage";
import TripMoodPage from "./pages/TripMoodPage";
import RealityBoundariesPage from "./pages/RealityBoundariesPage";
import TradeoffPage from "./pages/TradeoffPage";
import TripProfileSummaryPage from "./pages/TripProfileSummaryPage";

// Discovery
import DesireMapPage from "./pages/DesireMapPage";
import ExperienceWorldsPage from "./pages/ExperienceWorldsPage";
import DestinationDeckPage from "./pages/DestinationDeckPage";
import DestinationDeepCardPage from "./pages/DestinationDeepCardPage";

// Portal
import AtmospherePreviewPage from "./pages/AtmospherePreviewPage";
import PortalPage from "./pages/PortalPage";

// Decision tools
import SimulationPage from "./pages/SimulationPage";
import SimulateEntryPage from "./pages/SimulateEntryPage";
import ComparePage from "./pages/ComparePage";
import DecisionCheckPage from "./pages/DecisionCheckPage";

// Persistence
import SavedTripsPage from "./pages/SavedTripsPage";
import RouteBuilderPage from "./pages/RouteBuilderPage";

// Back office
import AdminPage from "./pages/AdminPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import MethodologyPage from "./pages/MethodologyPage";
import NotFoundPage from "./pages/NotFoundPage";

/** Wraps children in the editorial app shell + scroll restoration. */
function ShellLayout() {
  return (
    <AppShell>
      <ScrollRestoration />
      <Outlet />
    </AppShell>
  );
}

/** Full-bleed layout (no shell) for cinematic portal + atmosphere screens. */
function BareLayout() {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}

export const router = createBrowserRouter([
  {
    element: <ShellLayout />,
    children: [
      { path: "/", element: <WelcomePage /> },
      { path: "/mood", element: <TripMoodPage /> },
      { path: "/boundaries", element: <RealityBoundariesPage /> },
      { path: "/tradeoffs", element: <TradeoffPage /> },
      { path: "/profile-summary", element: <TripProfileSummaryPage /> },
      { path: "/map", element: <DesireMapPage /> },
      { path: "/worlds", element: <ExperienceWorldsPage /> },
      { path: "/discover", element: <DestinationDeckPage /> },
      { path: "/destination/:id", element: <DestinationDeepCardPage /> },
      { path: "/destination/:id/simulate", element: <SimulationPage /> },
      { path: "/destination/:id/decision", element: <DecisionCheckPage /> },
      { path: "/simulate", element: <SimulateEntryPage /> },
      { path: "/compare", element: <ComparePage /> },
      { path: "/saved", element: <SavedTripsPage /> },
      { path: "/route", element: <RouteBuilderPage /> },
      { path: "/admin", element: <AdminPage /> },
      { path: "/reports", element: <ReportsPage /> },
      { path: "/methodology", element: <MethodologyPage /> },
      { path: "/settings", element: <SettingsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    element: <BareLayout />,
    children: [
      { path: "/destination/:id/atmosphere", element: <AtmospherePreviewPage /> },
      { path: "/destination/:id/portal", element: <PortalPage /> },
    ],
  },
], {
  // Matches Vite's `base`: "/" locally / Netlify / Vercel, "/-" on GitHub Pages.
  basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/",
});
