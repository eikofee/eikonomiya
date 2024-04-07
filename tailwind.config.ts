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
      gridTemplateColumns: {
        'auto-fit-tiny': 'repeat(auto-fit,minmax(60px,max-content))',
        'auto-fit-small': 'repeat(auto-fit,minmax(120px,max-content))',
        'auto-fit-semi': 'repeat(auto-fit,minmax(200px,max-content))',
        'auto-fit-medium': 'repeat(auto-fit,minmax(280px,max-content))',
        'auto-fit-large': 'repeat(auto-fit,minmax(400px,max-content))',
        'auto-fit-very-large': 'repeat(auto-fit,minmax(600px,max-content))',
        'auto-fit-fr-tiny': 'repeat(auto-fit,minmax(60px,1fr))',
        'auto-fit-fr-small': 'repeat(auto-fit,minmax(120px,1fr))',
        'auto-fit-fr-semi': 'repeat(auto-fit,minmax(200px,1fr))',
        'auto-fit-fr-medium': 'repeat(auto-fit,minmax(280px,1fr))',
        'auto-fit-fr-large': 'repeat(auto-fit,minmax(400px,1fr))',
        'auto-fit-fr-very-large': 'repeat(auto-fit,minmax(600px,1fr))',
      },

    },
  },
  plugins: [],
}
export default config
