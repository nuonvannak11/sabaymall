/** @type {import('tailwindcss').Config} */

module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        khmer: ["Khmer OS Battambang", "Khmer OS", "Khmer", "sans-serif"],
      },
      colors: {
        "t-text":"#98a0ae",
        "t-normal":"#9ba2ae",
        "b-bg":"#111826",
        "b-normal":"#1e2939",
      },
    },
  },
  plugins: [],
};
