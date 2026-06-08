import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#f7f3ea',
        porcelain: '#fffdfa',
        linen: '#eee6d8',
        ink: '#24231f',
        graphite: '#67645d',
        olive: '#53624b',
        moss: '#dce4d2',
        clay: '#b7815d'
      },
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'Consolas', 'monospace']
      },
      boxShadow: {
        soft: '0 18px 45px rgb(36 35 31 / 8%)',
        line: 'inset 0 0 0 1px rgb(36 35 31 / 8%)'
      }
    }
  },
  plugins: []
}

export default config
