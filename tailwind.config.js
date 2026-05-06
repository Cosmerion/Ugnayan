/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'baro-brown':    '#6B3F1F',
        'baro-gold':     '#C8922A',
        'baro-cream':    '#F5ECD7',
        'baro-amber':    '#E8B86D',
        'baro-bark':     '#3D1F0A',
        'baro-sage':     '#7A8C6E',
        'baro-yellow':   '#D4A017',
        'baro-terra':    '#B85C38',
        'baro-offwhite': '#FAF6EE',
      },
      fontFamily: {
        display:  ['Playfair Display', 'Georgia', 'serif'],
        body:     ['Inter', 'system-ui', 'sans-serif'],
        baybayin: ['Noto Sans Tagalog', 'serif'],
      },
    },
  },
  plugins: [],
}
