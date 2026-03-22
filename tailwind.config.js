/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#0e0e12',
          1: '#16161c',
          2: '#1e1e26',
          3: '#26262f',
        },
        accent: {
          DEFAULT: '#5865f2',
          hover: '#4752c4',
          muted: 'rgba(88,101,242,0.12)',
        },
        border: '#2e2e3a',
        muted: '#6b6b80',
        success: '#3ba55d',
        danger: '#ed4245',
        warning: '#faa61a',
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
