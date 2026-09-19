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
          50: '#f0f3ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#5865F2', // Signature SnapClass Indigo
          600: '#4752c4',
          700: '#3c45a5',
          800: '#323989',
          900: '#2c3270',
        },
        accent: {
          pink: '#EB459E',
          cyan: '#06B6D4',
          emerald: '#10B981',
          amber: '#F59E0B',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif'],
        display: ['Climate Crisis', 'Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
