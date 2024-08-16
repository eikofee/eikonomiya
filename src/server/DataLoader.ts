import path from "path";
import {promises as fsPromises} from 'fs';
import fs from 'fs';
import { ICharacterData } from "./gamedata/ICharacterData";
import { buildDefaultICharacterRule, ICharacterRule } from "@/app/interfaces/ICharacterRule";
import { IStatTuple } from "./gamedata/IStatTuple";
import { buildDefaultIPlayerInfo, IPlayerInfoWithoutCharacters, readIPlayerInfoWithoutCharacters } from "./gamedata/IPlayerInfo";
import { parseAllEffects, parseCharacterData, parseEffect } from "./DataParser";
import { IConfigDirector, ETheme, buildDefaultConfigDirector } from "@/app/classes/ConfigDirector";
import { IEffect } from "./gamedata/IEffect";
import { upgradeCharacterDataFile, upgradeConfigFile, upgradePlayerFile, upgradeRuleDataFile } from "./DataUpgrade";
import * as yaml from 'yaml';


export async function checkDataFolderExistence(): Promise<boolean> {
    const p = path.resolve(process.cwd())
    const fileList = await fsPromises.readdir(p)
    if (!fileList.includes("data")) {
        throw new Error("Data folder does not exist.")
    }

    return true
}

export async function buildPathToDataFolder(...p: string[]): Promise<string> {
    await checkDataFolderExistence()
    const arr = [process.cwd(), process.env.DATA_PATH!]
    const pa = arr.concat(p)
    let ext = ""
    if (pa[pa.length - 1].includes(".")) {
        ext = pa[pa.length - 1]
        pa.pop()
    }

    const base = path.resolve(pa.join("/").concat(ext))
    if (fs.existsSync(base)) {
        return base
    } else {
        throw new Error ("Path ".concat(base, " does not exist."))
    }
}

export async function getPlayerInfoList(): Promise<IPlayerInfoWithoutCharacters[]> {
    let res : IPlayerInfoWithoutCharacters[] = []
    const p = await buildPathToDataFolder()
    let scannedFiles = [];
    const fileList = await fsPromises.readdir(p)
    for (let i = 0; i < fileList.length; ++i) {
        scannedFiles.push(fileList[i])
        if (!fileList[i].includes(".")) {
            const pl = path.resolve(process.cwd(), process.env.DATA_PATH!, fileList[i])
            const files = await fsPromises.readdir(pl)
            
            if (files.includes("player")) {
                let jsonData = JSON.parse((await fsPromises.readFile(pl.concat("/player"))).toString())
                const upgrade = upgradePlayerFile(jsonData)
                if (upgrade.edited) {
    
                }

                jsonData = upgrade.content
                const pi = readIPlayerInfoWithoutCharacters(jsonData)
                res.push(pi)
            }
        }
    }

    return res
}

export async function getPlayerInfoLight(uid: string) : Promise<IPlayerInfoWithoutCharacters> {
    const p = await buildPathToDataFolder()
    let scannedFiles = [];
    const fileList = await fsPromises.readdir(p)
    for (let i = 0; i < fileList.length; ++i) {
        scannedFiles.push(fileList[i])
        if (!fileList[i].includes(".") && fileList[i] == uid) {
            const pl = path.resolve(process.cwd(), process.env.DATA_PATH!, fileList[i])
            const files = await fsPromises.readdir(pl)
            
            if (files.includes("player")) {
                let jsonData = JSON.parse((await fsPromises.readFile(pl.concat("/player"))).toString())
                const upgrade = upgradePlayerFile(jsonData)
                if (upgrade.edited) {
    
                }

                jsonData = upgrade.content
                const pi = readIPlayerInfoWithoutCharacters(jsonData)
                return pi
            }
        }
        
    }

    return buildDefaultIPlayerInfo()

}

export async function loadConfigFile(createIfDoesNotExist: boolean) : Promise<IConfigDirector> {
    const iconfig = buildDefaultConfigDirector()
    const p = await buildPathToDataFolder()
    const fileList = await fsPromises.readdir(p)
    if (!fileList.includes(process.env.CONFIG_FILENAME!) && createIfDoesNotExist) {
        const p3 = path.join(process.cwd(), process.env.DATA_PATH!, process.env.CONFIG_FILENAME!)
        await fsPromises.writeFile(p3, JSON.stringify(iconfig))
    }

    const p2 = path.resolve(process.cwd(), process.env.DATA_PATH!)
    let jsonData = JSON.parse((await fsPromises.readFile(p2.concat("/", process.env.CONFIG_FILENAME!))).toString())
    const upgrade = upgradeConfigFile(jsonData)
    if (upgrade.edited) {
        const p3 = path.join(process.cwd(), process.env.DATA_PATH!, process.env.CONFIG_FILENAME!)
        await fsPromises.writeFile(p3, JSON.stringify(upgrade.content))
    }

    jsonData = upgrade.content
    iconfig.theme = jsonData["theme"]
    iconfig.artifactRating = jsonData["artifactRating"]

    return iconfig
}

export async function loadAllEffects() : Promise<IEffect[]> {
    // const effectsRaw = await (await fetch("https://raw.githubusercontent.com/eikofee/eikonomiya-data/master/effects.yml")).text()
    // return parseAllEffects(effectsRaw)
    let res : IEffect[] = []
    res = res.concat(await loadEffectsResonances())

    return res
}

export async function loadEffectsResonances() : Promise<IEffect[]> {
    let res: IEffect[] = []
    const p = await buildPathToDataFolder("gamedata", "resonances")
    const fileList = await fsPromises.readdir(p)
    for (let i = 0; i < fileList.length; ++i) {
        let f = fileList[i]
        const effects = yaml.parse((await fsPromises.readFile(p.concat("/", f))).toString())
        res = res.concat(parseEffect(effects, "defaultName", ""))
    }

    return res
}

export async function loadCharacters(uid: string) : Promise<ICharacterData[]>{
    let res: ICharacterData[] = []
    const p = await buildPathToDataFolder(uid, "characters")
    const fileList = await fsPromises.readdir(p)
    for (let i = 0; i < fileList.length; ++i) {
        let f = fileList[i]
        let jsonData = JSON.parse((await fsPromises.readFile(p.concat("/", f))).toString())
        const upgrade = upgradeCharacterDataFile(jsonData)
        if (upgrade.edited) {

        }

        jsonData = upgrade.content
        res.push(parseCharacterData(jsonData))
    }

    return res
}

export async function loadRules(uid: string) : Promise<ICharacterRule[]>{
    let res: ICharacterRule[] = []
    const p = await buildPathToDataFolder(uid, "/rules")
    const fileList = await fsPromises.readdir(p)
    for (let i = 0; i < fileList.length; ++i) {
        let f = fileList[i]
        let jsonData = JSON.parse((await fsPromises.readFile(p.concat("/", f))).toString())
        const upgrade = upgradeRuleDataFile(jsonData)
        if (upgrade.edited) {
            await writeRule(uid, upgrade.content)
        }

        jsonData = upgrade.content
        let values : IStatTuple[] = []
        for (let j = 0; j < jsonData["stats"].length; ++j) {
            values.push({
                name: jsonData["stats"][j]["name"],
                value: jsonData["stats"][j]["value"],
            })
        }

        const currentRule = buildDefaultICharacterRule()
        currentRule.version = jsonData["version"]
        currentRule.character = jsonData["character"]
        currentRule.stats = values

        res.push(currentRule)
    }

    return res
}


export async function loadRule(uid: string, characterName: string) : Promise<ICharacterRule>{
    let res = buildDefaultICharacterRule()
    const p = await buildPathToDataFolder(uid, "/rules")
    const fileList = await fsPromises.readdir(p)
    for (let i = 0; i < fileList.length; ++i) {
        let f = fileList[i]
        if (f == characterName) {

            let jsonData = JSON.parse((await fsPromises.readFile(p.concat("/", f))).toString())
            const upgrade = upgradeRuleDataFile(jsonData)
            if (upgrade.edited) {
                await writeRule(uid, upgrade.content)
            }
            
            jsonData = upgrade.content
            let values : IStatTuple[] = []
            for (let j = 0; j < jsonData["stats"].length; ++j) {
                values.push({
                    name: jsonData["stats"][j]["name"],
                    value: jsonData["stats"][j]["value"],
                })
            }
            
            const currentRule = buildDefaultICharacterRule()
            currentRule.version = jsonData["version"]
            currentRule.character = jsonData["character"]
            currentRule.stats = values
            res = currentRule
        }
    }

    return res
}

export async function writeRule(uid: string, rule: ICharacterRule) {
    const pr = path.join(process.cwd(), "/", process.env.DATA_PATH!, "/", uid, "/rules")
    await fsPromises.writeFile(pr.concat("/", rule.character), JSON.stringify(rule))
}