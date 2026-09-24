import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#070B12",
        foreground: "#F3F4F6",
        green: "#00BF4D",
        brand: {
          blue: "#3B82F6",
          blueHover: "#2563EB",
          green: "#00BF4D",
          greenHover: "#059669",
          dark: "#080D18",
          card: "#0D1424",
          cardBorder: "rgba(255, 255, 255, 0.08)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        poppins: ["var(--font-poppins)", "sans-serif"],
      },
      boxShadow: {
        'glow-green': '0 0 25px -5px rgba(0, 220, 130, 0.4)',
        'glow-blue': '0 0 25px -5px rgba(59, 130, 246, 0.4)',
        'card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
    },
  },
  plugins: [],
};
export default config;
