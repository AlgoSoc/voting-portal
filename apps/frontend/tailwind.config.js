/** @type {import('tailwindcss').Config} */
const sharedConfig = require('@repo/tailwind-config/tailwind.config.js');

module.exports = {
  ...sharedConfig,
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    // "../../packages/ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        branddark: 'var(--branddark)',
        brandlight: 'var(--brandlight)',
        brandyellow: 'var(--brandyellow)',
        brandgray: 'var(--brandgray)',
      },
      fontFamily: {
        outfit: ['"Outfit"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};