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
        cream: "#F5F0E8",
        espresso: "#2C1810",
        walnut: "#5C4033",
        amber: "#C4841D",
        // Accent for dark backgrounds — the hero's scrimmed frames and espresso
        // surfaces. #C4841D reads 2.94:1 on the lightest hero frame; this clears
        // 4.5:1 on all of them. Keep in sync with --color-amber-light.
        "amber-light": "#E6B863",
        latte: "#D4C4A8",
        foam: "#FAF6F0",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
