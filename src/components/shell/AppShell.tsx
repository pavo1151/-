import { type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HelpCircle, MoreHorizontal } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { ProfileDropdown } from "./ProfileDropdown";
import { NAV_ITEMS, isNavActive } from "./nav";
import { cn } from "@/lib/format";

/**
 * Main editorial app shell: top nav (desktop) + collapsible sidebar + mobile bottom nav.
 * Portal / Atmosphere screens render full-bleed and opt out of this shell.
 */
export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-ivory-gradient">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      {/* Top navigation */}
      <header className="sticky top-0 z-40 border-b border-ink/5 bg-ivory/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" aria-label="Eurovibe home">
            <Wordmark />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isNavActive(item, location.pathname);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    active ? "text-ink-700" : "text-ink-400 hover:text-ink-600",
                  )}
                >
                  {item.label}
                  {active && (
                    <span className="absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full bg-coral" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/admin")}
              className="hidden lg:inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-ink-400 hover:bg-ink/5"
              title="Data console"
            >
              <HelpCircle className="h-4 w-4" /> Console
            </button>
            <ProfileDropdown />
          </div>
        </div>
      </header>

      {/* Page content */}
      <main id="main-content" className="pb-24 md:pb-10">
        {children}
      </main>

      {/* Mobile bottom navigation */}
      <MobileBottomNav />
    </div>
  );
}

function MobileBottomNav() {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-ink/5 bg-white/90 backdrop-blur-xl pb-safe">
      <div className="flex items-stretch justify-around px-1">
        {NAV_ITEMS.map((item) => {
          const active = isNavActive(item, location.pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium transition-colors",
                active ? "text-coral-600" : "text-ink-400",
              )}
            >
              <Icon className={cn("h-5 w-5", active && "fill-coral-100")} />
              {item.label}
            </Link>
          );
        })}
        <button
          onClick={() => navigate("/settings")}
          className="flex flex-1 flex-col items-center gap-0.5 py-2.5 text-[11px] font-medium text-ink-400"
        >
          <MoreHorizontal className="h-5 w-5" />
          More
        </button>
      </div>
    </nav>
  );
}
