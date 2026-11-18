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
        lime: {
          DEFAULT: "#B8D94B",
          50: "#F7FBEA",
          100: "#EDF7CF",
          200: "#DCEFA2",
          300: "#CBE774",
          400: "#B8D94B", // Primary Lime
          500: "#9FC431",
          600: "#7C9C22",
          700: "#5D7619",
          800: "#3F5011",
          900: "#222C09",
        },
        ivory: {
          DEFAULT: "#F8F9E9",
          50: "#FCFDF5",
          100: "#F8F9E9", // Ivory Background
          200: "#EDF0C9",
          300: "#E2E7A9",
        },
        olive: {
          DEFAULT: "#52642A", // Olive Green
          50: "#F4F6EF",
          100: "#E3E8D7",
          200: "#C5D0AD",
          300: "#A7B883",
          400: "#89A059",
          500: "#6B8437",
          600: "#52642A", // Headings & active nav
          700: "#3C491F",
          800: "#262E13",
          900: "#101308",
        },
        dark: {
          DEFAULT: "#26321A", // Dark readable text
          muted: "#4F5E40",
          light: "#788769",
        },
        surface: {
          white: "#FFFFFF",
          grey: "#F3F4F6",
          border: "#E5E7EB",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-cabinet)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        premium: "0 10px 30px -5px rgba(38, 50, 26, 0.06)",
        card: "0 4px 20px -2px rgba(38, 50, 26, 0.05)",
        floating: "0 20px 40px -10px rgba(82, 100, 42, 0.15)",
      },
    },
  },
  plugins: [],
};

export default config;

