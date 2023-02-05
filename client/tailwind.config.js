/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0d98ba",
        secondary: "#ba2f0d",
      },
      transitionProperty: {
        bottom: "bottom",
        right: "right",
        left: "left",
        width: "width",
        shadow: "box-shadow",
        color: "color",
        bg: "background-color",
        pagination: "box-shadow,color,font-weight",
        opacity: "opacity",
      },
    },
    fontFamily: {
      serif: ["Montserrat", "sans-serif"],
      sans: ["Open Sans", "sans-serif"],
    },
  },
  plugins: [],
};
