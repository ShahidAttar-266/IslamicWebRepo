/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        primary: "#2db87a",
        accent: "#d4a843",
        bg: "#0d1f1a",
        card: "#1a3328",
        border: "#2d4a3e",
        text: {
          DEFAULT: "#e8f5ef",
          muted: "#a1c2b3"
        },
        danger: "#e53e3e",
        success: "#2db87a"
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        arabic: ['Amiri', 'Geeza Pro', 'Traditional Arabic', 'Simplified Arabic', 'Times New Roman', 'serif'],
      }
    },
  },
  plugins: [],
}