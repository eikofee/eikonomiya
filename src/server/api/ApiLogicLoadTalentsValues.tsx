import { IApiResult } from "@/app/interfaces/IApiResult"
import {promises as fsPromises} from 'fs';
import { buildPathToDataFolder } from "../DataLoader";
import { IGoTalentsValues, jsonToIGoTalentsValues } from "../gamedata/goDataStructures/IGoTalentsValues";

type IApiTalentsValues = IGoTalentsValues

export async function apiLogicLoadTalentsValues(name: string) : Promise<IApiResult<IApiTalentsValues>> {
    let subPath = name.toLowerCase().replace(" ", "").replaceAll("_", "/")
    const res : IApiResult<IApiTalentsValues> = {success: false}
    const p = await buildPathToDataFolder("gamedata", "characters", subPath, ".json")
    const a = JSON.parse((await fsPromises.readFile(p)).toString())
    const item = jsonToIGoTalentsValues(a)
    res.content = item
    res.success = true

    return res
}