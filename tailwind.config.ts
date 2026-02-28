import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "vet-blue": {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#bae0fd",
          300: "#7cc8fb",
          400: "#36a9f6",
          500: "#0c8ce9",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        "vet-green": {
          50: "#f0fdf4",
          100: "#dcfce7",
          600: "#16a34a",
          800: "#166534",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;