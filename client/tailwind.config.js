/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
      extend: {
        colors: {
          primary: { 400: '#4ade80', 500: '#22c55e', 600: '#16a34a' },
          dark: { 100: '#0a0a0a', 200: '#111111', 300: '#1a1a1a', 400: '#222222' }
        },
        fontFamily: { inter: ['Inter', 'sans-serif'] },
        animation: {
          'fade-in': 'fadeIn 0.5s ease-out',
          'slide-up': 'slideUp 0.4s ease-out',
          'glow': 'glow 2s ease-in-out infinite',
          'float': 'float 6s ease-in-out infinite',
        },
        keyframes: {
          fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
          slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
          glow: { '0%,100%': { boxShadow: '0 0 5px rgba(34,197,94,0.3)' }, '50%': { boxShadow: '0 0 25px rgba(34,197,94,0.6)' } },
          float: { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        },
      },
    },
    plugins: [],
  }