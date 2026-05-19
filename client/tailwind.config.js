/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['Playfair Display', 'serif'],
        'sans': ['Noto Sans SC', 'sans-serif'],
      },
      colors: {
        'bg': '#faf9f7',
        'surface': '#ffffff',
        'surface-hover': '#f5f4f2',
        'text': '#1a1a1a',
        'text-muted': '#6b6b6b',
        'accent': '#e07a5f',
        'accent-light': '#f4d3ca',
        'success': '#81b29a',
        'warning': '#f2cc8f',
        'border': '#e8e6e3',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
        'hover': '0 4px 16px rgba(0,0,0,0.08), 0 16px 48px rgba(0,0,0,0.12)',
      },
    },
  },
  plugins: [],
}
