YAML is used here.
Part of the data is taken directly from [Genshin Optimizer](https://github.com/frzyc/genshin-optimizer).

### data
Contains stat modifiers and effects for everything using this format:
```yml
name: Name of the item (character, weapon, artifact set, etc...)
cards: [] Array of effects available for the item
    - name: Name of the card
      source: optional label for the effect explorer
      keywords: optional search keywords for the effect explorer
      type: Type of the card for interactivity (static, bool, stack, stack-precise, bool-elem)
        static -> no interaction
        bool -> on/off interaction
        stack -> multiply effect value by set interactive number of stacks
        stack-precise -> interactive number of stacks with determined effects
        bool-elem -> interactive elemental selection with determined effects
      tag: optional label (2pc, 4pc, A1, A4, C1, etc...)
      text: optional description, usually the condition for non-static type cards.
      maxstack: (stack,stack-precise only) Maximum obtainable stacks
      effects: [] Array of stat modifiers
        - target: target of the modifier (self, team, enemy, team-exclusive)
          stat: target stat, see below
          value: value of the modifier (25% = 0.25)
          source: (ratio stats only) source stat to compute ratio from
          ratio: (ratio stats only) ratio value
          step: (ratio stats only) change multiplier of ratio instead of 1 (e.g. every 1000 hp)
          maxvalue: max flat value that can be computed for that effect
          base: value to substract to source stat before computing ratio
          r1value: (weapon only) value of the modifier scaling at R1
          r5value: (weapon only) value of the modifier scaling at R5
          r1ratio: (weapon only) ratio of the modifier scaling at R1
          r5ratio: (weapon only) ratio of the modifier scaling at R5
          r1maxvalue: (weapon only) max value of the modifier scaling at R1
          r5maxvalue: (weapon only) max value of the modifier scaling at R5
```

### Stats Symbols
Symbol | Description
---|---
`hp` | HP (flat)
`hp%` | HP%
`atk` | ATK (flat)
`atk%` | ATK%
`def` | DEF (flat)
`def%` | DEF%
`em` | Elemental Mastery
`er%` | Energy Recharge
`cr%` | Crit Rate%
`cdmg%` | Crit DMG%
`dmg` | Bonus DMG (flat)
`dmg%` | Bonus DMG%
`spd%` | Bonus animation speed
`na` | Normal Attack (prefix)
`ca` | Charged Attack (prefix)
`pa` | Plunged Attack (prefix)
`skill` | Elemental Skill (prefix)
`burst` | Elemental Burst (prefix)
`heal in%` | Healing received bonus%
`heal out%` | Healing effectiveness%
`shield%` | Shield resistance%

Elements and Elemental reactions symbols can also be used as prefix on certain stat symbols.
Symbol | Description
---|---
`true` | "True" damage (not scaling on anything else)
`phys` | Physical
`anemo` | Anemo
`geo` | Geo
`electro` | Electro
`dendro` | Dendro
`hydro` | Hydro
`pyro` | Pyro
`cryo` | Cryo
`vaporize` | Vaporize
`overloaded` | Overloaded
`melt` | Melt
`burning` | Burning
`electro-charged` | Electro-Charged
`frozen` | Frozen
`shatter` | Shatter
`bloom` | Bloom
`burgeon` | Burgeon
`hyperbloom` | Hyperbloom
`superconduct` | Superconduct
`quicken` | Quicken
`spread` | Spread
`aggravate` | Aggravate
`swirl` | Swirl (can be combined with another element as suffix)
`crystalize` | Crystalize (can be combined with another element as suffix)

## DMG Formula reminder
```
(Talent Multiplier * ((Character ATK + Weapon ATK) * (100% + ATK%) + Artefact ATK) + DMG Bonus) * (100% + DMG Bonus%) * Enemy Def (50%) * (100% - Enemy Elemental RES%)

```