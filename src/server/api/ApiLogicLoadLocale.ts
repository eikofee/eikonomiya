import { IApiResult } from '@/app/interfaces/IApiResult';
import { buildPathToDataFolder } from '@/server/DataLoader';
import {promises as fsPromises} from 'fs';
import { IGoLocaleCharacter, jsonToIGoLocaleCharacter } from '@/server/gamedata/goDataStructures/IGoLocaleCharacter';

type IApiLocale = IGoLocaleCharacter

export async function apiLogicLoadLocale(category: string, name: string) : Promise<IApiResult<IApiLocale>> {
    let subPath = name.toLowerCase().replace(" ", "").replaceAll("_", "/")
    const res : IApiResult<IApiLocale> = {success: false}
    const p = await buildPathToDataFolder("gamedata", "locale", category, subPath, ".json")
    const a = JSON.parse((await fsPromises.readFile(p)).toString())
    if (category == "characters") {
        const item = jsonToIGoLocaleCharacter(a)
        res.content = item
        res.success = true
    }

    return res
}
