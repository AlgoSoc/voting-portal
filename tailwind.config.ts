import type { Config } from 'tailwindcss';

export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
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
} satisfies Config;
