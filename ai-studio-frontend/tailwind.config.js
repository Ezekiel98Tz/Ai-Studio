/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#FFBF00', // Primary Yellow
        'primary-glow': '#FFD24C', // Yellow Glow
        background: '#000000', // Background Black
        dark: '#0D0D0D', // Dark
        'text-light': '#F5F5F5', // Text Light
        'text-muted': '#A6A6A6', // Muted Text
        secondary: '#1A1A1A', // Secondary
        accent: '#FFBF00', // Accent
        destructive: '#EF4444', // Destructive
        border: '#262626', // Border
        ring: '#FFBF00', // Ring
      },
    },
  },
  plugins: [],
};