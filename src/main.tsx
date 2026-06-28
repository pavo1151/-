import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { router } from "./router";
import { ToastHost } from "./components/ui/Toast";
import i18n, { applyDirection } from "./i18n";
import { useEurovibeStore } from "./store/useEurovibeStore";
import "./index.css";

/** Keeps i18next + <html dir/lang> in sync with the stored language. */
function I18nController({ children }: { children: React.ReactNode }) {
  const language = useEurovibeStore((s) => s.language);
  useEffect(() => {
    i18n.changeLanguage(language);
    applyDirection(language);
  }, [language]);
  return <>{children}</>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <I18nController>
        <RouterProvider router={router} />
        <ToastHost />
      </I18nController>
    </HelmetProvider>
  </React.StrictMode>,
);
