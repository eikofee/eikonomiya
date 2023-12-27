import { EnkaBridge } from "./EnkaBridge"
import { EnkaTranslator, buildEnkaTranslator } from "./EnkaTranslator"
import { ICharacterData } from "./ICharacterData"
import { IPlayerInfo } from "./IPlayerInfo"
import * as yaml from 'yaml';
import { IWeapon } from "./IWeapon";
import { IArtefact } from "./IArtefact";
import { StatBag } from "./StatBag";
import { IEffect } from "./IEffect";
import { EEffectTarget } from "./enums/EEffectTarget";
import { EikoDataTranslator } from "./EikoDataTranslator";
import { ICharacterCommonData } from "./ICharacterCommonData";
import { ERarity } from "./enums/ERarity";
import { EStat } from "./enums/EStat";
import { promises as fsPromises } from 'fs';
import path from "path";
import { ICharacterRule } from "@/app/interfaces/ICharacterRule";


export class Updater {

    uid: string = ""
    enkaTranslator!: EnkaTranslator
    eikoDataTranslator! : EikoDataTranslator
    bridge!:EnkaBridge

    constructor (uid: string) {
        this.uid = uid
    }
    
    public async initialize() {
        this.enkaTranslator = await buildEnkaTranslator()
        this.eikoDataTranslator = new EikoDataTranslator()
        this.bridge = new EnkaBridge(this.uid, this.enkaTranslator)
    }

    private async getAscensionStatName(name: string) : Promise<EStat> {
        const ascensionRawData = await (await fetch("https://raw.githubusercontent.com/eikofee/eikonomiya-data/master/character-ascensions.yml")).text()
        const sets = yaml.parse(ascensionRawData)
        const statName = sets[name]["stat"]
        return this.eikoDataTranslator.yamlToStat(statName)
    }
    
    private async computeAscensionStatValue(statName: EStat, characterName: string, rarity: ERarity): Promise<number> {
        const values = await (await fetch("https://raw.githubusercontent.com/eikofee/eikonomiya-data/master/ascension-values.yml")).text()
        const sets = yaml.parse(values)
        const baseValue = sets[this.eikoDataTranslator.statToYaml(statName)]
        let rarityMultiplier = 1
        if (characterName != "Lumine" && characterName != "Aether" && (rarity == ERarity.V || rarity == ERarity.V_RED)) {
            rarityMultiplier = 1.2
        }

        return baseValue * rarityMultiplier;
    }

    private buildBaseStats(characterBase : ICharacterCommonData, weapon: IWeapon, artefacts: IArtefact[], ascensionLevel: number) {
        let sb = new StatBag()
        // sb.addStat({name: EStat.HP, value: characterBase.baseStats.hp})
        // sb.addStat({name: EStat.ATK, value: characterBase.baseStats.atk})
        // sb.addStat({name: EStat.DEF, value: characterBase.baseStats.def})
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

    private async getArtefactEffects(arte : IArtefact[]): Promise<IEffect[]> {
        const artefactSetRawData = await (await fetch("https://raw.githubusercontent.com/eikofee/eikonomiya-data/master/artefacts.yml")).text()
        const equipSets : Record<string, number> = {}
        const setNames = []
        for (let i = 0; i < arte.length; ++i) {
            const set = arte[i].set
            if (equipSets[set] == undefined) {
                equipSets[set] = 1
                setNames.push(set)
            } else {
                equipSets[set] = equipSets[set] + 1
            }
        }

        let res : IEffect[] = []
        const sets = yaml.parse(artefactSetRawData)
        // TODO: Change for better effect parsing
        for (let i = 0; i < setNames.length; ++i) {
            const set = setNames[i]
            if (equipSets[set] >= 2) {
                const rawEffects = sets[set]["2pc"]
                for (let j = 0; j < rawEffects.length; ++j) {
                    const rawEffect = rawEffects[j]
                    if (rawEffect["type"] == "buff") {
                        for (let k = 0; k < rawEffect["buff"].length; ++k) {
                            const currentBuff = rawEffect["buff"][k]
                            const target = this.eikoDataTranslator.yamlToStat(currentBuff["target"])
                            const stat = this.eikoDataTranslator.yamlToStat(currentBuff["stat"])
                            const value = parseFloat(currentBuff["value"])
                            const e : IEffect = {
                                source: set.concat(" 2pc"),
                                target: EEffectTarget.SELF,
                                statChanges: [{name: stat, value: value}],
                                staticNumber: []
                            }

                            res.push(e)
                        }
                    }
                }
            }

            if (equipSets[set] >= 4) {
                const rawEffects = sets[set]["4pc"]
                for (let j = 0; j < rawEffects.length; ++j) {
                    const rawEffect = rawEffects[j]
                    if (rawEffect["type"] == "buff") {
                        for (let k = 0; k < rawEffect["buff"].length; ++k) {
                            const currentBuff = rawEffect["buff"][k]
                            const target = this.eikoDataTranslator.yamlToStat(currentBuff["target"])
                            const stat = this.eikoDataTranslator.yamlToStat(currentBuff["stat"])
                            const value = parseFloat(currentBuff["value"])
                            const e : IEffect = {
                                source: set.concat(" 4pc"),
                                target: EEffectTarget.SELF,
                                statChanges: [{name: stat, value: value}],
                                staticNumber: []
                            }

                            res.push(e)
                        }
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
                region: this.eikoDataTranslator.yamlToRegion(reg[name]),
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
                refinement: c.weapon.refinement,
                ascensionLevel: c.weapon.ascensionLevel,
                assets: {
                    icon: "/weaponIcons/".concat(c.weapon.name.replaceAll(" ", "").replaceAll("'",""), "/weapon", c.weapon.ascensionLevel > 1 ? "-awake.png":".png")
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
                        icon: "/artefactIcons/".concat(arte.set.replaceAll(" ", "").replaceAll("'",""),"/", arte.type, ".png")
                    }
                }

                artes.push(a)
            }

            let currentStats = this.buildBaseStats(common, weapon, artes, c.ascensionLevel)

            const artefactEffects = await this.getArtefactEffects(artes)
            // const weaponEffects = await this.getWeaponEffects(common, currentStats)
            // const inherentEffect = this.getCharacterPassiveEffects()


            for (let j = 0; j < artefactEffects.length; ++j) {
                const currentEffect = artefactEffects[j]
                for (let k = 0; k < currentEffect.statChanges.length; ++k) {
                    currentStats.addStat(currentEffect.statChanges[k])
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
                staticEffects: artefactEffects,
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

        this.writeData(this.uid, res)
        return res
    }

    public async writeData(uid: string, data: IPlayerInfo) {
        const uidList = await fsPromises.readdir(path.join(process.cwd(), "/data/"))
        if (!uidList.includes(uid)) {
            fsPromises.mkdir(path.join(process.cwd(), "/data/", uid))
            fsPromises.mkdir(path.join(process.cwd(), "/data/", uid, "/characters"))
            fsPromises.mkdir(path.join(process.cwd(), "/data/", uid, "/rules"))
        }

        let p = path.join(process.cwd(), "/data/", uid, "/characters")

        for (let i = 0; i < data.characters.length; ++i) {
            const currentChar = data.characters[i];
            const characterName = currentChar.name;
            await fsPromises.writeFile(p.concat("/", characterName), JSON.stringify(currentChar))
            const pr = path.join(process.cwd(), "/data/", uid, "/rules")
            const fileList = await fsPromises.readdir(pr)
            if (!fileList.includes(characterName)) {
                const ruleLabels = [EStat.HP, EStat.ATK, EStat.DEF, EStat.HP_P, EStat.ATK_P, EStat.DEF_P, EStat.EM, EStat.ER_P, EStat.CR_P, EStat.CDMG_P]
                let rule : IStatTuple[] = []
                for (let j = 0; j < ruleLabels.length; ++j) {
                    rule.push({
                        name: ruleLabels[j],
                        value: 3
                    })
                }

                this.writeRule(uid, {character: characterName, ruleName: "defaultRuleName", stats: rule})
            }

        }
    }

    public async writeRule(uid: string, rule: ICharacterRule) {
        const pr = path.join(process.cwd(), "/data/", uid, "/rules")
            // const content = {
            //     "name": rule.character,
            //     "rule": rule.stats,
            //     "lastUpdated": Date.now()
            //         }

                await fsPromises.writeFile(pr.concat("/", rule.character), JSON.stringify(rule))
    }
}