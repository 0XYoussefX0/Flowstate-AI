/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.{html,js,ts}"],
  theme: {
    extend: {
      backgroundColor: {
        "light-grey": "#E4E7EC",
        purple: "#7F56D9",
      },
      colors: {
        "strong-black": "#101828",
        greyish: "#475467",
        "dark-grey": "#344054",
      },
    },
  },
  plugins: [],
};
