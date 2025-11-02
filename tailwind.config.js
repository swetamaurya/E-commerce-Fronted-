/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      letterSpacing: {
        'tighter': '-0.01em',
        'tight': '0em',
        'normal': '0.005em',
        'wide': '0.01em',
        'wider': '0.02em',
        'widest': '0.05em',
      },
    },
  },
  plugins: [],
}