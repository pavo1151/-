import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import he from "./he.json";

export type Language = "en" | "he";

export const RTL_LANGUAGES: Language[] = ["he"];
export const isRtl = (lng: string) => RTL_LANGUAGES.includes(lng as Language);

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    he: { translation: he },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  returnNull: false,
});

/** Apply <html dir/lang> for the chosen language. */
export function applyDirection(lng: Language) {
  const dir = isRtl(lng) ? "rtl" : "ltr";
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", lng);
}

export default i18n;
