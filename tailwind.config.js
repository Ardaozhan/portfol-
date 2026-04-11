/** @type {import('tailwindcss').Config} */
export default {
  // Scan all JS/JSX/TS/TSX files in src for class usage
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Custom design tokens for the portfolio
      colors: {
        // Deep premium dark palette
        void:    '#050505',
        surface: '#0a0a0a',
        muted:   '#1a1a1a',
        subtle:  '#2a2a2a',
        accent:  '#e8e8e8',
        highlight: '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  // Dark mode driven by class so Zustand `theme` state can toggle it
  darkMode: 'class',
  plugins: [],
};
