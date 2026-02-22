import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        wood: {
          primary: "#2E4A3E",
          secondary: "#8B6914",
          background: "#F5F0E8",
          accent: "#D4A84B",
          white: "#FEFDFB",
          text: "#1A1A1A",
          body: "#4A4A4A",
          muted: "#E8E3DB",
          deep: "#1A2E24",
        },
      },
      fontFamily: {
        serifKr: ["var(--font-noto-serif-kr)", "serif"],
        sansKr: ["var(--font-noto-sans-kr)", "sans-serif"],
      },
    },
  },
};

export default config;
