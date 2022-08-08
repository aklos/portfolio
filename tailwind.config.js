/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.tsx"],
  theme: {
    fontFamily: {
      body: ["Poppins"],
    },
    extend: {},
  },
  plugins: [require("@tailwindcss/typography")({ className: "prose" })],
};
