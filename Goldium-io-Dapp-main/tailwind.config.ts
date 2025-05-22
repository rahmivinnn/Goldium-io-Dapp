import type { Config } from "tailwindcss"
const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        gold: {
          50: "#FFF9E6",
          100: "#FFF3CC",
          200: "#FFE799",
          300: "#FFDB66",
          400: "#FFCF33",
          500: "#F5C400", // Primary gold
          600: "#D6AB00",
          700: "#B38F00",
          800: "#8F7200",
          900: "#6C5600",
        },
        dark: {
          100: "#1E1E1E",
          200: "#181818",
          300: "#141414",
          400: "#121212", // Primary dark background
          500: "#0F0F0F",
          600: "#0C0C0C",
          700: "#0A0A0A",
          800: "#080808",
          900: "#050505",
        },
        rarity: {
          common: "#9CA3AF",
          uncommon: "#10B981",
          rare: "#F5C400", // Changed from blue to gold
          epic: "#8B5CF6",
          legendary: "#F5C400",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        orbitron: ["var(--font-orbitron)"],
        serif: ["var(--font-cinzel)", "serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(to right, #D6AB00, #F5C400, #D6AB00)",
        "dark-gradient": "linear-gradient(to bottom, #1E1E1E, #0A0A0A)",
        "card-gradient": "linear-gradient(to bottom, rgba(30, 30, 30, 0.8), rgba(10, 10, 10, 0.9))",
      },
      boxShadow: {
        gold: "0 0 15px rgba(245, 196, 0, 0.3)",
        "gold-lg": "0 0 30px rgba(245, 196, 0, 0.4)",
      },
      animation: {
        "pulse-gold": "pulse-gold 2s infinite",
        float: "float 3s ease-in-out infinite",
        shine: "shine 2s infinite",
        glow: "glow 2s infinite",
      },
      keyframes: {
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(245, 196, 0, 0.4)" },
          "50%": { boxShadow: "0 0 0 10px rgba(245, 196, 0, 0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shine: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(245, 196, 0, 0.3)" },
          "50%": { boxShadow: "0 0 20px rgba(245, 196, 0, 0.6)" },
          "100%": { boxShadow: "0 0 5px rgba(245, 196, 0, 0.3)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

export default config
