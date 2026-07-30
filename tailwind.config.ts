import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0B",       // near-black text
        paper: "#FFFFFF",     // white background
        line: "#E7E5E9",      // hairline borders
        mute: "#6B6874",      // secondary text (purple-tinted gray)
        accent: {
          DEFAULT: "#6D28D9", // primary purple (violet-700) — used sparingly
          soft: "#F4F0FC",    // faint purple tint for backgrounds/badges
          line: "#DCD1F5",    // faint purple border
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
};

export default config;
