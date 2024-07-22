import { IApiResult } from "@/app/interfaces/IApiResult"
import {promises as fsPromises} from 'fs';
import { buildPathToDataFolder } from "../DataLoader";
import * as yaml from 'yaml';
import { IEikoTalentDesc, IEikoTalentsKeys, IEikoTalentValue } from "../gamedata/IEikoTalentsKeys";


type IApiTalentsKeys = IEikoTalentsKeys

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
    const buildTalentValue = (a: any) => {
        const res : IEikoTalentValue = {
            a: a["a"],
            v: a["v"],
            flat: a["flat"]
        }

        return res
    }

    const buildTalentDesc = (a: any) => {
        let v = []
        for (let i = 0; i < a["values"].length; ++i) {
            v.push(buildTalentValue(a["values"][i]))
        }

        const res : IEikoTalentDesc = {
            name: a["name"],
            values: v
        }

        return res
    }

    let auto = []
    let skill = []
    let burst = []

    for (let i = 0; i < data["auto"].length; ++i) {
        auto.push(buildTalentDesc(data["auto"][i]))
    }

    for (let i = 0; i < data["skill"].length; ++i) {
        skill.push(buildTalentDesc(data["skill"][i]))
    }

    for (let i = 0; i < data["burst"].length; ++i) {
        burst.push(buildTalentDesc(data["burst"][i]))
    }

    const res : IEikoTalentsKeys = {
        auto: auto,
        skill: skill,
        burst: burst
    }

    return res
}