import type { Config } from "tailwindcss";

/**
 * Eurovibe design tokens.
 * Two worlds:
 *  - "editorial" (light premium): warm ivory, blue editorial type, peach/coral accents.
 *  - "cinematic" (dark portal): twilight, warm lamp glow, deep navy.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Light editorial palette
        ivory: {
          DEFAULT: "#FAF6F0",
          50: "#FEFCFA",
          100: "#FAF6F0",
          200: "#F3EBE0",
          300: "#ECE0D2",
        },
        ink: {
          DEFAULT: "#1E3A5F",
          900: "#16263D",
          700: "#1E3A5F",
          500: "#3C5A7C",
          400: "#5B7494",
          300: "#8AA0BC",
        },
        coral: {
          DEFAULT: "#F6885B",
          50: "#FEF1EA",
          100: "#FDE2D5",
          300: "#F8A981",
          500: "#F6885B",
          600: "#EE6E3C",
          700: "#D9551F",
        },
        peach: {
          DEFAULT: "#FBC8A6",
          100: "#FDE7D6",
          300: "#FBC8A6",
        },
        // Cinematic dark palette
        night: {
          DEFAULT: "#120E1F",
          950: "#0B0814",
          900: "#120E1F",
          800: "#1C1730",
          700: "#2A2342",
          600: "#3A3157",
        },
        twilight: {
          rose: "#E8967A",
          gold: "#F2B65A",
          violet: "#6E5A8F",
          plum: "#3B2A4A",
        },
        lamp: "#FFC979",
      },
      fontFamily: {
        editorial: ['"Fraunces"', "Georgia", "serif"],
        sans: [
          '"Plus Jakarta Sans"',
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
      },
      borderRadius: {
        xl2: "1.25rem",
        "3xl": "1.75rem",
        "4xl": "2.25rem",
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(30, 58, 95, 0.18)",
        card: "0 8px 30px -8px rgba(30, 58, 95, 0.14)",
        lift: "0 20px 60px -16px rgba(30, 58, 95, 0.28)",
        glow: "0 0 40px -4px rgba(246, 136, 91, 0.55)",
        lamp: "0 0 36px -2px rgba(255, 201, 121, 0.65)",
        sheet: "0 -20px 60px -20px rgba(0,0,0,0.55)",
      },
      backgroundImage: {
        "ivory-gradient":
          "radial-gradient(120% 120% at 0% 0%, #FEFCFA 0%, #FAF6F0 45%, #F3E9DC 100%)",
        "peach-gradient":
          "linear-gradient(135deg, #FDE7D6 0%, #FBC8A6 50%, #F8A981 100%)",
        "coral-gradient": "linear-gradient(135deg, #F8A981 0%, #F6885B 100%)",
        "twilight-gradient":
          "linear-gradient(180deg, #2A1B3D 0%, #4A2C46 35%, #8A4A4A 60%, #E8967A 100%)",
        "night-gradient":
          "radial-gradient(120% 90% at 50% 0%, #2A2342 0%, #120E1F 55%, #0B0814 100%)",
        "glass-sheen":
          "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-marker": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(1.12)", opacity: "0.85" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(255,201,121,0.45)" },
          "50%": { boxShadow: "0 0 24px 6px rgba(255,201,121,0.25)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        "pulse-marker": "pulse-marker 2.4s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2.8s ease-in-out infinite",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
