/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js,ts}"],
  theme: {
    extend: {
      backgroundColor: {
        "light-blue": "#F1F4F9",
        "dark-blue": "#256489",
        "dark-grey": "#41474D",
        "blue-sky": "#D3E5F5",
      },
      colors: {
        "dark-grey": "#41474D",
        blackish: "#0C1D29",
      },
    },
  },
  plugins: [],
};
