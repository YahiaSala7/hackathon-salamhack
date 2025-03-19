/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        colors: {
          heading: "#0B132A",
          button: "#3878FF",
          text: "#4F5665",
          background: "#F8F9FE",
          success: "#28A745",
          error: "#3878FF",
        },
      },
      fontFamily: {
        heading: ["var(--rubik)", "sans-serif"],
        text: ["var(--inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
