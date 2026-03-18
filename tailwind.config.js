/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4a6baf",
        secondary: "#ff7e5f",
        dark: "#2c3e50",
        light: "#f8f9fa",
        gray: "#6c757d",
        success: "#28a745",
      },
    },
  },
  plugins: [],
}