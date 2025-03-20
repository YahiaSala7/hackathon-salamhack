/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/Components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        heading: "#0B132A",
        button: "#3878FF",
        text: "#4F5665",
        background: "#F8F9FE",
        success: "#28A745",
        error: "#FF4D4D",
      },
      fontFamily: {
        heading: ["rubik", "sans-serif"],
        text: ["inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
