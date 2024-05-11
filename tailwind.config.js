/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./node_modules/flowbite/**/*.js"],
  darkMode: "media",
  theme: {
    extend: {
      screens: {
        xss: "300px",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        fadeOut: {
          "0%": { opacity: 1 },
          "100%": { opacity: 0 },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out forwards",
        fadeOut: "fadeOut 0.5s ease-out forwards",
      },
    },
  },
  plugins: [
    require("flowbite/plugin")({
      charts: true,
      forms: true,
      tooltips: true,
    }),
  ],
};
