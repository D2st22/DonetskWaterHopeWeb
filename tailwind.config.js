/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        water: {
          50: "#eef9fb",
          100: "#d7f0f5",
          500: "#007da3",
          600: "#006c8e",
          700: "#075774",
          900: "#123642"
        },
        mint: {
          500: "#2f8f73",
          700: "#176a54"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(22, 49, 59, 0.10)"
      }
    }
  },
  plugins: []
};
