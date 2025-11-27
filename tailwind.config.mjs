/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        bg: "#0a0b0f",
        panel: "#11131a",
        panel2: "#151824",
        accent: "#7c5cff",
        good: "#21d07a",
        warn: "#f7b733"
      }
    }
  },
  plugins: []
};
