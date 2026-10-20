/** @type {import('tailwindcss').Config} */

// Theme colors come from CSS variables (see :root / [data-theme] in index.css)
const themeColor = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: '#010203',
        light: '#f9f9f9',
        bg: themeColor('bg'),
        surface: themeColor('surface'),
        'surface-2': themeColor('surface-2'),
        line: themeColor('line'),
        fg: themeColor('fg'),
        'fg-muted': themeColor('fg-muted'),
        'fg-subtle': themeColor('fg-subtle'),
        accent: themeColor('accent'),
        'accent-hover': themeColor('accent-hover'),
        'accent-fg': themeColor('accent-fg'),
        up: themeColor('up'),
        down: themeColor('down'),
      },
    },
  },
  plugins: [],
}
