import { IApiResult } from "@/app/interfaces/IApiResult"
import { buildPathToDataFolder } from "../DataLoader"
import { ICharacterRule } from "@/app/interfaces/ICharacterRule"
import {promises as fsPromises} from 'fs';

export async function apiLogicGetRule(uid: string, character: string) {
    const res : IApiResult<ICharacterRule> = {success: false}
    const p = await buildPathToDataFolder(uid, "rules", character)
    const data = JSON.parse((await fsPromises.readFile(p)).toString())
    res.content = data
    res.success = true
    return res
}

export async function apiLogicEditRule(uid: string, newRule: ICharacterRule) {
    const res : IApiResult<ICharacterRule> = {success: false}
    const charName = newRule.character
    const p = await buildPathToDataFolder(uid, "rules", charName)
    await fsPromises.writeFile(p, JSON.stringify(newRule))
    res.content = newRule
    res.success = true
    return res
}

export async function apiLogicGetRules(uid: string) {
    const res : IApiResult<ICharacterRule[]> = {success: false}
    const p = await buildPathToDataFolder(uid, "rules")
    const rules = []
    const fileList = await fsPromises.readdir(p)
    for (let i = 0; i < fileList.length; ++i) {
        const pp = await buildPathToDataFolder(uid, "rules", fileList[i])
        const data = JSON.parse((await fsPromises.readFile(pp)).toString())
        rules.push(data as ICharacterRule)
    }

    res.content = rules
    res.success = true
    return res
}
