/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['selector','[data-color-mode="dark"]'],
  theme: {
    extend: {
      colors: {
        // Aurora主题色系
        'theme': {
          DEFAULT: '#e93796',
          'hover': '#d12a7f',
          'active': '#b91d68',
          'light': '#0fb6d6',
          'dark': '#0fb6d6',
        },
        'accent': {
          'light': '#e93796',
          'dark': '#0fb6d6',
        },
        'sub-accent': {
          'light': '#547ce7',
          'dark': '#f4569d',
        },
        // 背景色系
        'background': {
          'primary-light': '#f1f3f9',
          'primary-dark': '#1a1a1a',
          'secondary-light': '#ffffff',
          'secondary-dark': '#212121',
          'light': '#f1f3f9',
          'dark': '#1a1a1a',
        },
        // 文本色系
        'text': {
          'bright-light': '#000000',
          'bright-dark': '#ffffff',
          'normal-light': '#333333',
          'normal-dark': '#bebebe',
          'dim-light': '#858585',
          'dim-dark': '#6d6d6d',
          'faint-light': '#b2b2b2',
          'faint-dark': '#7aa2f7',
        },
        'dark': "#333333",
        // Aurora渐变色
        'gradient': {
          'start': '#24c6dc',
          'mid': '#5433ff',
          'end': '#ff0099',
        }
      },
      backgroundImage: {
        'main-gradient': 'linear-gradient(130deg, #24c6dc, #5433ff 41.07%, #ff0099 76.05%)',
        'strong-gradient-light': 'linear-gradient(62deg, #188bfd 0%, #a03bff 100%)',
        'strong-gradient-dark': 'linear-gradient(62deg, #87c2fd 0%, #dcb9fc 100%)',
      },
      boxShadow: {
        'aurora': '0 20px 25px -5px rgba(232, 57, 255, 0.06), 0 10px 10px -5px rgba(53, 11, 59, 0.1)',
        'aurora-dark': '0 20px 25px -5px rgba(11, 42, 59, 0.35), 0 10px 10px -5px rgba(11, 42, 59, 0.14)',
      },
      transitionProperty: {
        'height': 'height',
        'width': 'width',
        'spacing': 'margin, padding',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
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
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

