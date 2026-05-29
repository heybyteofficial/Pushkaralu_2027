/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#ebf0ff',
          200: '#dbe3ff',
          300: '#b8c7ff',
          400: '#8ca1ff',
          500: '#5c73f7',
          600: '#4653eb',
          700: '#3840d6',
          800: '#2e33ad',
          900: '#2b2e8a',
          950: '#1a1b54',
        },
      },
    },
  },
  plugins: [],
}
