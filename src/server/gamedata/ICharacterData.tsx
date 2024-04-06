import { IArtefact, copyArtefact } from "./IArtefact"
import { IWeapon } from "./IWeapon"
import { IEffect, copyEffect } from "./IEffect"
import { StatBag } from "./StatBag"
import { EElement } from "./enums/EElement"
import { ICharacterCommonData } from "./ICharacterCommonData"
import { IStatBag } from "./IStatBag"
import { EStat, stringToEStat } from "./enums/EStat"
import { ERarity } from "./enums/ERarity"
import { ERegion } from "./enums/ERegion"
import { EWeaponType } from "./enums/EWeaponType"

export interface ICharacterData {
    name: string
    element: EElement

    level: number
    ascensionLevel: number
    ascensionStatName: EStat,
    ascensionStatValue: number,
    constellation: number,
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

export function buildDefaultICharacterData() {
    const res : ICharacterData = {
        name: "Default Character",
        element: EElement.NONE,
        level: 0,
        ascensionLevel: 0,
        friendshipLevel: 0,
        skills: {
            levelAA: 0,
            levelSkill: 0,
            levelUlt: 0
        },
        commonData: {
            name: "",
            element: EElement.NONE,
            rarity: ERarity.I,
            weaponType: EWeaponType.SWORD,
            ascensionStatName: EStat.UNKNOWN,
            ascensionStatBaseValue: 0,
            baseStats: {
                hp: 0,
                atk: 0,
                def: 0,
                atk_nw: 0
            },
            region: ERegion.UNKNOWN,
            assets: {
                characterPortrait: "",
                characterCard: "",
                aa: "",
                skill: "",
                burst: "",
                a1: "",
                a4: "",
                c1: "",
                c2: "",
                c3: "",
                c4: "",
                c5: "",
                c6: "",
                characterNameCard: ""
            },
            constNames: {
                c1: "",
                c2: "",
                c3: "",
                c4: "",
                c5: "",
                c6: ""
            },
            constTexts: {
                c1: "",
                c2: "",
                c3: "",
                c4: "",
                c5: "",
                c6: ""
            }
        },
        weapon: {
            type: EWeaponType.SWORD,
            name: "Default Weapon Name",
            mainStat: {
                name: EStat.UNKNOWN,
                value: 0
            },
            level: 0,
            refinement: 0,
            rarity: ERarity.I,
            assets: {
                icon: ""
            },
            ascensionLevel: 0
        },
        artefacts: [],
        totalStats: {
            names: [],
            values: []
        },
        lastUpdated: 0,
        anormalStats: {
            names: [],
            values: []
        },
        staticEffects: [],
        dynamicEffects: [],
        ascensionStatName: EStat.UNKNOWN,
        ascensionStatValue: 0,
        constellation: 0
    }

    return res
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
            characterCard: ref.commonData.assets.characterCard,
            characterNameCard: ref.commonData.assets.characterNameCard,
            aa: ref.commonData.assets.aa,
            skill: ref.commonData.assets.skill,
            burst: ref.commonData.assets.burst,
            a1: ref.commonData.assets.a1,
            a4: ref.commonData.assets.a4,
            c1: ref.commonData.assets.c1,
            c2: ref.commonData.assets.c2,
            c3: ref.commonData.assets.c3,
            c4: ref.commonData.assets.c4,
            c5: ref.commonData.assets.c5,
            c6: ref.commonData.assets.c6
        },
        ascensionStatName: ref.commonData.ascensionStatName,
        ascensionStatBaseValue: ref.commonData.ascensionStatBaseValue,
        baseStats: {
            hp: ref.commonData.baseStats.hp,
            atk: ref.commonData.baseStats.atk,
            atk_nw: ref.commonData.baseStats.atk_nw,
            def: ref.commonData.baseStats.def
        },
        constNames: {
            c1: ref.commonData.constNames.c1,
            c2: ref.commonData.constNames.c2,
            c3: ref.commonData.constNames.c3,
            c4: ref.commonData.constNames.c4,
            c5: ref.commonData.constNames.c5,
            c6: ref.commonData.constNames.c6
        },
        constTexts: {
            c1: ref.commonData.constTexts.c1,
            c2: ref.commonData.constTexts.c2,
            c3: ref.commonData.constTexts.c3,
            c4: ref.commonData.constTexts.c4,
            c5: ref.commonData.constTexts.c5,
            c6: ref.commonData.constTexts.c6
        },
        
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
        dynamicEffects: dynamicEffects,
        constellation: ref.constellation
    }

    return res
}