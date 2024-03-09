/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    animation: true,
  },
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        "white-1": "#EEF7FF",
        "white-2": "#F3F4F6",
        "red-error": "#FFCCCC",
      },
      fontFamily: {
        inter: ['var(--font-inter)'],
        cutive: ['var(--font-cutive)'],
      },
      screens: {
        'sm': '960px',
      },
    },
  },
  plugins: [],
}
