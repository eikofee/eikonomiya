import { EnkaBridge } from "./EnkaBridge"
import { EnkaTranslator, buildEnkaTranslator } from "./EnkaTranslator"
import { ICharacterData } from "./ICharacterData"
import { IPlayerInfo } from "./IPlayerInfo"
import * as yaml from 'yaml';
import { IWeapon } from "./IWeapon";
import { IArtefact } from "./IArtefact";
import { StatBag } from "./StatBag";
import { IEffect } from "./IEffect";
import { ETarget, stringToETarget } from "./enums/EEffectTarget";
import { ICharacterCommonData } from "./ICharacterCommonData";
import { ERarity } from "./enums/ERarity";
import { EStat, stringToEStat } from "./enums/EStat";
import { promises as fsPromises, stat } from 'fs';
import path from "path";
import { ICharacterRule } from "@/app/interfaces/ICharacterRule";
import { EEffectType, stringToEEffectType } from "./enums/EEffectType";
import { IStatTuple } from "./IStatTuple";
import { addOptions } from "./IEffectOptions";
import { IEffectImplication } from "./IEffectImplication";
import { IStatRatio } from "./IStatRatio";
import { stringToERegion } from "./enums/ERegion";


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
        s = s.replaceAll(" of ", " Of ").replaceAll(" the ", " The ").replaceAll('"', "")
        return s.replaceAll(" ", "").replaceAll("'", "").replaceAll("-", "")
    }

    private buildBaseStats(characterBase : ICharacterCommonData, weapon: IWeapon, artefacts: IArtefact[], ascensionLevel: number) {
        let sb = new StatBag()
        sb.addStat({name: EStat.ER_P, value: 1})
        sb.addStat({name: EStat.CR_P, value: 0.05})
        sb.addStat({name: EStat.CDMG_P, value: 0.5})
        if (weapon.subStat != undefined) {
            sb.addStat({name: weapon.subStat.name, value: weapon.subStat.value})
        }

        for (let i = 0; i < artefacts.length; ++i) {
            let a = artefacts[i]
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

    private parseEffect(data: any[], defaultName: string, defaultIcon: string, refinement: number) : IEffect[] {
        let res = []
        for (let i = 0; i < data.length; ++i) {
            let effectName = defaultName
            const rawEffect = data[i];
            if (rawEffect["name"] != undefined) {
                effectName = rawEffect["name"]
            }

            let effectTag = ""
            if (rawEffect["tag"] != undefined) {
                effectTag = rawEffect["tag"]
            }

            const effectType = stringToEEffectType(rawEffect["type"])
            const text = rawEffect["text"] != undefined ? rawEffect["text"] : ""
            const maxstack = rawEffect["maxstack"] != undefined ? rawEffect["maxstack"] : 0
            let implicationsSet : IEffectImplication[][] = []
            let implications : IEffectImplication[] = []
            let statChanges : IStatTuple[] = []
            if (effectType != undefined) {
                switch (effectType) {
                    case EEffectType.STATIC:
                    case EEffectType.BOOLEAN:
                        implications = []
                        for (let k = 0; k < rawEffect["effects"].length; ++k) {
                            const e = rawEffect["effects"][k]
                            const target = e["target"]
                            let flatValue : IStatTuple | undefined = undefined
                            let ratioValue : IStatRatio | undefined = undefined
                            if (e["source"] != undefined) {
                                const sourceStat = stringToEStat(e["source"])
                                const targetStat = stringToEStat(e["stat"])
                                let ratio = 1
                                if (e["ratio"] != undefined) {
                                    ratio = parseFloat(e["ratio"])
                                } else {
                                    const minratio = parseFloat(e["minratio"])
                                    const maxratio = parseFloat(e["maxratio"])
                                    const interval = maxratio - minratio
                                    const step = interval / 4
                                    ratio = minratio + step * (refinement == 0 ? 0 : Math.max(0, refinement - 1))
                                }

                                const base = (e["base"] != undefined ? parseFloat(e["base"]) : 0)
                                const step = (e["step"] != undefined ? parseFloat(e["step"]) : 0)

                                let maxvalue = 0
                                if (e["minmaxvalue"] != undefined) {
                                    const minmaxvalue = parseFloat(e["minmaxvalue"])
                                    const maxmaxvalue = parseFloat(e["maxmaxvalue"])
                                    const interval = maxmaxvalue - minmaxvalue
                                    const step = interval / 4
                                    maxvalue = minmaxvalue + step * (refinement == 0 ? 0 : Math.max(0, refinement - 1))
                                } else {
                                    maxvalue = parseFloat(e["maxvalue"])
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
                                const stat = stringToEStat(e["stat"])
                                let value = 0;
                                if (e["value"] != undefined) {
                                    value = parseFloat(e["value"])
                                } else {
                                    const minvalue = parseFloat(e["minvalue"])
                                    const maxvalue = parseFloat(e["maxvalue"])
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
                        for (let k = 0; k < rawEffect["effects"].length; ++k) {
                            let flatValue : IStatTuple | undefined = undefined
                            let ratioValue : IStatRatio | undefined = undefined
                            const e = rawEffect["effects"][k]
                            const target = e["target"]
                            const stat = stringToEStat(e["stat"])
                            if (e["source"] != undefined) {
                                const sourceStat = stringToEStat(e["source"])
                                const targetStat = stringToEStat(e["stat"])
                                let ratio = 1
                                if (e["ratio"] != undefined) {
                                    ratio = parseFloat(e["ratio"])
                                } else {
                                    const minratio = parseFloat(e["minratio"])
                                    const maxratio = parseFloat(e["maxratio"])
                                    const interval = maxratio - minratio
                                    const step = interval / 4
                                    ratio = minratio + step * (refinement == 0 ? 0 : Math.max(0, refinement - 1))
                                }

                                const base = (e["base"] != undefined ? parseFloat(e["base"]) : 0)
                                const step = (e["step"] != undefined ? parseFloat(e["step"]) : 0)

                                let maxvalue = 0
                                if (e["minmaxvalue"] != undefined) {
                                    const minmaxvalue = parseFloat(e["minmaxvalue"])
                                    const maxmaxvalue = parseFloat(e["maxmaxvalue"])
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
                                if (e["value"] != undefined) {
                                    value = parseFloat(e["value"])
                                } else {
                                    const minvalue = parseFloat(e["minvalue"])
                                    const maxvalue = parseFloat(e["maxvalue"])
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
                            for (let k = 0; k < rawEffect["effects"][kk].length; ++k) {
                                let flatValue : IStatTuple | undefined = undefined
                                let ratioValue : IStatRatio | undefined = undefined
                                const e = rawEffect["effects"][kk][k]
                                const target = e["target"]
                                const stat = stringToEStat(e["stat"])
                                if (e["source"] != undefined) {
                                    const sourceStat = stringToEStat(e["source"])
                                    const targetStat = stringToEStat(e["stat"])
                                    let ratio = 1
                                    if (e["ratio"] != undefined) {
                                        ratio = parseFloat(e["ratio"])
                                    } else {
                                        const minratio = parseFloat(e["minratio"])
                                        const maxratio = parseFloat(e["maxratio"])
                                        const interval = maxratio - minratio
                                        const step = interval / 4
                                        ratio = minratio + step * (refinement == 0 ? 0 : Math.max(0, refinement - 1))
                                    }

                                    const base = (e["base"] != undefined ? parseFloat(e["base"]) : 0)
                                    const step = (e["step"] != undefined ? parseFloat(e["step"]) : 0)

                                    let maxvalue = 0
                                    if (e["minmaxvalue"] != undefined) {
                                        const minmaxvalue = parseFloat(e["minmaxvalue"])
                                        const maxmaxvalue = parseFloat(e["maxmaxvalue"])
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
                                    if (e["value"] != undefined) {
                                        value = parseFloat(e["value"])
                                    } else {
                                        const minvalue = parseFloat(e["minvalue"])
                                        const maxvalue = parseFloat(e["maxvalue"])
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
                source: effectName,
                tag: effectTag,
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
        const weaponEffectsRawData = await (await fetch("https://raw.githubusercontent.com/eikofee/eikonomiya-data/master/weapons.yml", { cache: 'no-store' })).text()
        let res : IEffect[] = []
        const weaponEffects = yaml.parse(weaponEffectsRawData)[weapon.name]
        if (weaponEffects != undefined) {
            return this.parseEffect(weaponEffects, weapon.name, weapon.assets.icon, weapon.refinement)
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

    private async getArtefactEffects(arte : IArtefact[]): Promise<IEffect[]> {
        const artefactSetRawData = await (await fetch("https://raw.githubusercontent.com/eikofee/eikonomiya-data/master/artefacts.yml")).text()
        const equipSets : Record<string, number> = {}
        const setNames = []
        const iconNames = []
        for (let i = 0; i < arte.length; ++i) {
            const set = arte[i].set
            if (equipSets[set] == undefined) {
                equipSets[set] = 1
                setNames.push(set)
                const iconNameSplit = arte[i].assets.icon.split("/")
                iconNameSplit[iconNameSplit.length - 1] = "fleur.png"
                iconNames.push(iconNameSplit.join("/"))
            } else {
                equipSets[set] = equipSets[set] + 1
            }
        }

        let res : IEffect[] = []
        const sets = yaml.parse(artefactSetRawData)
        // TODO: Change for better effect parsing
        for (let i = 0; i < setNames.length; ++i) {
            const set = setNames[i]
            const rawEffects = sets[set]
            if (rawEffects != undefined){
                const effects = this.parseEffect(rawEffects, set, iconNames[i], 0)
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

    public async loadPlayerData() : Promise<IPlayerInfo> {
        const enkaData = await this.bridge.loadPlayerData()
        let characters : ICharacterData[] = []
        const regionRawData = await (await fetch("https://raw.githubusercontent.com/eikofee/eikonomiya-data/master/regions.yml")).text()
        const reg = yaml.parse(regionRawData)
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

            let p = path.join(process.cwd(), "/public/characterCards")
            let fileList = await fsPromises.readdir(p)
            const extensions = [".jpg", ".jpeg", ".png"]
            let charCard = "";
            for (let i = 0; i < extensions.length; ++i) {
                const fname = name.toLowerCase().concat(extensions[i])
                if (fileList.includes(fname)) {
                    charCard = "/characterCards/".concat(fname)
                }
            }

            p = path.join(process.cwd(), "/public/characterPortraits")
            fileList = await fsPromises.readdir(p)
            let characterPortrait = "";
            for (let i = 0; i < extensions.length; ++i) {
                const fname = name.toLowerCase().concat(extensions[i])
                if (fileList.includes(fname)) {
                    characterPortrait = "/characterPortraits/".concat(fname)
                }
            }

            const common: ICharacterCommonData = {
                name: name,
                element: c.commonData.element,
                region: stringToERegion(reg[name]),
                rarity: c.commonData.rarity,
                weaponType: c.commonData.weapon,
                ascensionStatName: ascensionName,
                ascensionStatBaseValue: ascensionValue,
                assets: {
                    characterCard: charCard,
                    characterPortrait: characterPortrait
                },
                baseStats: {
                    hp: c.baseStats.get(EStat.HP)!.value,
                    atk: c.baseStats.get(EStat.ATK)!.value,
                    atk_nw: c.baseStats.get(EStat.ATK)!.value - c.weapon.mainStat.value,
                    def: c.baseStats.get(EStat.DEF)!.value
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
                    icon: "/weaponIcons/".concat(this.cleanNameForPath(c.weapon.name), "/weapon", c.weapon.ascensionLevel > 1 ? "-awake.png":".png")
                }
            }

            let artes = []
            for (let j = 0; j < c.artefacts.length; ++j) {
                const arte = c.artefacts[j]
                const a : IArtefact = {
                    type: arte.type,
                    name: this.enkaTranslator.translate(arte.name),
                    set: arte.set,
                    level: arte.level,
                    rarity: arte.rarity,
                    mainStat: arte.mainStat,
                    subStats: arte.subStats,
                    assets: {
                        icon: "/artefactIcons/".concat(this.cleanNameForPath(arte.set), "/", arte.type, ".png")
                    }
                }

                artes.push(a)
            }

            let currentStats = this.buildBaseStats(common, weapon, artes, c.ascensionLevel)
            const artefactEffects = await this.getArtefactEffects(artes)
            const weaponEffects = await this.getWeaponEffects(weapon)
            const inherentEffect = await this.getCharacterEffects(common)
            const currentEffects = artefactEffects.concat(weaponEffects, inherentEffect)


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
                skills: {
                    levelAA: c.skills[0].level,
                    levelSkill: c.skills[1].level,
                    levelUlt: c.skills[2].level
                },
                commonData: common,
                weapon: weapon,
                artefacts: artes,
                totalStats: currentStats.toIStatBag(),
                dynamicEffects: [],
                lastUpdated: Date.now(),
                staticEffects: currentEffects,
                anormalStats: anomalies.toIStatBag(),
            }

            characters.push(char)
        }

        const res : IPlayerInfo = {
            name: enkaData.name,
            arLevel: enkaData.arLevel,
            description: enkaData.description,
            worldLevel: enkaData.worldLevel,
            achievementCount: enkaData.achievementCount,
            abysses: {
                floor: enkaData.abysses.floor,
                chamber: enkaData.abysses.chamber
            },
            characters: characters,
            profilePictureCharacterName: this.enkaTranslator.translate(enkaData.profilePicture) 
        }

        await this.writeData(this.uid, res)
        return res
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

        let p = path.join(process.cwd(), "/", process.env.DATA_PATH!, "/", uid, "/characters")

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