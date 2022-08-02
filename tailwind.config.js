/** @type {import('tailwindcss').Config} */

// const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './pages/**/*.{html,js,jsx}',
    './components/**/*.{html,js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          default: "#c1ac95",
          50: "#f8f6f4",
          100: "#f2eee9",
          200: "#e6ddd4",
          300: "#d9cdbf",
          400: "#cdbcaa",
          500: "#c1ac95",
          600: "#9a8977",
          700: "#736759",
          800: "#4d443b",
          900: "#26221d",
        },
        olive: {
          default: "#7e8f72",
          50: "#f7faf5",
          100: "#f0f5ec",
          200: "#e1ebda",
          300: "#d2e1c7",
          400: "#c3d7b5",
          500: "#b5cda3",
          600: "#a2b892",
          700: "#7e8f72",
          750: "#6c7b61",
          800: "#5a6651",
          850: "#485241",
          900: "#363d30",
        }
      }
    },
  },
  plugins: [
    // require('@tailwindcss/forms'),
  ],
}
