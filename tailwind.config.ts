
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // Pastel & vibrant Gen Z palette
        brand: {
          purple: "#BC7AF9",
          lightPurple: "#E5DEFF",
          blue: "#A5DEFF",
          yellow: "#FDF6B9",
          pink: "#FFDEE2",
          peach: "#FFF3EA",
          green: "#B6FFCE",
          dark: "#22223B",
        },
        card: {
          DEFAULT: "#fff",
          foreground: "#22223B",
        },
        accent: {
          DEFAULT: "#BC7AF9",
          foreground: "#fff",
        },
        muted: {
          DEFAULT: "#EEEAF8",
          foreground: "#A293B7",
        }
      },
      borderRadius: {
        xl: '2rem',
        lg: '1rem',
        md: '0.7rem',
        sm: '0.3rem'
      },
      keyframes: {
        'fade-in': {
          "0%": {
            opacity: "0",
            transform: "translateY(16px)"
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        blob: {
          "0%, 100%": { transform: 'translateY(0px) scale(1)' },
          "50%": { transform: 'translateY(-10px) scale(1.02)' },
        }
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease',
        'blob': 'blob 5s infinite',
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(110deg, #E5DEFF 0%, #A5DEFF 100%)',
        'genz-earth': 'linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)',
        'cardGradient': 'linear-gradient(135deg, #f3e7fd 0%, #d3f4fd 100%)',
        'mainGenz': 'linear-gradient(112deg, #ffe5ef 0%, #e5defe 50%, #d3f4fd 100%)',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
