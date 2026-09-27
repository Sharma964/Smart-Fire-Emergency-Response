/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        safety: {
          red: '#EF4444',
          crimson: '#DC2626',
          darkRed: '#991B1B',
          orange: '#F97316',
          amber: '#F59E0B',
          navy: '#0F172A',
          darkNavy: '#020617',
          steel: '#334155'
        }
      },
      animation: {
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar': 'radar 3s ease-out infinite'
      },
      keyframes: {
        radar: {
          '0%': { transform: 'scale(0.95)', opacity: '0.9' },
          '100%': { transform: 'scale(2.2)', opacity: '0' }
        }
      }
    },
  },
  plugins: [],
}
