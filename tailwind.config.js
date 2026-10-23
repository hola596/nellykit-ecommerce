/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: '#08080a',
        onyx: '#0f1015',
        carbon: '#16181f',
        graphite: '#22242c',
        slate: '#2e313b',
        ash: '#636777',
        fog: '#9ea2b3',
        mist: '#b8bcc9',
        silver: '#d6d8e1',
        bone: '#f1f2f6',
        paper: '#ffffff',
        copper: {
          DEFAULT: '#cc9166',
          light: '#e0aa82',
          dark: '#a86f45',
        },
        brand: {
          red: '#e53935',
          'red-dark': '#c62828',
          'red-light': '#ff5252',
        },
        gilded: '#ae9357',
      },
      fontFamily: {
        serif: ['var(--font-playfair)', 'Playfair Display', 'Ivy Presto', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-copper': '0 0 20px -3px rgba(204, 145, 102, 0.35)',
        'glow-red': '0 0 20px -3px rgba(229, 57, 53, 0.4)',
        'luxury': '0 10px 30px -5px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06)',
        'luxury-light': '0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};
