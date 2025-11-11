/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/container/**/*.{js,ts,jsx,tsx}',
    './src/views/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // 기본 프로젝트 색상
        'primary-1': '#27374D',
        'primary-2': '#526D82',
        'primary-3': '#9DB2BF',
        'primary-4': '#e0e7ec',
        'white-1': '#ffffff',
        'white-2': '#dddddd',
        'white-3': '#f2f3f4',
        'black-1': '#000000',
        'black-2': '#333333',
        'shadow-1': '#eeeeee',
        'shadow-2': '#dddddd',
        'shadow-3': '#838383',
        // 포켓몬 타입 색상들
        'type-normal': '#A8A878',
        'type-fire': '#F08030',
        'type-water': '#6890F0',
        'type-electric': '#F8D030',
        'type-grass': '#78C850',
        'type-ice': '#98D8D8',
        'type-fighting': '#C03028',
        'type-poison': '#A040A0',
        'type-ground': '#E0C068',
        'type-flying': '#A890F0',
        'type-psychic': '#F85888',
        'type-bug': '#A8B820',
        'type-rock': '#a0783f',
        'type-ghost': '#705898',
        'type-dragon': '#7038F8',
        'type-dark': '#705848',
        'type-steel': '#B8B8D0',
        'type-fairy': '#EE99AC',
      },
      spacing: {
        30: '7.5rem', // 120px
        128: '32rem', // 512px
      },
      screens: {
        mobile: { max: '768px' },
        desktop: { min: '769px' },
        'desktop-890': { max: '890px' },
        'desktop-639': { max: '639px' },
      },
      keyframes: {
        'slide-in': {
          '0%': {
            right: '-12rem',
          },
          '100%': {
            right: '0',
          },
        },
        'slide-out': {
          '0%': {
            right: '0',
          },
          '100%': {
            right: '-12rem',
          },
        },
        fadeIn: {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        scaleIn: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.9)',
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
        shake: {
          '0%, 100%': {
            transform: 'translateX(0)',
          },
          '25%': {
            transform: 'translateX(-10px)',
          },
          '75%': {
            transform: 'translateX(10px)',
          },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-in-out',
        scaleIn: 'scaleIn 0.3s ease-out',
        shake: 'shake 0.5s ease-in-out',
      },
    },
  },
  safelist: [
    {
      pattern:
        /chip-type-(normal|fire|water|grass|electric|ice|fighting|poison|ground|flying|psychic|bug|rock|ghost|dragon|dark|steel|fairy)/,
    },
  ],
  plugins: [],
}
