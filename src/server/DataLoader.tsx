import path from "path";
import {promises as fsPromises} from 'fs';
import { ICharacterData } from "./gamedata/ICharacterData";
import { ICharacterRule } from "@/app/interfaces/ICharacterRule";
import { IStatTuple } from "./gamedata/IStatTuple";
import { IPlayerInfoWithoutCharacters, readIPlayerInfoWithoutCharacters } from "./gamedata/IPlayerInfo";
import { parseAllEffects, parseCharacterData } from "./DataParser";
import { IConfigDirector, ETheme } from "@/app/classes/ConfigDirector";
import { IEffect } from "./gamedata/IEffect";

export async function checkDataFolderExistence(): Promise<boolean> {
    const p = path.resolve(process.cwd())
    const fileList = await fsPromises.readdir(p)
    return fileList.includes("data")
}

export async function getPlayerInfoList(): Promise<IPlayerInfoWithoutCharacters[]> {
    let res : IPlayerInfoWithoutCharacters[] = []
    const dataExists = await checkDataFolderExistence()
    if (dataExists) {
        const p = path.resolve(process.cwd(), process.env.DATA_PATH!)
        let scannedFiles = [];
        const fileList = await fsPromises.readdir(p)
        for (let i = 0; i < fileList.length; ++i) {
            scannedFiles.push(fileList[i])
            if (!fileList[i].includes(".")) {
                
                const pl = path.resolve(process.cwd(), process.env.DATA_PATH!, fileList[i])
                const files = await fsPromises.readdir(pl)
                
                if (files.includes("player")) {
                    const jsonData = JSON.parse((await fsPromises.readFile(pl.concat("/player"))).toString())
                    const pi = readIPlayerInfoWithoutCharacters(jsonData)
                    res.push(pi)
                }
            }
            
        }
    }

    return res
}

export async function loadConfigFile(createIfDoesNotExist: boolean) : Promise<IConfigDirector> {
    const iconfig : IConfigDirector = {
        theme: ETheme.LIGHT
    }
    const dataExists = await checkDataFolderExistence()
    if (dataExists) {
        const p = path.resolve(process.cwd(), process.env.DATA_PATH!)
        const fileList = await fsPromises.readdir(p)
        if (!fileList.includes(process.env.CONFIG_FILENAME!) && createIfDoesNotExist) {
            const p3 = path.join(process.cwd(), process.env.DATA_PATH!, process.env.CONFIG_FILENAME!)
            await fsPromises.writeFile(p3, JSON.stringify({
                "theme": iconfig.theme
            }))
        }
    
        const p2 = path.resolve(process.cwd(), process.env.DATA_PATH!)
        const jsonData = JSON.parse((await fsPromises.readFile(p2.concat("/", process.env.CONFIG_FILENAME!))).toString())
        iconfig.theme = jsonData["theme"]
    }

    return iconfig
}

export async function loadAllEffects() : Promise<IEffect[]> {
    const effectsRaw = await (await fetch("https://raw.githubusercontent.com/eikofee/eikonomiya-data/master/effects.yml")).text()
    return parseAllEffects(effectsRaw)
}

export async function loadCharacters(uid: string) : Promise<ICharacterData[]>{
    let res: ICharacterData[] = []
    const dataExists = await checkDataFolderExistence()
    if (dataExists) {
        const p = path.join(process.cwd(), "/", process.env.DATA_PATH!, "/", uid, "/characters")
        const fileList = await fsPromises.readdir(p)
        for (let i = 0; i < fileList.length; ++i) {
            let f = fileList[i]
            const jsonData = JSON.parse((await fsPromises.readFile(p.concat("/", f))).toString())
            res.push(parseCharacterData(jsonData))
        }
    }

    return res
}

export async function loadRules(uid: string) : Promise<ICharacterRule[]>{
    let res: ICharacterRule[] = []
    const dataExists = await checkDataFolderExistence()
    if (dataExists) {
        const p = path.join(process.cwd(), "/", process.env.DATA_PATH!, "/", uid, "/rules")
        const fileList = await fsPromises.readdir(p)
        for (let i = 0; i < fileList.length; ++i) {
            let f = fileList[i]
            const jsonData = JSON.parse((await fsPromises.readFile(p.concat("/", f))).toString())
            let values : IStatTuple[] = []
            for (let j = 0; j < jsonData["stats"].length; ++j) {
                values.push({
                    name: jsonData["stats"][j]["name"],
                    value: jsonData["stats"][j]["value"],
                })
            }

            res.push({
                ruleName: "defaultRuleName",
                character: jsonData["character"],
                stats: values
            })
        }
    }

    return res
}