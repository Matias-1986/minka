/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./backoffice.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark-bg': '#1a1a1a',
        'card-bg': '#242424',
        'accent-green': '#72c56a',
      },
      fontFamily: {
        sans: ['Instrument Sans Variable', 'Instrument Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

