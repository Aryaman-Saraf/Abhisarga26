/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  
  theme: {
    extend: {
      fontFamily: {
        
        'jost': ['Jost', 'sans-serif'],
        'cinzel': ['var(--font-cinzel)', 'serif'],
        'space': ['var(--font-space)', 'sans-serif'],
        'vt323': ['var(--font-vt323)', 'monospace'],
      },
      animation: {
        'fog-drift': 'fog-drift 20s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'flicker': 'flicker 3s ease-in-out infinite',
      },
      keyframes: {
        'fog-drift': {
          '0%, 100%': { transform: 'translateX(-5%) translateY(-5%)' },
          '50%': { transform: 'translateX(5%) translateY(5%)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(220, 38, 38, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(220, 38, 38, 0.8), 0 0 30px rgba(220, 38, 38, 0.6)' },
        },
        'flicker': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 },
        },
      },
    },
  },
  plugins: [],
}