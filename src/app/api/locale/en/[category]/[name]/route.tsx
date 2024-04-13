import { IApiResult } from '@/app/interfaces/IApiResult';
import { buildPathToDataFolder } from '@/server/DataLoader';
import { IGoLocaleCharacter, jsonToIGoLocaleCharacter } from '@/server/gamedata/goDataStructures/IGoLocaleCharacter';
import {promises as fsPromises} from 'fs';

type IApiLocale = IGoLocaleCharacter


export async function apiLoadLocaleLogic(category: string, name: string) : Promise<IApiResult<IApiLocale>> {
    let subPath = name.toLowerCase().replace(" ", "").replaceAll("_", "/")
    const res : IApiResult<IApiLocale> = {success: false}
    const p = await buildPathToDataFolder("gamedata", "locale", category, subPath, ".json")
    if (p.status) {
        const a = JSON.parse((await fsPromises.readFile(p.path)).toString())
        if (category == "characters") {
            const item = jsonToIGoLocaleCharacter(a)
            res.content = item
            res.success = true
        }
    }

    return res
}

export async function GET(request: Request, {params}: {params: {category: string, name: string}}) {
    const name = params.name
    const category = params.category
    let content : any = {message: "Data folder not found."}
    if (name != undefined && category != undefined) {
        const localeItem = await apiLoadLocaleLogic(category, name)
        content = localeItem
    }

    return Response.json(content, {headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
    })
}