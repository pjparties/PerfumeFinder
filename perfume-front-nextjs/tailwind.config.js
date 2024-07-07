/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient': 'url(\'../public/gradient.png\')'
      },
      colors: {
        background: '#FFF9EB',
        primary: '#212121',
        primaryMuted: '#424242',
        secondary: '#808080',
        secondaryLight: '#d9d9d9',
        accent: '#ff553e',
        teaRose: '#FFE4E2',
        earthYellow: '#FFEDCB',
      },
    },
  },
  plugins: [],
}