/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        logican: {
          darkBlue: "#476C9B",
          teal: "#468C98",
          lightBlue: "#ADD9F4",
          lightGray: "#DFE0E2",
          darkGray: "#101419",
          brickRed: "#984447",
        },
      },
    },
  },
  plugins: [],
};
