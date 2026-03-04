/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "*.{html,js}",
    "pages/**/*.html",
    "public/assets/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1B4332',
        accent: '#D4AF37',
        background: '#FCF9F2',
        body: '#2D2D2D',
        surface: '#FFFFFF',
      },
      fontFamily: {
        display: ['"A Awal Ramadhan Local"', '"A Awal Ramadhan"', '"Great Vibes"', 'cursive'],
        serif: ['"Playfair Display"', 'serif'],
        arabic: ['"Amiri"', 'serif'],
        sans: ['"Sora"', 'sans-serif'],
      },
      letterSpacing: {
        bodyTight: '-0.01em',
      },
      keyframes: {
        swingLantern: {
          '0%, 100%': { transform: 'rotate(-8deg)' },
          '50%': { transform: 'rotate(8deg)' },
        }
      },
      animation: {
        'swing': 'swingLantern 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
