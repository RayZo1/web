/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'accent-color': '#0066FF',
        'accent-secondary': '#00D1FF',
        'bg-dark': '#050505',
        'card-bg': 'rgba(255, 255, 255, 0.03)',
        'text-secondary': '#A1A1A1',
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};
