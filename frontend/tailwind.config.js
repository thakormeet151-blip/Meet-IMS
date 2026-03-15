/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff8ed',
          100: '#ffefd5',
          200: '#fddaaa',
          300: '#fbbc74',
          400: '#f89340',
          500: '#f5a623',
          600: '#e07d0a',
          700: '#ba5c0b',
          800: '#944811',
          900: '#783c12',
        },
        dark: {
          900: '#0d0d1a',
          800: '#13132b',
          700: '#1a1a35',
          600: '#22223f',
          500: '#2d2d52',
          400: '#3d3d6b',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(16px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      }
    },
  },
  plugins: [],
}
