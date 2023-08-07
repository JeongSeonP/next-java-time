/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "base-color": "#efeae6",
        "base-dark-color": "#52453a",
        "primary-dark-color": "#398d90",
        "primary-light-color": "#91d9dc",
        "sub-color": "#dfaff7",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: ["cupcake"],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
  },
};
