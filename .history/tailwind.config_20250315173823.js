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
        "heading-color": "#0B132A",
        "button-color": "#3878FF",
        "text-color": "#4F5665",
        "background-color": "#F0F4F8",
        "success-color": "#28A745",
        "errors-color": "#DC3545",
      },
      fontFamily: {
        heading: ["Rubik", "sans-serif"],
        text: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
