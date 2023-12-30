import { ICharacterData } from "./ICharacterData"
import { IStatBag } from "./IStatBag"
import { StatBag } from "./StatBag"
import { ETarget } from "./enums/EEffectTarget"
import { EStat } from "./enums/EStat"

function buildBaseStats(character: ICharacterData) {
    const characterBase = character.commonData
    const weapon = character.weapon
    const artefacts = character.artefacts
    const ascensionLevel = character.ascensionLevel
    let sb = new StatBag()
    sb.addStat({name: EStat.ER_P, value: 1, target: ETarget.SELF})
    sb.addStat({name: EStat.CR_P, value: 0.05, target: ETarget.SELF})
    sb.addStat({name: EStat.CDMG_P, value: 0.5, target: ETarget.SELF})
    if (weapon.subStat != undefined) {
        sb.addStat({name: weapon.subStat.name, value: weapon.subStat.value, target: ETarget.SELF})
    }

    for (let i = 0; i < artefacts.length; ++i) {
        let a = artefacts[i]
        sb.addStat({name: a.mainStat.name, value: a.mainStat.value, target: ETarget.SELF})
        for (let j = 0; j < a.subStats.length; ++j) {
            sb.addStat({name: a.subStats[j].name, value: a.subStats[j].value, target: ETarget.SELF})
        }
    }

    let ascendedFactor = 1
    switch (ascensionLevel) {
        case 0:
        case 1:
            ascendedFactor = 0;
            break;
        case 2:
            ascendedFactor = 1;
            break;
        case 3:
        case 4:
            ascendedFactor = 2;
            break;
        case 5:
            ascendedFactor = 3;
            break;
        case 6:
            ascendedFactor = 4;
            break;
    }

    sb.addStat({name: characterBase.ascensionStatName, value: characterBase.ascensionStatBaseValue * ascendedFactor, target: ETarget.SELF})
    return sb
}

export function computeStats(c: ICharacterData) : IStatBag{
    let currentStats = buildBaseStats(c)
    const currentEffects = c.staticEffects.concat(c.dynamicEffects)
    for (let j = 0; j < currentEffects.length; ++j) {
        const currentEffect = currentEffects[j]
        for (let k = 0; k < currentEffect.statChanges.length; ++k) {
            if (currentEffect.options.enabled && (currentEffect.statChanges[k].target == ETarget.SELF || currentEffect.statChanges[k].target == ETarget.TEAM)){
                currentStats.addStat(currentEffect.statChanges[k])
            }
        }
    }

    return currentStats.toIStatBag()
}

