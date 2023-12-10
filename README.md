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
- Docker

## Installation

Build Docker image by running
```
docker build -t eikonomiya-front .
```
then run it using
```
docker run -p 3000:3000 -v <full path to data folder>:/app/data eikonomiya-front
```
Then go to `localhost:3000/<your uid>` to see stuff.

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