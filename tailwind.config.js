/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        primaryRed: "#C8102E",
        brandNavy: "#0A2540",
        bgLight: "#FFFFFF",
        bgGray: "#F8FAFC",
        textDark: "#1E293B",
        textMuted: "#64748B"
      },
      fontFamily: {
        heading: ["Plus Jakarta Sans", "sans-serif"],
        sans: ["Inter", "sans-serif"]
      }
    }
  },
  plugins: []
};
