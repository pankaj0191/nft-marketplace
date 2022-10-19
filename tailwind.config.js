module.exports = {
  experimental: {
    darkModeVariant: true
  },
  dark: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  scripts: {
    "test": "jest --env=jsdom"
  },
  plugins: [
    require('@themesberg/flowbite/plugin'),

    function ({ addComponents }) {
      addComponents({
        '.container': {
          maxWidth: '100%',
          padding: '10px',
          '@screen sm': {
            maxWidth: '640px',
            width: '90%',
          },
          '@screen md': {
            maxWidth: '768px',
            width: '97%',
          },
          '@screen lg': {
            maxWidth: '1140px',
            width: '90%',
          },
          '@screen xl': {
            maxWidth: '1140px',
          },
        }
      })
    }
  ],
}