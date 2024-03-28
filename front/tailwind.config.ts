import { nextui } from "@nextui-org/react";

import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{html,js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      boxShadow: {
        "custom-light":
          "0px 50px 100px -20px rgba(50, 50, 93, 0.25), 0px 30px 60px -30px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
} satisfies Config;
