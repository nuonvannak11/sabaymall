/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'khmer': ['Khmer OS Battambang', 'Khmer OS', 'Khmer', 'sans-serif'],
      },
      colors: {
        'brand-red': '#EF4444',
      },
    },
  },
  plugins: [],
} 