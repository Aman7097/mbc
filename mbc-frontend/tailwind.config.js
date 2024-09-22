/** @type {import('tailwindcss').Config} */

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "",
        background: "var(--main-bg)",
        dark: {
          primary: "",
        },
      },
      backgroundImage: {
        "main-gradient": "var(--main-gradient)",
      },
    },
  },
  plugins: [],
};
