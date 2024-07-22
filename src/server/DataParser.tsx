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
import { stringToETalentType } from "./gamedata/enums/ETalentType";


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
        version: process.env.BUILD_VERSION!,
        name: json["name"],
        element: stringToEElement(json["element"]),
        level: json["level"],
        ascension: {
            level: json["ascension"]["level"],
            statName: stringToEStat(json["ascension"]["statName"]),
            statValue: json["ascension"]["statValue"]
        },
        friendshipLevel: json["friendshipLevel"],
        talents: {
            auto: {
                type: stringToETalentType(json["talents"]["auto"]["type"]),
                name: json["talents"]["auto"]["name"],
                description: json["talents"]["auto"]["description"],
                icon: json["talents"]["auto"]["icon"],
                level: json["talents"]["auto"]["level"],
                bonusLevel: json["talents"]["auto"]["bonusLevel"],
                levelMax: json["talents"]["auto"]["levelMax"],
                fields: json["talents"]["auto"]["fields"]
            },
            skill: {
                type: stringToETalentType(json["talents"]["skill"]["type"]),
                name: json["talents"]["skill"]["name"],
                description: json["talents"]["skill"]["description"],
                icon: json["talents"]["skill"]["icon"],
                level: json["talents"]["skill"]["level"],
                bonusLevel: json["talents"]["skill"]["bonusLevel"],
                levelMax: json["talents"]["skill"]["levelMax"],
                fields: json["talents"]["skill"]["fields"]
            },
            burst: {
                type: stringToETalentType(json["talents"]["burst"]["type"]),
                name: json["talents"]["burst"]["name"],
                description: json["talents"]["burst"]["description"],
                icon: json["talents"]["burst"]["icon"],
                level: json["talents"]["burst"]["level"],
                bonusLevel: json["talents"]["burst"]["bonusLevel"],
                levelMax: json["talents"]["burst"]["levelMax"],
                fields: json["talents"]["burst"]["fields"]
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
        constellationLevel: parseInt(json["constellationLevel"]),
        apiName: json["apiName"],
        rarity: stringToERarity(json["rarity"]),
        region: stringToERegion(json["region"]),
        weaponType: stringToEWeaponType(json["weaponType"]),
        constellations: json["constellations"],
        baseStats: json["baseStats"]
    }

    return res;

}