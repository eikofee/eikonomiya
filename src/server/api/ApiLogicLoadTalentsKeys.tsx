import { IApiResult } from "@/app/interfaces/IApiResult"
import {promises as fsPromises} from 'fs';
import { buildPathToDataFolder } from "../DataLoader";
import * as yaml from 'yaml';
import { IGoTalentsKeys } from "../gamedata/goDataStructures/IGoTalentsKeys";


type IApiTalentsKeys = IGoTalentsKeys

export async function apiLogicLoadTalentsKeys(name: string) : Promise<IApiResult<IApiTalentsKeys>> {
    let subPath = name.toLowerCase().replace(" ", "").replaceAll("_", "/")
    const res : IApiResult<IApiTalentsKeys> = {success: false}
    const p = await buildPathToDataFolder("gamedata", "characters", subPath, ".yml")
    if (p.status) {
        const a = yaml.parse((await fsPromises.readFile(p.path)).toString())
        const item = yamlToIGoTalentsKeys(a)
        res.content = item
        res.success = true
    }

    return res
}


export function yamlToIGoTalentsKeys(data: any) {
    const res : IGoTalentsKeys = {
        auto: data["auto"],
        skill: data["skill"],
        burst: data["burst"],
        passive1: data["passive1"],
        passive2: data["passive2"],
        passive3: data["passive3"],
        constellation1: data["constellation1"],
        constellation2: data["constellation2"],
        constellation3: data["constellation3"],
        constellation4: data["constellation4"],
        constellation5: data["constellation5"],
        constellation6: data["constellation6"]
    }

    return res
}