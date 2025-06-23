import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        'brand-background': '#B6D7A8',
        'brand-surface': '#FFFFFF',    // White for cards
        'brand-primary': '#6D83F2',   // Soft purple/blue
        'brand-secondary': '#A8B1E3', // Lighter purple/blue
        'brand-accent': '#F5A623',    // Muted orange for highlights
        'brand-text-primary': '#212529', // Dark gray for text
        'brand-text-secondary': '#495057', // Lighter gray for secondary text
        'brand-border': '#E9ECEF',   // Light border color
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
} 