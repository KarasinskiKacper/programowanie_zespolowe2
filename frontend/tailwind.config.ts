import type { Config } from "tailwindcss";

const config:Config = {
  content: [
    "./**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        x: "red",
        brand: {
          primary: "#6D66D23",
          secondary: "#ACD266",
        },
      },
    },
  },
  plugins: [],
};

export default config;
