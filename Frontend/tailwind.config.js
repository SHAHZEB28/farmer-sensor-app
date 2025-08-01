/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // Enable dark mode
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#4f46e5', // Indigo 600
          '500': '#6366f1',
          '600': '#4f46e5',
          '700': '#4338ca',
        },
        'secondary': '#10b981', // Emerald 500
        'accent': '#f59e0b',   // Amber 500
        // Light Mode Colors
        'neutral': {
          '50': '#f8fafc',
          '100': '#f1f5f9',
          '200': '#e2e8f0',
          '800': '#1e293b',
          '900': '#0f172a',
        },
        // Dark Mode Colors
        'dark': {
          'bg': '#1a202c',       // Dark background
          'card': '#2d3748',    // Dark card background
          'text': '#e2e8f0',     // Light text for dark bg
          'text-secondary': '#a0aec0', // Muted text
        }
      },
      // ... keep the rest of the theme extension ...
    },
  },
  plugins: [],
}
