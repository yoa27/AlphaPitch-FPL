/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#0b0e14",
        "on-background": "#d3e4fe",
        surface: "#151d28",
        "on-surface": "#d3e4fe",
        "on-surface-variant": "#bbcabf",
        "surface-variant": "#26364a",
        "surface-container-lowest": "#0b0e14",
        "surface-container-low": "#0b1c30",
        "surface-container": "#102034",
        "surface-container-high": "#1b2b3f",
        "surface-container-highest": "#26364a",
        "surface-bright": "#2a3a4f",
        "surface-dim": "#031427",
        primary: "#10b981", // Emerald Green
        "primary-glow": "#4edea3",
        "primary-container": "#00422b",
        "on-primary": "#003824",
        secondary: "#f43f5e", // Rose Red
        "secondary-glow": "#ffb2b7",
        "secondary-container": "#b50036",
        "on-secondary": "#67001b",
        tertiary: "#06b6d4", // Electric Cyan
        "tertiary-glow": "#4cd7f6",
        "tertiary-container": "#003f4b",
        "on-tertiary": "#001f26",
        outline: "#64748b",
        "outline-variant": "#3c4a42",
        error: "#ffb4ab",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Geist", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px"
      },
      spacing: {
        unit: "4px",
        margin: "16px",
        gutter: "12px"
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ticker': 'ticker 35s linear infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translate3d(0, 0, 0)' },
          '100%': { transform: 'translate3d(-50%, 0, 0)' },
        }
      }
    },
  },
  plugins: [],
}
