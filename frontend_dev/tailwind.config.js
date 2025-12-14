/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Ujistěte se, že toto pole zahrnuje všechny vaše .js/.ts/.jsx/.tsx soubory
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    // MUSÍ BÝT ZAPNUTÝ
    require('@tailwindcss/typography'), 
  ],
}