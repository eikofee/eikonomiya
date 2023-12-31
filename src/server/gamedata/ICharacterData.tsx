import { IArtefact, copyArtefact } from "./IArtefact"
import { IWeapon } from "./IWeapon"
import { IEffect, copyEffect } from "./IEffect"
import { StatBag } from "./StatBag"
import { EElement } from "./enums/EElement"
import { ERegion } from "./enums/ERegion"
import { ICharacterCommonData } from "./ICharacterCommonData"
import { IStatBag } from "./IStatBag"
import { EStat, stringToEStat } from "./enums/EStat"
import { ETarget } from "./enums/EEffectTarget"

export interface ICharacterData {
    name: string
    element: EElement

    level: number
    ascensionLevel: number
    ascensionStatName: EStat,
    ascensionStatValue: number,
    friendshipLevel: number
    skills: {
        levelAA: number
        levelSkill: number
        levelUlt: number
    }

    commonData: ICharacterCommonData
    weapon: IWeapon
    artefacts: IArtefact[]

    totalStats: IStatBag
    lastUpdated: number
    anormalStats: IStatBag

    staticEffects: IEffect[]
    dynamicEffects: IEffect[]
}

export function copyCharacterData(ref: ICharacterData) : ICharacterData{
    const commonData: ICharacterCommonData = {
        name: ref.commonData.name,
        element: ref.commonData.element,
        rarity: ref.commonData.rarity,
        region: ref.commonData.region,
        weaponType: ref.commonData.weaponType,
        assets: {
            characterPortrait: ref.commonData.assets.characterPortrait,
            characterCard: ref.commonData.assets.characterCard
        },
        ascensionStatName: ref.commonData.ascensionStatName,
        ascensionStatBaseValue: ref.commonData.ascensionStatBaseValue,
        baseStats: {
            hp: ref.commonData.baseStats.hp,
            atk: ref.commonData.baseStats.atk,
            atk_nw: ref.commonData.baseStats.atk_nw,
            def: ref.commonData.baseStats.def
        }
    }

    const totalStats = new StatBag()
    for (let i = 0; i < ref.totalStats.names.length; ++i) {
        let n = ref.totalStats.names[i]
        const v = ref.totalStats.values[i]
        totalStats.addStat({
            name: stringToEStat(n),
            value: v,
        })
    }

    const anomalies = new StatBag()
    for (let i = 0; i < ref.anormalStats.names.length; ++i) {
        let n = ref.anormalStats.names[i]
        const v = ref.anormalStats.values[i]
        anomalies.addStat({
            name: stringToEStat(n),
            value: v,
        })
    }

    const artefacts = []
    for (let i = 0; i < ref.artefacts.length; ++i) {
        artefacts.push(copyArtefact(ref.artefacts[i]))
    }

    const staticEffects = []
    for (let i = 0; i < ref.staticEffects.length; ++i) {
        staticEffects.push(copyEffect(ref.staticEffects[i]))
    }

    const dynamicEffects = []
    for (let i = 0; i < ref.dynamicEffects.length; ++i) {
        dynamicEffects.push(copyEffect(ref.dynamicEffects[i]))
    }

    const res : ICharacterData = {
        name: ref.name,
        element: ref.element,
        level: ref.level,
        ascensionLevel: ref.ascensionLevel,
        ascensionStatName: ref.ascensionStatName,
        ascensionStatValue: ref.ascensionStatValue,
        friendshipLevel: ref.friendshipLevel,
        skills: {
            levelAA: ref.skills.levelAA,
            levelSkill: ref.skills.levelSkill,
            levelUlt: ref.skills.levelUlt
        },
        commonData: commonData,
        weapon: {
            type: ref.weapon.type,
            name: ref.weapon.name,
            assets: {
                icon: ref.weapon.assets.icon
            },
            mainStat: {
                name: ref.weapon.mainStat.name,
                value: ref.weapon.mainStat.value,
            },
            subStat: ref.weapon.subStat == undefined ? undefined : {
                name: ref.weapon.subStat.name,
                value: ref.weapon.subStat.value,
            },
            level: ref.weapon.level,
            refinement: ref.weapon.refinement,
            rarity: ref.weapon.rarity,
            ascensionLevel: ref.weapon.ascensionLevel
        },
        artefacts: artefacts,
        totalStats: totalStats.toIStatBag(),
        lastUpdated: ref.lastUpdated,
        anormalStats: anomalies.toIStatBag(),
        staticEffects: staticEffects,
        dynamicEffects: dynamicEffects
    }

    return res
}