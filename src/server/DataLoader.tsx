import path from "path";
import {promises as fsPromises} from 'fs';
import { ICharacterData } from "./gamedata/ICharacterData";
import { stringToEElement } from "./gamedata/enums/EElement";
import { stringToERarity } from "./gamedata/enums/ERarity";
import { stringToEWeaponType } from "./gamedata/enums/EWeaponType";
import { stringToEStat } from "./gamedata/enums/EStat";
import { StatBag } from "./gamedata/StatBag";
import { IEffect } from "./gamedata/IEffect";
import { stringToEEffectTarget } from "./gamedata/enums/EEffectTarget";
import { INumberInstances } from "./gamedata/INumberInstances";
import { IArtefact } from "./gamedata/IArtefact";
import { stringToEArtefact } from "./gamedata/enums/EArtefact";
import { ICharacterRule } from "@/app/interfaces/ICharacterRule";

export async function getUIDFolderList(): Promise<string[]> {
    const p = path.join(process.cwd(), "/data")
    const fileList = await fsPromises.readdir(p)

    return fileList;
}

function convertJsonToCharacterData(json: any): ICharacterData {

    const totalStats = new StatBag()
    const totalStatKeys = json["totalStats"]["names"]
    for (let i = 0; i < totalStatKeys.length; ++i) {
        const item = json["totalStats"]["values"][i]
        totalStats.addStat({
            name: stringToEStat(totalStatKeys[i]),
            value: item
        })
    }

    const anormalStats = new StatBag()
    const anormalStatsKeys = json["anormalStats"]["names"]
    for (let i = 0; i < anormalStatsKeys.length; ++i) {
        const item = json["anormalStats"]["values"][i]
        anormalStats.addStat({
            name: stringToEStat(anormalStatsKeys[i]),
            value: item
        })
    }

    let staticEffects: IEffect[] = []
    const staticEffectsKeys = Object.keys(json["staticEffects"])
    for (let i = 0; i < staticEffectsKeys.length; ++i) {
        const item = json["staticEffects"][i]
        let statChanges: IStatTuple[] = []
        let staticNumber: INumberInstances[] = []
        for (let j = 0; j < item["statChanges"].length; ++j) {
            statChanges.push({
                name: stringToEStat(item["statChanges"][j]["name"]),
                value: item["statChanges"][j]["value"]
            })
        }

        for (let j = 0; j < item["staticNumber"].length; ++j) {
            staticNumber.push({
                iconId: item["staticNumber"][j]["iconId"],
                name: item["staticNumber"][j]["name"],
                value: item["staticNumber"][j]["value"]
            })
        }

        const effect: IEffect = {
            source: item["source"],
            target: stringToEEffectTarget(item["target"]),
            statChanges: statChanges,
            staticNumber: staticNumber
        }

        staticEffects.push(effect)
    }

    let artefacts : IArtefact[] = []
    for (let i = 0; i < json["artefacts"].length; ++i) {
        const a = json["artefacts"][i]
        let subs : ISubStat[] = []
        for (let j = 0; j < a["subStats"].length; ++j) {
            const s = a["subStats"][j]
            subs.push({
                name: stringToEStat(s["name"]),
                value: s["value"],
                rollValue: s["rollValue"]
            })
        }

        artefacts.push({
            type: stringToEArtefact(a["type"]),
            name: a["name"],
            set: a["set"],
            level: a["level"],
            rarity: stringToERarity(a["rarity"]),
            mainStat: {
                name: stringToEStat(a["mainStat"]["name"]),
                value: a["mainStat"]["value"]
            },
            subStats: subs
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
        assets: {
            characterCard: json["assets"]["characterCard"],
            characterPortrait: json["assets"]["characterPortrait"]
        },
        commonData: {
            name: json["commonData"]["name"],
            element: stringToEElement(json["commonData"]["element"]),
            rarity: stringToERarity(json["commonData"]["rarity"]),
            weaponType: stringToEWeaponType(json["commonData"]["weaponType"]),
            ascensionStatName: stringToEStat(json["commonData"]["ascensionStatName"]),
            ascensionStatBaseValue: json["commonData"]["ascensionStatBaseValue"],
            baseStats: {
                hp: json["commonData"]["baseStats"]["hp"],
                atk: json["commonData"]["baseStats"]["atk"],
                atk_nw: json["commonData"]["baseStats"]["atk_nw"],
                def: json["commonData"]["baseStats"]["def"]
            }
        },
        weapon: {
            type: stringToEWeaponType(json["weapon"]["type"]),
            name: json["weapon"]["name"],
            mainStat: {
                name: stringToEStat(json["weapon"]["mainStat"]["name"]),
                value: json["weapon"]["mainStat"]["value"]
            },
            level: json["weapon"]["level"],
            rarity: stringToERarity(json["weapon"]["rarity"])
        },
        artefacts: artefacts,
        totalStats: totalStats.toIStatBag(),
        lastUpdated: json["lastUpdated"],
        anormalStats: anormalStats.toIStatBag(),
        staticEffects: staticEffects,
        dynamicEffects: []
    }

    return res;

}

export async function loadCharacters(uid: string) : Promise<ICharacterData[]>{
    const p = path.join(process.cwd(), "/data/", uid, "/characters")
    const fileList = await fsPromises.readdir(p)
    let res: ICharacterData[] = []
    for (let i = 0; i < fileList.length; ++i) {
        let f = fileList[i]
        const jsonData = JSON.parse((await fsPromises.readFile(p.concat("/", f))).toString())
        res.push(convertJsonToCharacterData(jsonData))
    }

    return res
}

export async function loadRules(uid: string) : Promise<ICharacterRule[]>{
    const p = path.join(process.cwd(), "/data/", uid, "/rules")
    const fileList = await fsPromises.readdir(p)
    let res: ICharacterRule[] = []
    for (let i = 0; i < fileList.length; ++i) {
        let f = fileList[i]
        const jsonData = JSON.parse((await fsPromises.readFile(p.concat("/", f))).toString())
        let values : IStatTuple[] = []
        for (let j = 0; j < jsonData["rule"].length; ++j) {
            values.push({
                name: jsonData["rule"][j]["name"],
                value: jsonData["rule"][j]["value"],
            })
        }

        res.push({
            ruleName: "defaultRuleName",
            character: jsonData["name"],
            stats: values
        })
    }

    return res
}