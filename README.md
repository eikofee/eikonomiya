# Eikonomiya

*pun between "eiko" and "enkanomiya" which is also the name used by enka.network fetching genshin in-game data.*

This is a piece of software aiming at:
1. Fetching equipment regularly of my characters using enka.network and saving them into a local database
2. Providing this parsed data locally and continuously with API and stuff to be read using (my) Excel spreadsheet
3. Computing additional data easily notably regarding the quality of the artifacts which is currently not that intuitive and a bit wonky on my spreadsheet.
4. ~~Entertaining me with the Julia language, and allowing me to play a bit with Docker.~~
5. **NEW : ** Being a pain for me to code with Javascript (altho this is actually Typescript which is far less cancerous to work with and Nextjs is okay i guess).
6. **NEW : ** Providing a web interface to work with instead of only my wonky spreadsheets.
7. **FUTURE : ** Process damage computations automatically (heavily inspired by [Genshin Optimizer](https://frzyc.github.io/genshin-optimizer) and [Aspirine](https://genshin.aspirine.su/))

## Dependencies
- ~~Docker~~ (not yet)
- npm (I think ? Dependencies should be installed along)

## Installation

Read original readme below.
Then go to `localhost:3000/<your uid>/<character name>` to see stuff.
Proper home page is wip.

## API
(to be documented, maybe use swagger ?)

## Artefact rating rule
It's actually simple.
First, you gives a weigh to each rollable substat (by default 0) according to which stat is good or not for a character.

Then, a *potential* is computed based on the substat rolls you got on your artefact. For example, suppose you have a Crit Rate% of 10.5%. A Crit Rate% roll can go up to 3.9%, so the potential of this substat is 10.5/3.9=~2.69.

Each potential is then being multiplied by the weigh you chose previously, so potentials are now weighted by their importance for the character and useless substats are not being considered.
The final rating is the sum of theses weighted potential divided by the maximum potential you could have on this artefact.

The maximum potential is the sum of the four highest weight values you could have on this artefact (if the higher stat is already on the main stat, then we take the next higher one). The highest weight from these four is then multiplied by 6, to emulate the fact you could have rolled on this substat at +4,+8,+12,+16 and +20, every time for the best value possible.

The result of this division can be read as a percentage.

# Original README

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
