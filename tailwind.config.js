/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        border: 'hsl(var(--border))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        outfit: ['"Outfit"', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #F5D061 0%, #E6B830 50%, #B38600 100%)',
        'glare-gradient': 'linear-gradient(110deg, #D4AF37 35%, #FFFFFF 50%, #D4AF37 65%)',
      },
      animation: {
        'text-glare': 'text-glare 3s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'wa-pulse': 'wa-pulse 2s ease-in-out infinite',
        'wa-icon-pulse': 'wa-icon-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'text-glare': {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        'wa-pulse': {
          '0%, 100%': { borderColor: 'hsl(var(--border))', color: 'hsl(var(--foreground))', boxShadow: 'none' },
          '50%': { borderColor: '#25D366', color: '#25D366', boxShadow: '0 0 15px rgba(37, 211, 102, 0.2)' },
        },
        'wa-icon-pulse': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        }
      }
    },
  },
  plugins: [],
}
