import type { Config } from "tailwindcss";

const colors = {
  primary: {
    DEFAULT: "#000000",
    50: '#f6f6f6',
    100: '#e7e7e7',
    200: '#d1d1d1',
    300: '#b0b0b0',
    400: '#888888',
    500: "#000000",
    600: "#000000",
    700: "#000000",
    800: "#000000",
    900: "#000000",
    foreground: "#FFFFFF",
  },
  secondary: {
    DEFAULT: "#171717",
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
    foreground: "#FFFFFF",
  }
};

export default {
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "#f5f5f5",
          foreground: "#737373",
        },
        accent: {
          DEFAULT: "#fafafa",
          foreground: "#171717",
        },
        success: {
          DEFAULT: "#16a34a",
          foreground: "#FFFFFF",
        },
        navig: colors.primary,
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
        display: ['Inter var', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['3rem', { lineHeight: '1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-sm': ['1.875rem', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-xs': ['1.5rem', { lineHeight: '1.1', letterSpacing: '-0.01em', fontWeight: '700' }],
      },
      borderRadius: {
        lg: "0px",
        md: "0px",
        sm: "0px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-down": {
          "0%": { opacity: "0", transform: "translateY(-20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-up": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
        "fade-down": "fade-down 0.5s ease-out",
        "scale-up": "scale-up 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;