import { IArtifact } from "./gamedata/IArtifact";
import { ICharacterData } from "./gamedata/ICharacterData";
import { IEffect } from "./gamedata/IEffect";
import { IEffectImplication } from "./gamedata/IEffectImplication";
import { addOptions } from "./gamedata/IEffectOptions";
import { INumberInstance } from "./gamedata/INumberInstances";
import { IStatRatio } from "./gamedata/IStatRatio";
import { IStatTuple } from "./gamedata/IStatTuple";
import { ISubStat } from "./gamedata/ISubStat";
import { StatBag } from "./gamedata/StatBag";
import { stringToEArtifact } from "./gamedata/enums/EArtifact";
import { stringToETarget } from "./gamedata/enums/ETarget";
import { stringToEEffectType, EEffectType } from "./gamedata/enums/EEffectType";
import { stringToEElement } from "./gamedata/enums/EElement";
import { stringToERarity } from "./gamedata/enums/ERarity";
import { stringToERegion } from "./gamedata/enums/ERegion";
import { stringToEStat } from "./gamedata/enums/EStat";
import { stringToEWeaponType } from "./gamedata/enums/EWeaponType";
import * as yaml from 'yaml';


export function parseEffect(data: any[], defaultName: string, defaultIcon: string) : IEffect[] {
    let res = []
    const refinement = 0
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

        let effectSource = ""
        if (rawEffect["source"] != undefined) {
            effectSource = rawEffect["source"]
        }

        let effectSource2 = ""
        if (rawEffect["source2"] != undefined) {
            effectSource2 = rawEffect["source2"]
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

        const keywords = rawEffect["keywords"] != undefined ? rawEffect["keywords"].split(" ") : []

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

export function parseAllEffects(y: string) : IEffect[] {
    const effects = yaml.parse(y)
    const allEffectList = parseEffect(effects, "defaultName", "")
    return allEffectList
}

export function parseCharacterData(json: any): ICharacterData {
    const totalStats = new StatBag()
    const totalStatKeys = json["totalStats"]["names"]
    for (let i = 0; i < totalStatKeys.length; ++i) {
        const item = json["totalStats"]["values"][i]
        totalStats.addStat({
            name: stringToEStat(totalStatKeys[i]),
            value: item,
        })
    }

    const anormalStats = new StatBag()
    const anormalStatsKeys = json["anormalStats"]["names"]
    for (let i = 0; i < anormalStatsKeys.length; ++i) {
        const item = json["anormalStats"]["values"][i]
        anormalStats.addStat({
            name: stringToEStat(anormalStatsKeys[i]),
            value: item,
        })
    }

    let staticEffects: IEffect[] = []
    const staticEffectsKeys = Object.keys(json["staticEffects"])
    for (let i = 0; i < staticEffectsKeys.length; ++i) {
        const item = json["staticEffects"][i]
        let statChanges: IStatTuple[] = []
        let ratioNumbers: INumberInstance[] = []
        for (let j = 0; j < item["statChanges"].length; ++j) {
            statChanges.push({
                name: stringToEStat(item["statChanges"][j]["name"]),
                value: item["statChanges"][j]["value"],
            })
        }
        let implicationSet: IEffectImplication[][] = []
        for (let jj = 0; jj < item["implications"].length; ++jj) {

            let implications: IEffectImplication[] = []
            for (let j = 0; j < item["implications"][jj].length; ++j) {
                const impl = item["implications"][jj][j]
                const iei: IEffectImplication = {
                    target: stringToETarget(impl["target"]),
                    flatValue: impl["flatValue"] == undefined ? undefined : {
                        name: stringToEStat(impl["flatValue"]["name"]),
                        value: parseFloat(impl["flatValue"]["value"])
                    },
                    ratioValue: impl["ratioValue"] == undefined ? undefined : {
                        base: parseFloat(impl["ratioValue"]["base"]),
                        maxvalue: parseFloat(impl["ratioValue"]["maxvalue"]),
                        ratio: parseFloat(impl["ratioValue"]["ratio"]),
                        source: stringToEStat(impl["ratioValue"]["source"]),
                        target: stringToEStat(impl["ratioValue"]["target"]),
                        step: parseFloat(impl["ratioValue"]["step"])
                        
                    }
                }

                implications.push(iei)
            }

            implicationSet.push(implications)
        }
            
        const effect: IEffect = {
            name: item["name"],
            source: item["source"],
            // source2: item["source2"],
            icon: item["icon"],
            text: item["text"],
            keywords: item["keywords"],
            options: {
                enabled: item["options"]["enabled"],
                stack: parseInt(item["options"]["stack"]),
                maxstack: parseInt(item["options"]["maxstack"]),
            },
            type: stringToEEffectType(item["type"]),
            statChanges: statChanges,
            implications: implicationSet,
            tag: item["tag"]
        }

        staticEffects.push(effect)
    }

    let artifacts : IArtifact[] = []
    for (let i = 0; i < json["artifacts"].length; ++i) {
        const a = json["artifacts"][i]
        let subs : ISubStat[] = []
        for (let j = 0; j < a["subStats"].length; ++j) {
            const s = a["subStats"][j]
            subs.push({
                name: stringToEStat(s["name"]),
                value: s["value"],
                rollValue: s["rollValue"]
            })
        }

        artifacts.push({
            type: stringToEArtifact(a["type"]),
            name: a["name"],
            set: a["set"],
            level: a["level"],
            rarity: stringToERarity(a["rarity"]),
            mainStat: {
                name: stringToEStat(a["mainStat"]["name"]),
                value: a["mainStat"]["value"],
            },
            subStats: subs,
            assets: {
                icon: a["assets"]["icon"]
            }
        })
    }

    const res : ICharacterData = {
        name: json["name"],
        element: stringToEElement(json["element"]),
        level: json["level"],
        ascensionLevel: json["ascensionLevel"],
        ascensionStatName: json["ascensionStatName"],
        ascensionStatValue: json["ascensionStatValue"],
        friendshipLevel: json["friendshipLevel"],
        skills: {
            levelAA: json["skills"]["levelAA"],
            levelSkill: json["skills"]["levelSkill"],
            levelUlt: json["skills"]["levelUlt"]
        },
        commonData: {
            name: json["commonData"]["name"],
            element: stringToEElement(json["commonData"]["element"]),
            region: stringToERegion(json["commonData"]["region"]),
            rarity: stringToERarity(json["commonData"]["rarity"]),
            weaponType: stringToEWeaponType(json["commonData"]["weaponType"]),
            ascensionStatName: stringToEStat(json["commonData"]["ascensionStatName"]),
            ascensionStatBaseValue: json["commonData"]["ascensionStatBaseValue"],
            assets: {
                characterPortrait: json["commonData"]["assets"]["characterPortrait"],
                characterCard: json["commonData"]["assets"]["characterCard"],
                characterNameCard: json["commonData"]["assets"]["characterNameCard"],
                aa: json["commonData"]["assets"]["aa"],
                skill: json["commonData"]["assets"]["skill"],
                burst: json["commonData"]["assets"]["burst"],
                a1: json["commonData"]["assets"]["a1"],
                a4: json["commonData"]["assets"]["a4"],
                c1: json["commonData"]["assets"]["c1"],
                c2: json["commonData"]["assets"]["c2"],
                c3: json["commonData"]["assets"]["c3"],
                c4: json["commonData"]["assets"]["c4"],
                c5: json["commonData"]["assets"]["c5"],
                c6: json["commonData"]["assets"]["c6"]
            },
            baseStats: {
                hp: json["commonData"]["baseStats"]["hp"],
                atk: json["commonData"]["baseStats"]["atk"],
                atk_nw: json["commonData"]["baseStats"]["atk_nw"],
                def: json["commonData"]["baseStats"]["def"]
            },
            constNames: {
                c1: json["commonData"]["constNames"]["c1"],
                c2: json["commonData"]["constNames"]["c2"],
                c3: json["commonData"]["constNames"]["c3"],
                c4: json["commonData"]["constNames"]["c4"],
                c5: json["commonData"]["constNames"]["c5"],
                c6: json["commonData"]["constNames"]["c6"]
            },
            constTexts: {
                c1: json["commonData"]["constTexts"]["c1"],
                c2: json["commonData"]["constTexts"]["c2"],
                c3: json["commonData"]["constTexts"]["c3"],
                c4: json["commonData"]["constTexts"]["c4"],
                c5: json["commonData"]["constTexts"]["c5"],
                c6: json["commonData"]["constTexts"]["c6"]
            }
        },
        weapon: {
            type: stringToEWeaponType(json["weapon"]["type"]),
            name: json["weapon"]["name"],
            mainStat: {
                name: stringToEStat(json["weapon"]["mainStat"]["name"]),
                value: json["weapon"]["mainStat"]["value"],
            },
            subStat: json["weapon"]["subStat"] == undefined ? undefined : {
                name: stringToEStat(json["weapon"]["subStat"]["name"]),
                value: json["weapon"]["subStat"]["value"],
            },
            level: json["weapon"]["level"],
            rarity: stringToERarity(json["weapon"]["rarity"]),
            ascensionLevel: json["weapon"]["ascensionLevel"],
            assets: {
                icon: json["weapon"]["assets"]["icon"]
            },
            refinement: json["weapon"]["refinement"]
        },
        artifacts: artifacts,
        totalStats: totalStats.toIStatBag(),
        lastUpdated: json["lastUpdated"],
        anormalStats: anormalStats.toIStatBag(),
        staticEffects: staticEffects,
        dynamicEffects: [],
        constellation: parseInt(json["constellation"])
    }

    return res;

}