/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0b0b1c',
          900: '#0d0d22',
          800: '#111136',
          700: '#16163a',
          600: '#2a2a55',
          500: '#3b3b7a',
        },
        accent: {
          gold: '#ffe08a',
          steel: '#5b9dff',
          resonance: '#b86dd6',
          rust: '#e05555',
          sutensai: '#b89555',
        },
      },
      fontFamily: {
        display: ['"Roboto Condensed"', 'system-ui', 'sans-serif'],
        body: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
