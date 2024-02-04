# Eikonomiya

*pun between "eiko" and "enkanomiya" which is also the name used by enka.network fetching genshin in-game data.*

This is a piece of software aiming at:
1. Regularly fetching equipment of in-game characters characters using [Enka.Network](https://enka.network/) and saving them into a local database.
2. Providing this parsed data locally and continuously with API.
3. Providing a web interface to work with instead of only my wonky spreadsheets.
4. Computing additional data easily notably regarding the quality of the artifacts.
5. Process damage computations automatically and team compositions.

## Dependencies
- Docker (deployable)

or

- npm (running locally)

## Installation
### Using Docker
Grab the Docker image on [DockerHub](https://hub.docker.com/repository/docker/eikofee/eikonomiya/) or build it yourself by running
```
docker build -t eikonomiya .
```
then run it using
```
docker run -p 3000:3000 -v <full path to data folder>:/app/data eikonomiya
```
Then go to `localhost:3000` to start using Eikonomiya.

### Using npm (prod build)
Create a folder named `data` at the root of the repo, then run
```
npm run build
```
to build the application. You can then start it using
```
npm run start
```

### Using npm (dev build)
Create a folder named `data` at the root of the repo, then run
```
npm run dev
```
to start the application.

## API
(to be documented, maybe use swagger ?)

## Differences with other Genshin tools
|Tool|Pros|Cons|
|----|----|----|
| [Genshin Optimizer](https://frzyc.github.io/genshin-optimizer) | Powerful tool, elegant and user-friendly interface, allows simulation, details everything | Extremely heavy to use (everything has to be referenced before doing calculations), no automatic synchronization with in-game data. |
| [Aspirine](https://genshin.aspirine.su/) | Powerful tool, allows simulations and can process rotations relatively easily, can sync using Enka.Network | User interface is not that friendly at all, optimizer makes strange choices, not that much details on calculations.
| [Enka.Network](https://enka.network/) | THE only API that can grab in-game data. Very useful and documented, can draw pretty summary character cards. | No computation or simulation, not the purpose of the tool. Does not (freely at least) save character outside in-game showcase. |
| [Akasha](https://akasha.cv/) | Huge database storing in-game builds from players not limited to their current showcase, extends Enka functionalities, can rate character builds and check meta | Heavily focused on meta, does not "work" with more niche builds or non-meta teams. Does not feature simulation like previous tools. |

While Eikonomiya aims to do a bit of this and that from other tools, the main purpose of the tool is to replace the complex Excel spreadsheets I made since I started played Genshin. Aside from showing which part of each character needs work/farm, it aims to give a simple way to simulate character stats, team compositions and buff stacking.

[Schale.gg](https://schale.gg/) is a Blue Archive tool that kind of does that, without the complexity of Genshin Optimizer and a more user-friendly and prettier interface than Aspirine. However, it does not sync data with the game.
Eikonomiya is heavily inspired by the functionalities offered by Genshin Optimizer and Schale.gg.

## Misc
### Artefact rating rule
Each possible substat is being given an importance value.
The strength of each roll is then computed on the artefact.
For example, let's say an artefact has a Crit Rate% substat of 10.5%.
A Crit Rate% roll can go up to 3.9%, so the strength of this substat is 10.5/3.9=~2.69.
The strength of each substat is then multiplied by their importance value and summed.
This sum is then divided by the maximum value the artefact could get, to obtain its score in the form of a percentage.

The maximum value is the sum of the four highest importance values (if the higher stat is already on the main stat, then the next higher one is). However, the highest importance value from these four values is multiplied by 6 to simulate a perfectly rolled substat at levels +4,+8,+12,+16 and +20.
This is the best possible value to be obtained on that artefact, and it's almost impossible to get it.
From my tests and feels in-game, a score of 65% is generally already a good enough artefact.

### Additional data
Other in-game values not given by Enka.network are located in the [eikonomiya-data](https://github.com/eikofee/eikonomiya-data) repo.