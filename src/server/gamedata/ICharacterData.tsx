import { IArtifact, copyArtifact } from "./IArtifact"
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
import { ITalent, buildDefaultITalent, copyTalent } from "./ITalent"
import { IConstellation } from "./IConstellation"

export interface ICharacterData {
    name: string,
    apiName: string,
    element: EElement,
    rarity: ERarity,
    region: ERegion,
    weaponType: EWeaponType,

    level: number,
    ascension: {
        level: number,
        statName: EStat,
        statValue: number,
    }

    constellationLevel: number,
    constellations : IConstellation[]

    friendshipLevel: number,
    talents: {
        aa: ITalent,
        skill: ITalent,
        burst: ITalent,
    }

    weapon: IWeapon,
    artifacts: IArtifact[],

    baseStats: IBaseStats
    totalStats: IStatBag,
    lastUpdated: number,
    anormalStats: IStatBag,

    staticEffects: IEffect[],
    dynamicEffects: IEffect[],

}

export function buildDefaultICharacterData() {
    const res : ICharacterData = {
        name: "Default Character",
        apiName: "defaultcharacter",
        element: EElement.NONE,
        level: 0,
        ascension: {
            level: 0,
            statName: EStat.NONE,
            statValue: 0
        },
        friendshipLevel: 0,
        talents: {
            aa: buildDefaultITalent(),
            skill: buildDefaultITalent(),
            burst: buildDefaultITalent()
        },
        weapon: {
            type: EWeaponType.UNKNOWN,
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
        artifacts: [],
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
        rarity: ERarity.UNKNOWN,
        region: ERegion.UNKNOWN,
        weaponType: EWeaponType.UNKNOWN,
        constellationLevel: 0,
        constellations: [],
        baseStats: {
            hp: 0,
            atk: 0,
            atk_nw: 0,
            def: 0
        }
    }

    return res
}

export function copyCharacterData(ref: ICharacterData) : ICharacterData{

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

    const artifacts = []
    for (let i = 0; i < ref.artifacts.length; ++i) {
        artifacts.push(copyArtifact(ref.artifacts[i]))
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
        apiName: ref.apiName,
        element: ref.element,
        level: ref.level,
        friendshipLevel: ref.friendshipLevel,
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
        artifacts: artifacts,
        baseStats: {
            hp: ref.baseStats.hp,
            atk: ref.baseStats.atk,
            atk_nw: ref.baseStats.atk_nw,
            def: ref.baseStats.def
        },
        totalStats: totalStats.toIStatBag(),
        lastUpdated: ref.lastUpdated,
        anormalStats: anomalies.toIStatBag(),
        staticEffects: staticEffects,
        dynamicEffects: dynamicEffects,
        rarity: ref.rarity,
        region: ref.region,
        weaponType: ref.weaponType,
        ascension: {
            level: ref.ascension.level,
            statName: ref.ascension.statName,
            statValue: ref.ascension.statValue
        },
        constellationLevel: 0,
        constellations: [],
        talents: {
            aa: copyTalent(ref.talents.aa),
            skill: copyTalent(ref.talents.skill),
            burst: copyTalent(ref.talents.burst)
        }
    }

    return res
}