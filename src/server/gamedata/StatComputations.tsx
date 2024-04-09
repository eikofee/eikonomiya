import { ICharacterData } from "./ICharacterData"
import { IEffect } from "./IEffect"
import { IStatBag } from "./IStatBag"
import { IStatTuple, copyStatTuple } from "./IStatTuple"
import { StatBag } from "./StatBag"
import { ETarget } from "./enums/ETarget"
import { EEffectType } from "./enums/EEffectType"
import { EStat, stringToEStat } from "./enums/EStat"

function buildBaseStats(character: ICharacterData, additionalStats: IStatBag) {
    const characterBase = character.commonData
    const weapon = character.weapon
    const artifacts = character.artifacts
    const ascensionLevel = character.ascensionLevel
    let sb = new StatBag()
    sb.addStat({name: EStat.ER_P, value: 1})
    sb.addStat({name: EStat.CR_P, value: 0.05})
    sb.addStat({name: EStat.CDMG_P, value: 0.5})
    if (weapon.subStat != undefined) {
        sb.addStat({name: weapon.subStat.name, value: weapon.subStat.value})
    }

    let as = new StatBag()
    for (let i = 0; i < additionalStats.names.length; ++i) {
        as.addStat({name: stringToEStat(additionalStats.names[i]), value: additionalStats.values[i]})
    }

    for (let i = 0; i < artifacts.length; ++i) {
        let a = artifacts[i]
        sb.addStat({name: a.mainStat.name, value: a.mainStat.value})
        for (let j = 0; j < a.subStats.length; ++j) {
            sb.addStat({name: a.subStats[j].name, value: a.subStats[j].value})
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

    sb.addStat({name: characterBase.ascensionStatName, value: characterBase.ascensionStatBaseValue * ascendedFactor})
    const baseStats = [characterBase.baseStats.hp, characterBase.baseStats.atk_nw + weapon.mainStat.value, characterBase.baseStats.def]
    const bonusStats = [EStat.HP_P, EStat.ATK_P, EStat.DEF_P]
    const flatStats = [EStat.HP, EStat.ATK, EStat.DEF]
    const destStats = [EStat.F_HP, EStat.F_ATK, EStat.F_DEF,]
    for (let i = 0; i < 3; ++i) {
        let base = baseStats[i]
        let bonus = sb.get(bonusStats[i])
        if (bonus == undefined) {
            bonus = {name: bonusStats[i], value: 0}
        }

        let bonus2 = as.get(bonusStats[i])
        if (bonus2 != undefined) {
            bonus = {name: bonusStats[i], value: bonus.value + bonus2.value}
        }

        let flat = sb.get(flatStats[i])
        if (flat == undefined) {
            flat = {name: flatStats[i], value: 0}
        }

        let flat2 = as.get(flatStats[i])
        if (flat2 != undefined) {
            flat = {name: flatStats[i], value: flat.value + flat2.value}
        }

        const stat : IStatTuple = {name: destStats[i], value: base * (1 + bonus.value) + flat.value}
        sb.addStat(stat)
    }

    return sb
}

function convertFlatStatNameToFinalStat(s: EStat) {
    switch(s) {
        case EStat.HP:
            return EStat.F_HP;
            
        case EStat.ATK:
            return EStat.F_ATK;
            
        case EStat.DEF:
            return EStat.F_DEF;
        
        default: return s
    }
}

export function updateEffect(currentEffect: IEffect, currentStats: StatBag, applyRatio: boolean): IEffect {

    if (currentEffect.type == EEffectType.STATIC || (currentEffect.type == EEffectType.BOOLEAN && currentEffect.options.enabled)) {
        let sc : IStatTuple[] = []
        const impl = currentEffect.implications[0] 
        for (let i = 0; i < impl.length; ++i) {
            if (impl[i].target == ETarget.SELF || impl[i].target == ETarget.TEAM) {
                if (!applyRatio && impl[i].flatValue != undefined) {
                    const cb = impl[i].flatValue!
                    sc.push(copyStatTuple(cb))
                } else if (applyRatio && impl[i].ratioValue != undefined) {
                    const r = impl[i].ratioValue!
                    const statName = convertFlatStatNameToFinalStat(r.source)
                    let value = currentStats.get(statName).value - r.base
                    if (r.step != 0) {
                        value = Math.floor(value / r.step)
                    }
                    
                    value = value * r.ratio
                    if (impl[i].ratioValue!.maxvalue > 0 && value > impl[i].ratioValue!.maxvalue) {
                        value = impl[i].ratioValue!.maxvalue
                    }
                    sc.push({
                        name: r.target,
                        value: value
                    })

                }
            }
        }

        if (!applyRatio) {
            currentEffect.statChanges = sc
        } else {
            currentEffect.statChanges = currentEffect.statChanges.concat(sc)
        }

    } else if (currentEffect.type == EEffectType.STACK) {
        let sc : IStatTuple[] = []
        for (let i = 0; i < currentEffect.implications[0].length; ++i) {
            if (currentEffect.implications[0][i].target == ETarget.SELF || currentEffect.implications[0][i].target == ETarget.TEAM) {
                if (applyRatio && currentEffect.implications[0][i].ratioValue != undefined) {
                    const r = currentEffect.implications[0][i].ratioValue!
                    let value = currentStats.get(r.source).value - r.base
                    if (r.step != 0) {
                        value = value / r.step
                    }
                    
                    value = value * r.ratio
                    if (currentEffect.implications[0][i].ratioValue!.maxvalue > 0 && value > currentEffect.implications[0][i].ratioValue!.maxvalue) {
                        value = currentEffect.implications[0][i].ratioValue!.maxvalue
                    }
                    sc.push({
                        name: r.target,
                        value: value
                    })
                } else if (!applyRatio && currentEffect.implications[0][i].flatValue != undefined) {
                    const cb = currentEffect.implications[0][i].flatValue!
                    sc.push(copyStatTuple(cb))
                    sc[i].value *= currentEffect.options.stack
                }
            }
        }

        if (!applyRatio) {
            currentEffect.statChanges = sc
        } else {
            currentEffect.statChanges = currentEffect.statChanges.concat(sc)
        }
    } else if (currentEffect.type == EEffectType.STACK_PRECISE && currentEffect.options.stack > 0) {
        let sc : IStatTuple[] = []
        const precise = currentEffect.implications[currentEffect.options.stack - 1]
        for (let i = 0; i < precise.length; ++i) {
            if (precise[i].target == ETarget.SELF || precise[i].target == ETarget.TEAM) {
                if (!applyRatio && precise[i].flatValue != undefined) {
                    const cb = precise[i].flatValue!
                    sc.push(copyStatTuple(cb))
                } else if (applyRatio && precise[i].ratioValue != undefined) {
                    const r = precise[i].ratioValue!
                    let value = currentStats.get(r.source).value - r.base
                    if (r.step != 0) {
                        value = value / r.step
                    }
                    
                    value = value * r.ratio
                    sc.push({
                        name: r.target,
                        value: value
                    })

                }
            }
        }

        if (!applyRatio) {
            currentEffect.statChanges = sc
        } else {
            currentEffect.statChanges = currentEffect.statChanges.concat(sc)
        }

    }

    return currentEffect
}

export function computeStats(c: ICharacterData) : {a: ICharacterData, b: IStatBag}{
    let additionalStats = new StatBag()
    let currentStats = buildBaseStats(c, additionalStats.toIStatBag())
    let finalStats = currentStats.copy()

    for (let i = 0; i < c.staticEffects.length; ++i) {
        c.staticEffects[i] = updateEffect(c.staticEffects[i], currentStats, false)
    }

    for (let i = 0; i < c.dynamicEffects.length; ++i) {
        c.dynamicEffects[i] = updateEffect(c.dynamicEffects[i], currentStats, false)
    }

    const currentEffects = c.staticEffects.concat(c.dynamicEffects)

    for (let i = 0; i < currentEffects.length; ++i) {
        if (currentEffects[i].options.enabled) {
            for (let j = 0; j < currentEffects[i].statChanges.length; ++j) {
                // currentStats.addStat(currentEffects[i].statChanges[j])
                additionalStats.addStat(currentEffects[i].statChanges[j])
            }
        }
    }

    currentStats = buildBaseStats(c, additionalStats.toIStatBag())
    
    for (let i = 0; i < c.staticEffects.length; ++i) {
        c.staticEffects[i] = updateEffect(c.staticEffects[i], currentStats, true)
    }
    
    for (let i = 0; i < c.dynamicEffects.length; ++i) {
        c.dynamicEffects[i] = updateEffect(c.dynamicEffects[i], currentStats, true)
    }

    for (let i = 0; i < currentEffects.length; ++i) {
        if (currentEffects[i].options.enabled) {
            for (let j = 0; j < currentEffects[i].statChanges.length; ++j) {
                finalStats.addStat(currentEffects[i].statChanges[j])
            }
        }
    }
    return {a: c, b: finalStats.toIStatBag()}
}

