module.exports = {
    content: [
    './app/routes/**/*.{js,jsx,ts,tsx}', 
    '!./server/node_modules/**/*',
  ],
  theme: {
    extend: {
       fontFamily: {
        custom: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
  ],
};
