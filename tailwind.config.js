/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      maxWidth: {
        '8xl': '90rem',
      },
      fontFamily: {
        sans: ['"TT Firs Neue"', 'sans-serif'],
        serif: ['"TT Firs Neue"', 'serif'],
        medium: ['"TT Firs Neue Medium"', 'sans-serif'],
        light: ['"TT Firs Neue Light"', 'sans-serif'],
        bold: ['"TT Firs Neue Bold"', 'sans-serif'],
        semibold: ['"TT Firs Neue Semibold"', 'sans-serif'],
        regular: ['"TT Firs Neue Regular"', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#003399',
          light: '#1a4db3',
          dark: '#002277',
        },
        secondary: {
          DEFAULT: '#d1ab66',
          light: '#f8d188',
          dark: '#b8924f',
        },
      },
    },
  },
  plugins: [],
}
