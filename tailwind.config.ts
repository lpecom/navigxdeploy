import type { Config } from "tailwindcss";

const colors = {
  primary: {
    DEFAULT: "#2563EB",
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#2563EB',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
    foreground: "#FFFFFF",
  },
  secondary: {
    DEFAULT: "#0F172A",
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    foreground: "#FFFFFF",
  }
};

const config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        ...colors,
        border: {
          DEFAULT: "hsl(var(--border))",
          dark: "#1E293B",
        },
        background: {
          DEFAULT: "hsl(var(--background))",
          dark: "#0F172A",
        },
        foreground: {
          DEFAULT: "hsl(var(--foreground))",
          dark: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F8FAFC",
          foreground: "#475569",
        },
        accent: {
          DEFAULT: "#F0F9FF",
          foreground: "#0369A1",
        },
        success: {
          DEFAULT: "#10B981",
          foreground: "#FFFFFF",
        },
        navig: colors.primary,
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;