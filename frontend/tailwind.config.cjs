/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
            DEFAULT: '#0284c7', // Primary Medical Blue
          },
          green: {
            50: '#ecfdf5',
            100: '#d1fae5',
            200: '#a7f3d0',
            300: '#6ee7b7',
            400: '#34d399',
            500: '#10b981',
            600: '#059669',
            700: '#047857',
            800: '#065f46',
            900: '#064e3b',
            DEFAULT: '#10b981', // Secondary Trust Green
          },
          teal: {
            DEFAULT: '#0b8494',
            light: '#e6f3f5'
          }
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(2, 132, 199, 0.08), 0 2px 10px -1px rgba(16, 185, 129, 0.04)',
        'premium-hover': '0 10px 30px -5px rgba(2, 132, 199, 0.15), 0 5px 15px -3px rgba(16, 185, 129, 0.08)',
      }
    },
  },
  plugins: [],
}
