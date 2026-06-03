/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        mint: { 50: '#ECFDF3', 500: '#10B981', 600: '#059669' },
        coral: { DEFAULT: '#F87171', light: '#FEE2E2' },
        sun: { DEFAULT: '#FBBF24', light: '#FEF3C7' },
        ink: { DEFAULT: '#0F172A', muted: '#475569', faint: '#94A3B8' },
        surface: { DEFAULT: '#FFFFFF', soft: '#F8FAFC', canvas: '#F1F5FF' },
      },
      fontFamily: {
        display: ['Sora', 'sans-serif'],
        sans: ['Noto Sans KR', 'Inter', 'sans-serif'],
        mono: ['Roboto Mono', 'monospace'],
      },
      boxShadow: {
        'q-xs': '0 1px 2px 0 rgba(15,23,42,.05)',
        'q-sm': '0 1px 3px 0 rgba(15,23,42,.10), 0 1px 2px -1px rgba(15,23,42,.06)',
        'q-md': '0 4px 6px -1px rgba(15,23,42,.08), 0 2px 4px -2px rgba(15,23,42,.05)',
        'q-lg': '0 10px 15px -3px rgba(15,23,42,.08), 0 4px 6px -4px rgba(15,23,42,.04)',
      },
      borderRadius: {
        'q': '1.25rem',
        'q-lg': '1.875rem',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
