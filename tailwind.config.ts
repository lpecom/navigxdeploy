import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
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
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#00B2FF", // Navig bright blue
          50: '#E6F7FF',
          100: '#CCF0FF',
          200: '#99E0FF',
          300: '#66D1FF',
          400: '#33C1FF',
          500: '#00B2FF',
          600: '#008ECC',
          700: '#006B99',
          800: '#004766',
          900: '#002433',
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#1E3A8A", // Deep navy blue
          50: '#E6EBF4',
          100: '#CCD7E9',
          200: '#99AFD3',
          300: '#6687BD',
          400: '#335FA7',
          500: '#1E3A8A',
          600: '#182E6E',
          700: '#122353',
          800: '#0C1737',
          900: '#060C1C',
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F8FAFC", // Very light blue-gray
          foreground: "#475569",
        },
        accent: {
          DEFAULT: "#E0F2FF", // Light blue
          foreground: "#0A4B75",
        },
        success: {
          DEFAULT: "#10B981", // Green
          foreground: "#FFFFFF",
        },
        navig: {
          DEFAULT: "#00B2FF", // Bright blue from the Navig logo
          foreground: "#FFFFFF",
        }
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-sm': ['1.875rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'display-xs': ['1.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;