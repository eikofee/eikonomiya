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
import { ETalentType } from "./enums/ETalentType";
import { IConstellation } from "./IConstellation";
import { apiLogicLoadTalentsValues } from "../api/ApiLogicLoadTalentsValues";
import { INumericField } from "./INumericField";
import { IScaledNumber } from "./IScaledNumber";
import { apiLogicLoadTalentsKeys } from "../api/ApiLogicLoadTalentsKeys";
import { writeRule } from "../DataLoader";
import { INumericFieldValue } from "./INumericFieldValue";
import { stringToENumericFieldAttribute } from "./enums/ENumericFieldAttribute";

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
        try {
            const ascensionRawData = await (await fetch("https://raw.githubusercontent.com/eikofee/eikonomiya-data/master/character-ascensions.yml")).text()
            const sets = yaml.parse(ascensionRawData)
            const statName = sets[name]["stat"]
            return stringToEStat(statName)
        } catch (error) {
            return EStat.UNKNOWN
        }
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

    private buildBaseStats(ascensionStatName: EStat, ascensionStatBaseValue: number, weapon: IWeapon, artifacts: IArtifact[], ascensionLevel: number) {
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

        sb.addStat({name: ascensionStatName, value: ascensionStatBaseValue * ascendedFactor})
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

    private async getCharacterEffects(name: string): Promise<IEffect[]> {
        const characterEffectsRawData = await (await fetch("https://raw.githubusercontent.com/eikofee/eikonomiya-data/master/talents.yml", { cache: 'no-store' })).text()
        let res : IEffect[] = []
        const charEffects = yaml.parse(characterEffectsRawData)[name]
        if (charEffects != undefined) {
            return this.parseEffect(charEffects, name, "characters_".concat(this.cleanNameForPath(name), "_face"), 0)
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
            let regionRawData = ""
            try {
                regionRawData = await (await fetch("https://raw.githubusercontent.com/eikofee/eikonomiya-data/master/regions.yml")).text()
            } catch (e) {
                throw new Error("[Updater Error] Could not load region data from GitHub (https://raw.githubusercontent.com/eikofee/eikonomiya-data/master/regions.yml).");
            }

            let namecardIds:any = {}
            try {
                namecardIds = await (await fetch("https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/namecards.json")).json()
            } catch (e) {
                throw new Error("[Updater Error] Could not load namecards IDs from EnkaNetwork's GitHub (https://raw.githubusercontent.com/EnkaNetwork/API-docs/master/store/namecards.json).")
            }

            let reg:any = {}
            try {
                reg = yaml.parse(regionRawData)
            } catch (e) {
                throw new Error("[Updater Error] Could not parse YAML data from regions.")
            }

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

                let consts : IConstellation[] = []
                let cname = this.getCName(name, c.commonData.element)
                const localeInfoRequest = await apiLogicLoadLocale("characters", cname)
                const talentsValuesInfoRequest = await apiLogicLoadTalentsValues(cname)
                const talentsKeysInfoRequest = await apiLogicLoadTalentsKeys(cname)
                if (localeInfoRequest.success) {
                    const constInfo = localeInfoRequest.content!.constellations
                    for (let ii = 0; ii < 6; ++ii) {
                        if (cname != undefined && constInfo[ii] != undefined) {
                            consts.push({
                                name: constInfo[ii].name,
                                level: ii + 1,
                                description: constInfo[ii].description
                            })
                        } else {
                            consts.push({
                                name: "MISSING NAME",
                                level: ii + 1,
                                description: ["MISSING DESCRIPTION"]
                            })
                        }
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

                let currentStats = this.buildBaseStats(ascensionName, ascensionValue, weapon, artes, c.ascensionLevel)
                const artifactEffects = await this.getArtifactEffects(artes)
                const weaponEffects = await this.getWeaponEffects(weapon)
                const inherentEffect = await this.getCharacterEffects(name)
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

                // talent values
                let autoFields : INumericField[] = []
                let skillFields : INumericField[] = []
                let burstFields : INumericField[] = []
                if (talentsValuesInfoRequest.success && talentsKeysInfoRequest.success) {
                    const values = talentsValuesInfoRequest.content!
                    const keys = talentsKeysInfoRequest.content!
                    
                    let autoKey = 0;
                    for (let i = 0; i < keys.auto.length; ++i) {
                        let vs = []
                        for (let j = 0; j < keys.auto[i].values.length; ++j) {
                            const item = keys.auto[i].values[j]
                            let index = autoKey;
                            if (item.v == "auto_++") {
                                autoKey += 1
                            } else {
                                index = parseInt(item.v.split("_")[1])
                            }

                            const nv : INumericFieldValue = {
                                attribute: stringToENumericFieldAttribute(item.a),
                                leveledValues: values.auto[index],
                                flat: item.flat
                            }

                            vs.push(nv)
                        }
                        const f : INumericField = {
                            name: keys.auto[i].name,
                            values: vs
                        }

                        autoFields.push(f)
                    }

                    let skillKey = 0;
                    for (let i = 0; i < keys.skill.length; ++i) {
                        let vs = []
                        for (let j = 0; j < keys.skill[i].values.length; ++j) {
                            const item = keys.skill[i].values[j]
                            let index = skillKey;
                            if (item.v == "skill_++") {
                                skillKey += 1
                            } else {
                                index = parseInt(item.v.split("_")[1])
                            }
                            
                            const nv : INumericFieldValue = {
                                attribute: stringToENumericFieldAttribute(item.a),
                                leveledValues: values.skill[index],
                                flat: item.flat
                            }

                            vs.push(nv)
                        }
                        const f : INumericField = {
                            name: keys.skill[i].name,
                            values: vs
                        }

                        skillFields.push(f)
                    }

                    let burstKey = 0;
                    for (let i = 0; i < keys.burst.length; ++i) {
                        let vs = []
                        for (let j = 0; j < keys.burst[i].values.length; ++j) {
                            const item = keys.burst[i].values[j]
                            let index = burstKey;
                            if (item.v == "burst_++") {
                                burstKey += 1
                            } else {
                                index = parseInt(item.v.split("_")[1])
                            }
                            
                            const nv : INumericFieldValue = {
                                attribute: stringToENumericFieldAttribute(item.a),
                                leveledValues: values.burst[index],
                                flat: item.flat
                            }

                            vs.push(nv)
                        }
                        const f : INumericField = {
                            name: keys.burst[i].name,
                            values: vs
                        }

                        burstFields.push(f)
                    }
                }

                const char: ICharacterData = {
                    version: process.env.BUILD_VERSION!,
                    name: name,
                    element: c.commonData.element,
                    level: c.level,
                    ascension: {
                        level: c.ascensionLevel,
                        statName: ascensionName,
                        statValue: ascensionValue * ascendedFactor
                    },
                    friendshipLevel: c.friendship,
                    constellationLevel: c.constellation,
                    talents: {
                        auto: {
                            type: ETalentType.NORMAL,
                            name: localeInfoRequest.success ? localeInfoRequest.content!.auto.name : "",
                            description: localeInfoRequest.success ? localeInfoRequest.content!.auto.fields.normal.concat(localeInfoRequest.content!.auto.fields.charged, localeInfoRequest.content!.auto.fields.plunging) : [""],
                            icon: "",
                            level: c.skills[0].level,
                            bonusLevel: c.skillExtraLevel[0],
                            levelMax: 11,
                            fields: autoFields
                        },
                        skill: {
                            type: ETalentType.SKILL,
                            name: localeInfoRequest.success ? localeInfoRequest.content!.skill.name : "",
                            description: localeInfoRequest.success ? localeInfoRequest.content!.skill.description : [""],
                            icon: "",
                            level: c.skills[1].level,
                            bonusLevel: c.skillExtraLevel[1],
                            levelMax: 13,
                            fields: skillFields
                        },
                        burst: {
                            type: ETalentType.BURST,
                            name: localeInfoRequest.success ? localeInfoRequest.content!.burst.name : "",
                            description: localeInfoRequest.success ? localeInfoRequest.content!.burst.description : [""],
                            icon: "",
                            level: c.skills[2].level,
                            bonusLevel: c.skillExtraLevel[2],
                            levelMax: 13,
                            fields: burstFields
                        },
                    },
                    weapon: weapon,
                    artifacts: artes,
                    totalStats: currentStats.toIStatBag(),
                    dynamicEffects: [],
                    lastUpdated: Date.now(),
                    staticEffects: currentEffects,
                    anormalStats: anomalies.toIStatBag(),
                    apiName: this.cleanNameForPath(name),
                    rarity: c.commonData.rarity,
                    region: r,
                    weaponType: c.commonData.weapon,
                    constellations: consts,
                    baseStats: {
                        hp: c.baseStats.get(EStat.HP)!.value,
                        atk: c.baseStats.get(EStat.ATK)!.value,
                        atk_nw: c.baseStats.get(EStat.ATK)!.value - c.weapon.mainStat.value,
                        def: c.baseStats.get(EStat.DEF)!.value
                    }
                }

                characters.push(char)
            }

            const pi : IPlayerInfo = {
                version: process.env.BUILD_VERSION!,
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
                profilePictureCharacterName: "characters_".concat(this.cleanNameForPath(enkaData.profilePicture), "_face"),
                namecardName: namecardIds[enkaData.namecardId].icon
            }

            await this.writeData(this.uid, pi)
            res.playerInfo = pi
            res.status = ELoadStatus.SUCCESS

            return res
        } catch(e: any) {
                res.status = ELoadStatus.LOCAL_ONLY
                res.message += e + "\n[Updater Info] Attempting to load local info on player ".concat(this.uid)
            try {
                const p = path.join(process.cwd(), process.env.DATA_PATH!, this.uid, "player")
                const data = (await fsPromises.readFile(p)).toString()
                const resi = readIPlayerInfoWithoutCharacters(JSON.parse((data)))
                const pi : IPlayerInfo = {
                    version: process.env.BUILD_VERSION!,
                    name: resi.name,
                    uid: resi.uid,
                    arLevel: resi.arLevel,
                    description: resi.description,
                    worldLevel: resi.worldLevel,
                    achievementCount: resi.achievementCount,
                    abysses: resi.abysses,
                    characters: [],
                    profilePictureCharacterName: resi.profilePictureCharacterName,
                    namecardName: resi.namecardName
                }
                res.playerInfo = pi
                
                return res
            } catch (ee: any) {
                res.message += "\n" + ee + "\n[Updater Error] : Could not load online or local player data."
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
                        value: 0
                    })
                }

                await writeRule(uid, {
                    version: process.env.BUILD_VERSION!,
                    character: characterName,
                    ruleName: "defaultRuleName",
                    stats: rule,
                    currentRating: [0,0,0,0,0]})
            }

        }
    }
}