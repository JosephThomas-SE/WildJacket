import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          950: '#020617',
          900: '#08101f',
          800: '#111827',
        },
        // Eco-tourism color palette
        forest: {
          50: '#f0f9f4',
          100: '#dcf2e5',
          200: '#bae6cc',
          300: '#7dd3a8',
          400: '#4dbe8a',
          500: '#2aa170',
          600: '#1d8156',
          700: '#176446',
          800: '#145039',
          900: '#0f3f2e',
        },
        earth: {
          50: '#faf7f0',
          100: '#f2ead9',
          200: '#e5d4b3',
          300: '#d3b787',
          400: '#c29b63',
          500: '#b18247',
          600: '#9c6f3c',
          700: '#7d5730',
          800: '#65462a',
          900: '#533924',
        },
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        luxury: {
          gold: '#d4af37',
          silver: '#c0c0c0',
          bronze: '#cd7f32',
        },
      },
      boxShadow: {
        soft: '0 24px 120px rgba(15, 23, 42, 0.35)',
        glass: '0 8px 32px rgba(31, 38, 135, 0.37)',
        'glass-sm': '0 4px 16px rgba(31, 38, 135, 0.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
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
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
      },
      backgroundImage: {
        'mountain-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'forest-texture': 'url("/images/forest-texture.jpg")',
      },
    },
  },
  plugins: [],
};

export default config;
