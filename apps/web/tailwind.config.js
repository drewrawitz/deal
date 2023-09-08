import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        body: "#333",
        orange: {
          DEFAULT: "#EF5B24",
          dark: "#da4710",
        },
      },
    },
  },
  plugins: [forms],
};
