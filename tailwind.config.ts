import type { Config } from "tailwindcss"
import { fontFamily } from "tailwindcss/defaultTheme"
import plugin from "tailwindcss/plugin"

function hslVariableWithOpacity(value: string) {
  return `hsl(var(${value}) / <alpha-value>)`
}

const config = {
  future: {
    hoverOnlyWhenSupported: true,
  },
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
      screens: {
        "3xl": "1700px",
        "4xl": "1900px",
      },
      fontFamily: {
        display: ["var(--font-fugaz)", ...fontFamily.sans],
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        dracula: "#282a36",
        border: hslVariableWithOpacity("--border"),
        input: hslVariableWithOpacity("--input"),
        ring: hslVariableWithOpacity("--ring"),
        background: hslVariableWithOpacity("--background"),
        foreground: hslVariableWithOpacity("--foreground"),
        primary: {
          DEFAULT: hslVariableWithOpacity("--primary"),
          foreground: hslVariableWithOpacity("--primary-foreground"),
        },
        secondary: {
          DEFAULT: hslVariableWithOpacity("--secondary"),
          foreground: hslVariableWithOpacity("--secondary-foreground"),
        },
        destructive: {
          DEFAULT: hslVariableWithOpacity("--destructive"),
          foreground: hslVariableWithOpacity("--destructive-foreground"),
        },
        muted: {
          DEFAULT: hslVariableWithOpacity("--muted"),
          foreground: hslVariableWithOpacity("--muted-foreground"),
        },
        accent: {
          DEFAULT: hslVariableWithOpacity("--accent"),
          foreground: hslVariableWithOpacity("--accent-foreground"),
        },
        popover: {
          DEFAULT: hslVariableWithOpacity("--popover"),
          foreground: hslVariableWithOpacity("--popover-foreground"),
        },
        card: {
          DEFAULT: hslVariableWithOpacity("--card"),
          foreground: hslVariableWithOpacity("--card-foreground"),
          lighter: hslVariableWithOpacity("--card-lighter"),
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      blur: {
        xs: "2px",
        xxs: "1px",
      },
    },
    keyframes: {
      spin: {
        from: { rotate: "0deg" },
        to: { rotate: "360deg" },
      },
    },
  },
  plugins: [
    require("@tailwindcss/container-queries"),
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    plugin(({ matchUtilities, addUtilities, theme }) => {
      matchUtilities<string>(
        {
          sq: (value) => ({
            width: value,
            height: value,
          }),
        },
        {
          values: theme("width"),
        },
      )

      addUtilities({
        ".no-scrollbar": {
          /* Hide scrollbar - Styles in global.css */
        },
      })
    }),
  ],
} satisfies Config

export default config
