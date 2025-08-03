/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': {
          DEFAULT: '#4f46e5',
          '500': '#6366f1',
          '600': '#4f46e5',
          '700': '#4338ca',
        },
        'secondary': '#10b981', 
        'accent': '#f59e0b',  
        
        'neutral': {
          '50': '#f8fafc',
          '100': '#f1f5f9',
          '200': '#e2e8f0',
          '800': '#1e293b',
          '900': '#0f172a',
        },
        
        'dark': {
          'bg': '#1a202c',      
          'card': '#2d3748',    
          'text': '#e2e8f0',    
          'text-secondary': '#a0aec0', 
        }
      },
      
    },
  },
  plugins: [],
}
