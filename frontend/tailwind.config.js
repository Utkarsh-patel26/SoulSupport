/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-alt': 'var(--surface-alt)',
        border: 'var(--border)',

        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          soft: 'var(--primary-soft)',
          50: '#DEEEF3',
          100: 'var(--primary-soft)',
          500: 'var(--primary)',
          600: 'var(--primary)',
          700: 'var(--primary-hover)',
          900: '#0F2A34',
        },

        // Text Colors
        foreground: 'var(--text-main)',
        charcoal: '#1F2937',
        'text-secondary': 'var(--text-secondary)',
        'text-muted': 'var(--text-muted)',
        'text-inverse': 'var(--text-inverse)',

        // Brand Accent
        accent: 'var(--accent)',
        sage: { DEFAULT: '#6FAF8F', 50: '#EDF6F1', 100: '#D5EBDF', 600: '#5A9A78' },
        'soft-blue': { DEFAULT: '#4C6FFF', 50: '#EEF1FF', 100: '#D9DFFF', 600: '#3B5CE0' },
        lavender: { DEFAULT: '#9C8CF1', 50: '#F1EFFE', 100: '#E2DCFD', 600: '#7E6DD4' },
        coral: { DEFAULT: '#F08A7E', 50: '#FEF0EE', 100: '#FDDDD9', 600: '#D97064' },
      },
      borderRadius: {
        'xl': 'calc(var(--radius) - 4px)',
        '2xl': 'var(--radius)',
        '3xl': 'calc(var(--radius) + 6px)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
        heading: ['var(--font-heading)', 'Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'blob': 'blob 7s infinite',
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};
