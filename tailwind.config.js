/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(210, 80%, 50%)',
        accent: 'hsl(140, 70%, 45%)',
        border: 'hsl(210, 40%, 90%)',
        surface: 'hsl(0, 0%, 100%)',
        background: 'hsl(210, 36%, 96%)',
        'text-primary': 'hsl(210, 40%, 15%)',
        'text-secondary': 'hsl(210, 40%, 35%)',
        purple: {
          50: '#f5f3ff',
          100: '#ede9fe',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        }
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
      },
      boxShadow: {
        'card': '0 4px 12px hsla(210, 40%, 15%, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}