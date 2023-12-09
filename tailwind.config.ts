import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'mondstadt':"url('/backgrounds/mondstadt.png')",
        'liyue':"url('/backgrounds/liyue.png')",
        'inazuma':"url('/backgrounds/inazuma.png')",
        'sumeru':"url('/backgrounds/sumeru.png')",
        'fontaine':"url('/backgrounds/fontaine.png')",
      },
    },
  },
  plugins: [],
}
export default config
