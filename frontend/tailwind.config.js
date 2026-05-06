/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2db87a",
        accent: "#d4a843",
        bg: "#0d1f1a",
        card: "#1a3328",
        border: "#2d4a3e",
        text: {
          DEFAULT: "#e8f5ef",
          muted: "#8ab5a0"
        },
        danger: "#e53e3e",
        success: "#2db87a"
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        arabic: ['Amiri', 'serif'],
      }
    },
  },
  plugins: [],
}