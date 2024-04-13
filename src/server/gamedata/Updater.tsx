import { EnkaBridge } from "./EnkaBridge"
import { EnkaTranslator, buildEnkaTranslator } from "./EnkaTranslator"
import { ICharacterData } from "./ICharacterData"
import { IPlayerInfo, copyIPlayerInfoWithoutCharacters, readIPlayerInfoWithoutCharacters } from "./IPlayerInfo"
import * as yaml from 'yaml';
import { IWeapon } from "./IWeapon";
import { IArtifact } from "./IArtifact";
import { StatBag } from "./StatBag";
import { IEffect } from "./IEffect";
import { ETarget } from "./enums/ETarget";
import { ICharacterCommonData } from "./ICharacterCommonData";
import { ERarity } from "./enums/ERarity";
import { EStat, stringToEStat } from "./enums/EStat";
import { promises as fsPromises, stat } from 'fs';
import path from "path";
import { ICharacterRule } from "@/app/interfaces/ICharacterRule";
import { EEffectType } from "./enums/EEffectType";
import { IStatTuple } from "./IStatTuple";
import { addOptions } from "./IEffectOptions";
import { IEffectImplication } from "./IEffectImplication";
import { IStatRatio } from "./IStatRatio";
import { ERegion, stringToERegion } from "./enums/ERegion";
import { EElement } from "./enums/EElement";
import { IApiEffectCard } from "./IApiEffectCard";
import { apiLogicLoadEffectData } from "../api/ApiLogicLoadEffectData";
import { apiLogicLoadLocale } from "../api/ApiLogicLoadLocale";

export enum ELoadStatus {
    SUCCESS,
    LOCAL_ONLY,
    FAILED,
}

export interface ILoadPlayerInfoStatus {
    playerInfo? : IPlayerInfo,
    status: ELoadStatus,
    message: string
}

export class Updater {

    uid: string = ""
    enkaTranslator!: EnkaTranslator
    bridge!:EnkaBridge

    constructor (uid: string) {
        this.uid = uid
    }
    
    public async initialize() {
        this.enkaTranslator = await buildEnkaTranslator()
        this.bridge = new EnkaBridge(this.uid, this.enkaTranslator)
    }

    private async getAscensionStatName(name: string) : Promise<EStat> {
        const ascensionRawData = await (await fetch("https://raw.githubusercontent.com/eikofee/eikonomiya-data/master/character-ascensions.yml")).text()
        const sets = yaml.parse(ascensionRawData)
        const statName = sets[name]["stat"]
        return stringToEStat(statName)
    }
    
    private async computeAscensionStatValue(statName: EStat, characterName: string, rarity: ERarity): Promise<number> {
        const values = await (await fetch("https://raw.githubusercontent.com/eikofee/eikonomiya-data/master/ascension-values.yml")).text()
        const sets = yaml.parse(values)
        const baseValue = sets[stringToEStat(statName)]
        let rarityMultiplier = 1
        if (characterName != "Lumine" && characterName != "Aether" && (rarity == ERarity.V || rarity == ERarity.V_RED)) {
            rarityMultiplier = 1.2
        }

        return baseValue * rarityMultiplier;
    }

    private cleanNameForPath(s: string) {
            return s.toLowerCase().replaceAll(" ", "").replaceAll("'", "").replace("-","")
        }

    private buildBaseStats(characterBase : ICharacterCommonData, weapon: IWeapon, artifacts: IArtifact[], ascensionLevel: number) {
        let sb = new StatBag()
        sb.addStat({name: EStat.ER_P, value: 1})
        sb.addStat({name: EStat.CR_P, value: 0.05})
        sb.addStat({name: EStat.CDMG_P, value: 0.5})
        if (weapon.subStat != undefined) {
            sb.addStat({name: weapon.subStat.name, value: weapon.subStat.value})
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
        return sb
    }

    private parseEffect(data: IApiEffectCard[], defaultName: string, defaultIcon: string, refinement: number) : IEffect[] {
        let res = []
        for (let i = 0; i < data.length; ++i) {
            let effectName = defaultName
            const apiEffect = data[i];
            if (apiEffect.name != undefined) {
                effectName = apiEffect.name
            }

            let effectTag = ""
            if (apiEffect.tag != undefined) {
                effectTag = apiEffect.tag
            }

            let effectSource = ""
            if (apiEffect.source != undefined) {
                effectSource = apiEffect.source
            }

            // let effectSource2 = ""
            // if (apiEffect["source2"] != undefined) {
            //     effectSource2 = apiEffect["source2"]
            // }

            let keywords : string[] = []
            if (apiEffect.keywords != undefined) {
                keywords = apiEffect.keywords.split(" ")
            }

            const effectType = apiEffect.type
            const text = apiEffect.text != undefined ? apiEffect.text : ""
            const maxstack = apiEffect.maxstack != undefined ? apiEffect.maxstack : 0
            let implicationsSet : IEffectImplication[][] = []
            let implications : IEffectImplication[] = []
            let statChanges : IStatTuple[] = []
            if (effectType != undefined && apiEffect.effects != undefined) {
                switch (effectType) {
                    case EEffectType.STATIC:
                    case EEffectType.BOOLEAN:
                        implications = []
                        for (let k = 0; k < apiEffect.effects.length; ++k) {
                            const e = apiEffect.effects[k]
                            const target = e.target
                            let flatValue : IStatTuple | undefined = undefined
                            let ratioValue : IStatRatio | undefined = undefined
                            if (e.source != undefined) {
                                const sourceStat = e.source
                                const targetStat = e.stat
                                let ratio = 1
                                if (e.ratio != undefined) {
                                    ratio = e.ratio
                                } else {
                                    const minratio = e.r1ratio!
                                    const maxratio = e.r5ratio!
                                    const interval = maxratio - minratio
                                    const step = interval / 4
                                    ratio = minratio + step * (refinement == 0 ? 0 : Math.max(0, refinement - 1))
                                }

                                const base = (e.base != undefined ? e.base : 0)
                                const step = (e.step != undefined ? e.step : 0)

                                let maxvalue = 0
                                if (e.r1maxvalue != undefined) {
                                    const minmaxvalue = e.r1maxvalue!
                                    const maxmaxvalue = e.r5maxvalue!
                                    const interval = maxmaxvalue - minmaxvalue
                                    const step = interval / 4
                                    maxvalue = minmaxvalue + step * (refinement == 0 ? 0 : Math.max(0, refinement - 1))
                                } else {
                                    maxvalue = e.maxvalue!
                                }

                                ratioValue = {
                                    base: base,
                                    maxvalue: maxvalue,
                                    ratio: ratio,
                                    source: sourceStat,
                                    step: step,
                                    target: targetStat
                                }

                            } else {
                                const stat = e.stat
                                let value = 0;
                                if (e.value != undefined) {
                                    value = e.value
                                } else {
                                    const minvalue = e.r1value!
                                    const maxvalue = e.r5value!
                                    const interval = maxvalue - minvalue
                                    const step = interval / 4
                                    value = minvalue + step * (refinement == 0 ? 0 : Math.max(0, refinement - 1))
                                }

                                flatValue = {
                                    name: stat,
                                    value: value
                                }
                            }

                            implications.push({
                                target: target,
                                flatValue: flatValue,
                                ratioValue: ratioValue
                            })

                        }

                        implicationsSet.push(implications)
                        break;
                    
                    case EEffectType.STACK:
                        implications = []
                        for (let k = 0; k < apiEffect.effects.length; ++k) {
                            let flatValue : IStatTuple | undefined = undefined
                            let ratioValue : IStatRatio | undefined = undefined
                            const e = apiEffect.effects[k]
                            const target = e.target
                            const stat = e.stat
                            if (e.source != undefined) {
                                const sourceStat = e.source
                                const targetStat = e.stat
                                let ratio = 1
                                if (e.ratio != undefined) {
                                    ratio = e.ratio
                                } else {
                                    const minratio = e.r1ratio!
                                    const maxratio = e.r5ratio!
                                    const interval = maxratio - minratio
                                    const step = interval / 4
                                    ratio = minratio + step * (refinement == 0 ? 0 : Math.max(0, refinement - 1))
                                }

                                const base = (e.base != undefined ? e.base : 0)
                                const step = (e.step != undefined ? e.step : 0)

                                let maxvalue = 0
                                if (e.r1maxvalue != undefined) {
                                    const minmaxvalue = e.r1maxvalue!
                                    const maxmaxvalue = e.r5maxvalue!
                                    const interval = maxmaxvalue - minmaxvalue
                                    const step = interval / 4
                                    maxvalue = minmaxvalue + step * (refinement == 0 ? 0 : Math.max(0, refinement - 1))
                                }

                                ratioValue = {
                                    base: base,
                                    maxvalue: maxvalue,
                                    ratio: ratio,
                                    source: sourceStat,
                                    step: step,
                                    target: targetStat
                                }

                            } else {
                                let value = 0;
                                if (e.value != undefined) {
                                    value = e.value
                                } else {
                                    const minvalue = e.r1value!
                                    const maxvalue = e.r5value!
                                    const interval = maxvalue - minvalue
                                    const step = interval / 4
                                    value = minvalue + step * (refinement == 0 ? 0 : Math.max(0, refinement - 1))
                                }

                                flatValue = {
                                    name: stat,
                                    value: value
                                }

                            }

                            implications.push({
                                target: target,
                                flatValue: flatValue,
                                ratioValue: ratioValue
                            })

                        }

                        implicationsSet.push(implications)
                    break;
                    case EEffectType.STACK_PRECISE:
                        for (let kk = 1; kk < maxstack + 1; ++kk) {
                            implications = []
                            for (let k = 0; k < apiEffect.effectsPrecise![kk].length; ++k) {
                                let flatValue : IStatTuple | undefined = undefined
                                let ratioValue : IStatRatio | undefined = undefined
                                const e = apiEffect.effectsPrecise![kk][k]
                                const target = e.target
                                const stat = e.stat
                                if (e.source != undefined) {
                                    const sourceStat = e.source
                                    const targetStat = e.stat
                                    let ratio = 1
                                    if (e.ratio != undefined) {
                                        ratio = e.ratio
                                    } else {
                                        const minratio = e.r1ratio!
                                        const maxratio = e.r5ratio!
                                        const interval = maxratio - minratio
                                        const step = interval / 4
                                        ratio = minratio + step * (refinement == 0 ? 0 : Math.max(0, refinement - 1))
                                    }

                                    const base = (e.base != undefined ? e.base : 0)
                                    const step = (e.step != undefined ? e.step : 0)

                                    let maxvalue = 0
                                    if (e.r1maxvalue != undefined) {
                                        const minmaxvalue = e.r1maxvalue!
                                        const maxmaxvalue = e.r5maxvalue!
                                        const interval = maxmaxvalue - minmaxvalue
                                        const step = interval / 4
                                        maxvalue = minmaxvalue + step * (refinement == 0 ? 0 : Math.max(0, refinement - 1))
                                    }

                                    ratioValue = {
                                        base: base,
                                        maxvalue: maxvalue,
                                        ratio: ratio,
                                        source: sourceStat,
                                        step: step,
                                        target: targetStat
                                    }
                                    
                                } else {
                                    let value = 0;
                                    if (e.value != undefined) {
                                        value = e.value
                                    } else {
                                        const minvalue = e.r1value!
                                        const maxvalue = e.r5value!
                                        const interval = maxvalue - minvalue
                                        const step = interval / 4
                                        value = minvalue + step * (refinement == 0 ? 0 : Math.max(0, refinement - 1))
                                    }
                                    
                                    flatValue = {
                                        name: stat,
                                        value: value
                                    }
                                }

                                implications.push({
                                    target: target,
                                    flatValue: flatValue,
                                    ratioValue: ratioValue
                                })
                            }

                            implicationsSet.push(implications)

                    }
                }
            }

            const effect : IEffect = {
                name: effectName,
                source: effectSource,
                // source2: effectSource2,
                tag: effectTag,
                keywords: keywords,
                icon: defaultIcon,
                type: effectType,
                text: text,
                options: addOptions(effectType, maxstack),
                statChanges: statChanges,
                implications: implicationsSet
            }

            res.push(effect)
        }

        return res
    }


    private async getWeaponEffects(weapon : IWeapon): Promise<IEffect[]> {
        // const weaponEffectsRawData = await (await fetch("https://raw.githubusercontent.com/eikofee/eikonomiya-data/master/weapons.yml", { cache: 'no-store' })).text()
        const weaponEffectData = await apiLogicLoadEffectData("weapons", this.cleanNameForPath(weapon.name))
        let res : IEffect[] = []
        if (weaponEffectData.success) {
            return this.parseEffect(weaponEffectData.content!.cards, weapon.name, weapon.assets.icon, weapon.refinement)
        }

        return res;
    }

    private async getCharacterEffects(c: ICharacterCommonData): Promise<IEffect[]> {
        const characterEffectsRawData = await (await fetch("https://raw.githubusercontent.com/eikofee/eikonomiya-data/master/talents.yml", { cache: 'no-store' })).text()
        let res : IEffect[] = []
        const charEffects = yaml.parse(characterEffectsRawData)[c.name]
        if (charEffects != undefined) {
            return this.parseEffect(charEffects, c.name, c.assets.characterPortrait, 0)
        }

        return res;
    }

    private async getArtifactEffects(arte : IArtifact[]): Promise<IEffect[]> {
        const equipSets : Record<string, number> = {}
        const setNames = []
        const iconNames = []
        for (let i = 0; i < arte.length; ++i) {
            const set = arte[i].set
            if (equipSets[set] == undefined) {
                equipSets[set] = 1
                setNames.push(set)
                const iconNameSplit = arte[i].assets.icon.split("/")
                iconNameSplit[iconNameSplit.length - 1] = "artifacts_".concat(this.cleanNameForPath(set), "_fleur")
                iconNames.push(iconNameSplit.join("/"))
            } else {
                equipSets[set] = equipSets[set] + 1
            }
        }

        let res : IEffect[] = []
        for (let i = 0; i < setNames.length; ++i) {
            const set = setNames[i]
            const artifactSetData = await apiLogicLoadEffectData("artifacts", this.cleanNameForPath(set))
            if (artifactSetData.success){
                const effectsData = artifactSetData.content!.cards
                const effects = this.parseEffect(effectsData, set, iconNames[i], 0)
                for (let j = 0; j < effects.length; ++j) {
                    if ((effects[j].tag.includes("2pc") && equipSets[set] >= 2) ||
                    (effects[j].tag.includes("4pc") && equipSets[set] >= 4)) {
                        res.push(effects[j])
                    }
                }
            }
        }

        return res;
    }

    private getCName(name: string, e: EElement) : string {
        if (name == "Lumine" || name == "Aether") {
            switch(e) {
                case EElement.ANEMO : return "traveler-anemo";
                case EElement.GEO : return "traveler-geo";
                case EElement.ELECTRO : return "traveler-electro";
                case EElement.DENDRO : return "traveler-dendro";
                case EElement.HYDRO : return "traveler-hydro";
                default: return "traveler-default"
            }
        }

        return name
    }

    public async loadPlayerData() : Promise<ILoadPlayerInfoStatus> {
        let res : ILoadPlayerInfoStatus = {
            status: ELoadStatus.FAILED,
            message: ""
        }

        try {
            const enkaData = await this.bridge.loadPlayerData()
            let characters : ICharacterData[] = []
            const regionRawData = await (await fetch("https://raw.githubusercontent.com/eikofee/eikonomiya-data/master/regions.yml")).text()
            const reg = yaml.parse(regionRawData)
            // const constInfoRawData = await (await fetch("https://raw.githubusercontent.com/eikofee/eikonomiya-data/master/character-const-text.yml")).text()
            // const constInfo = yaml.parse(constInfoRawData)
            for (let i = 0; i < enkaData.charShowcase.length; ++i) {
                const c = enkaData.charShowcase[i].info
                const name = this.enkaTranslator.translate(c.commonData.nameId)
                const ascensionName = await this.getAscensionStatName(name)
                const ascensionValue = await this.computeAscensionStatValue(ascensionName, name, c.commonData.rarity)
                let ascendedFactor = 1
                switch (c.ascensionLevel) {
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

                let r = ERegion.UNKNOWN
                if (reg[name] != undefined) {
                    r = stringToERegion(reg[name])
                }

                let constNames = []
                let constTexts = []
                let cname = this.getCName(name, c.commonData.element)
                const constInfoRequest = await apiLogicLoadLocale("characters", cname)
                if (constInfoRequest.success) {
                    const constInfo = constInfoRequest.content!.constellations
                    for (let ii = 0; ii < 6; ++ii) {
                        if (cname != undefined && constInfo[ii] != undefined) {
                            constNames.push(constInfo[ii].name)
                            constTexts.push(constInfo[ii].description)
                        } else {
                            constNames.push("UNKNOWN NAME - PLEASE REPORT THE ISSUE")
                            constTexts.push(["UNKNOWN TEXT - PLEASE REPORT THE ISSUE"])
                        }
                    }
                }

                const cleanName = this.cleanNameForPath(name)
                const common: ICharacterCommonData = {
                    name: name,
                    element: c.commonData.element,
                    region: r,
                    rarity: c.commonData.rarity,
                    weaponType: c.commonData.weapon,
                    ascensionStatName: ascensionName,
                    ascensionStatBaseValue: ascensionValue,
                    assets: {
                        characterCard: "characters_".concat(cleanName, "_card"),
                        characterPortrait: "characters_".concat(cleanName, "_face"),
                        characterNameCard: "characters_".concat(cleanName, "_namecard"),
                        aa: "generic_".concat(c.commonData.weapon),
                        skill: "characters_".concat(cleanName, "_skill"),
                        burst: "characters_".concat(cleanName, "_burst"),
                        a1: "characters_".concat(cleanName, "_a1"),
                        a4: "characters_".concat(cleanName, "_a4"),
                        c1: "characters_".concat(cleanName, "_c1"),
                        c2: "characters_".concat(cleanName, "_c2"),
                        c3: "characters_".concat(cleanName, "_c3"),
                        c4: "characters_".concat(cleanName, "_c4"),
                        c5: "characters_".concat(cleanName, "_c5"),
                        c6: "characters_".concat(cleanName, "_c6")
                    },
                    baseStats: {
                        hp: c.baseStats.get(EStat.HP)!.value,
                        atk: c.baseStats.get(EStat.ATK)!.value,
                        atk_nw: c.baseStats.get(EStat.ATK)!.value - c.weapon.mainStat.value,
                        def: c.baseStats.get(EStat.DEF)!.value
                    },
                    constNames: {
                        c1: constNames[0],
                        c2: constNames[1],
                        c3: constNames[2],
                        c4: constNames[3],
                        c5: constNames[4],
                        c6: constNames[5]
                    },
                    constTexts: {
                        c1: constTexts[0],
                        c2: constTexts[1],
                        c3: constTexts[2],
                        c4: constTexts[3],
                        c5: constTexts[4],
                        c6: constTexts[5]
                    }
                }

                const weapon : IWeapon = {
                    type: c.weapon.type,
                    name: this.enkaTranslator.translate(c.weapon.name),
                    mainStat: c.weapon.mainStat,
                    level: c.weapon.level,
                    rarity: c.weapon.rarity,
                    subStat: c.weapon.subStat,
                    refinement: c.weapon.refinement == undefined ? 1 : c.weapon.refinement,
                    ascensionLevel: c.weapon.ascensionLevel,
                    assets: {
                        icon: "weapons_".concat(this.cleanNameForPath(c.weapon.name),"_weapon", c.weapon.ascensionLevel > 1 ? "-awake":"")
                    }
                }

                let artes = []
                for (let j = 0; j < c.artifacts.length; ++j) {
                    const arte = c.artifacts[j]
                    const a : IArtifact = {
                        type: arte.type,
                        name: this.enkaTranslator.translate(arte.name),
                        set: arte.set,
                        level: arte.level,
                        rarity: arte.rarity,
                        mainStat: arte.mainStat,
                        subStats: arte.subStats,
                        assets: {
                            icon: "artifacts_".concat(this.cleanNameForPath(arte.set), "_", arte.type)
                        }
                    }

                    artes.push(a)
                }

                let currentStats = this.buildBaseStats(common, weapon, artes, c.ascensionLevel)
                const artifactEffects = await this.getArtifactEffects(artes)
                const weaponEffects = await this.getWeaponEffects(weapon)
                const inherentEffect = await this.getCharacterEffects(common)
                const currentEffects = artifactEffects.concat(weaponEffects, inherentEffect)


                for (let j = 0; j < currentEffects.length; ++j) {
                    const currentEffect = currentEffects[j]
                    if (currentEffect.type == EEffectType.STATIC) {
                        for (let k = 0; k < currentEffect.implications[0].length; ++k) {
                            if (currentEffect.options.enabled && (currentEffect.implications[0][k].target == ETarget.SELF || currentEffect.implications[0][k].target == ETarget.TEAM)){
                                if (currentEffect.implications[0][k].flatValue != undefined) {
                                    currentStats.addStat(currentEffect.implications[0][k].flatValue!)
                                }

                            }
                        }
                    }
                }

                for (let j = 0; j < currentEffects.length; ++j) {
                    const currentEffect = currentEffects[j]
                    if (currentEffect.type == EEffectType.STATIC) {
                        for (let k = 0; k < currentEffect.implications[0].length; ++k) {
                            if (currentEffect.options.enabled && (currentEffect.implications[0][k].target == ETarget.SELF || currentEffect.implications[0][k].target == ETarget.TEAM)){
                                if (currentEffect.implications[0][k].ratioValue != undefined) {
                                    const r = currentEffect.implications[0][k].ratioValue!
                                    let value = currentStats.get(r.source).value - r.base
                                    if (r.step != 0) {
                                        value = value / r.step
                                    }

                                    value = value * r.ratio
                                    if (r.maxvalue > 0 && value > r.maxvalue) {
                                        value = r.maxvalue
                                    }
                                    currentStats.addStat({
                                        name: r.target,
                                        value: value
                                    })
                                }

                            }
                        }
                    }
                }

                if (currentStats.keys().includes(EStat.ELEM_DMG_P)) {
                    const elemStats = [EStat.ANEMO_DMG_P, EStat.GEO_DMG_P, EStat.ELECTRO_DMG_P, EStat.DENDRO_DMG_P, EStat.HYDRO_DMG_P, EStat.PYRO_DMG_P, EStat.CRYO_DMG_P]
                    for (let i = 0; i < elemStats.length; ++i) {
                        currentStats.addStat({name: elemStats[i], value: currentStats.get(EStat.ELEM_DMG_P).value})
                    }
                }
                
                const anomalies = new StatBag()
                for (let j = 0; j < c.finalStats.keys().length; ++j) {
                    const currentStat = c.finalStats.keys()[j]
                    if (currentStats.keys().includes(currentStat)) {
                        const statDiff = c.finalStats.get(currentStat)!.value / currentStats.get(currentStat)!.value
                        if (statDiff < 0.98 || statDiff > 1.02) {
                            anomalies.addStat({name: currentStat, value: c.finalStats.get(currentStat)!.value - currentStats.get(currentStat)!.value})
                        }
                    } else {
                        anomalies.addStat(c.finalStats.get(currentStat)!)
                    }
                }

                const char: ICharacterData = {
                    name: name,
                    element: c.commonData.element,
                    level: c.level,
                    ascensionLevel: c.ascensionLevel,
                    ascensionStatName: ascensionName,
                    ascensionStatValue: ascensionValue * ascendedFactor,
                    friendshipLevel: c.friendship,
                    constellation: c.constellation,
                    skills: {
                        levelAA: c.skills[0].level,
                        levelSkill: c.skills[1].level,
                        levelUlt: c.skills[2].level
                    },
                    commonData: common,
                    weapon: weapon,
                    artifacts: artes,
                    totalStats: currentStats.toIStatBag(),
                    dynamicEffects: [],
                    lastUpdated: Date.now(),
                    staticEffects: currentEffects,
                    anormalStats: anomalies.toIStatBag(),
                }

                characters.push(char)
            }


            const pi : IPlayerInfo = {
                name: enkaData.name,
                uid: this.uid,
                arLevel: enkaData.arLevel,
                description: enkaData.description,
                worldLevel: enkaData.worldLevel,
                achievementCount: enkaData.achievementCount,
                abysses: {
                    floor: enkaData.abysses.floor,
                    chamber: enkaData.abysses.chamber
                },
                characters: characters,
                profilePictureCharacterName: "characters_".concat(enkaData.profilePicture.toLowerCase(), "_face")
            }

            await this.writeData(this.uid, pi)
            res.playerInfo = pi
            res.status = ELoadStatus.SUCCESS

            return res
        } catch(e: any) {
            try {
                const p = path.join(process.cwd(), process.env.DATA_PATH!, this.uid, "player")
                const data = (await fsPromises.readFile(p)).toString()
                const resi = readIPlayerInfoWithoutCharacters(JSON.parse((data)))
                const pi : IPlayerInfo = {
                    name: resi.name,
                    uid: resi.uid,
                    arLevel: resi.arLevel,
                    description: resi.description,
                    worldLevel: resi.worldLevel,
                    achievementCount: resi.achievementCount,
                    abysses: resi.abysses,
                    characters: [],
                    profilePictureCharacterName: resi.profilePictureCharacterName
                }
                res.playerInfo = pi
                res.status = ELoadStatus.LOCAL_ONLY
                res.message = "Enka.network API threw error : ".concat(e)
                return res
            } catch (ee: any) {
                res.message = "[Updater Error] : Could not load online or local player data. Enka Error : ".concat(e)
                return res
            }
        }
    }

    public async writeData(uid: string, data: IPlayerInfo) {
        const uidList = await fsPromises.readdir(path.join(process.cwd(), "/", process.env.DATA_PATH!, "/"))
        if (!uidList.includes(uid)) {
            let p = path.join(process.cwd(), "/", process.env.DATA_PATH!, "/", uid)
            await fsPromises.mkdir(p)
            p = path.join(process.cwd(), "/", process.env.DATA_PATH!, "/", uid, "/characters")
            await fsPromises.mkdir(p)
            p = path.join(process.cwd(), "/", process.env.DATA_PATH!, "/", uid, "/rules")
            await fsPromises.mkdir(p)
        }
        let p = path.join(process.cwd(), "/", process.env.DATA_PATH!, "/", uid)
        const pi = copyIPlayerInfoWithoutCharacters(data)
        await fsPromises.writeFile(p.concat("/player"), JSON.stringify(pi))

        p = path.join(process.cwd(), "/", process.env.DATA_PATH!, "/", uid, "/characters")

        for (let i = 0; i < data.characters.length; ++i) {
            const currentChar = data.characters[i];
            const characterName = currentChar.name;
            await fsPromises.writeFile(p.concat("/", characterName), JSON.stringify(currentChar))
            const pr = path.join(process.cwd(), "/", process.env.DATA_PATH!, "/", uid, "/rules")
            const fileList = await fsPromises.readdir(pr)
            if (!fileList.includes(characterName)) {
                const ruleLabels = [EStat.HP, EStat.ATK, EStat.DEF, EStat.HP_P, EStat.ATK_P, EStat.DEF_P, EStat.EM, EStat.ER_P, EStat.CR_P, EStat.CDMG_P]
                let rule : IStatTuple[] = []
                for (let j = 0; j < 3; ++j) {
                    rule.push({
                        name: ruleLabels[j],
                        value: 0})
                }
                for (let j = 3; j < ruleLabels.length; ++j) {
                    rule.push({
                        name: ruleLabels[j],
                        value: 3
                    })
                }

                await this.writeRule(uid, {character: characterName, ruleName: "defaultRuleName", stats: rule})
            }

        }
    }

    public async writeRule(uid: string, rule: ICharacterRule) {
        const pr = path.join(process.cwd(), "/", process.env.DATA_PATH!, "/", uid, "/rules")
        await fsPromises.writeFile(pr.concat("/", rule.character), JSON.stringify(rule))
    }
}

function apiLoadLocaleLogic(arg0: string, cname: string) {
    throw new Error("Function not implemented.");
}
