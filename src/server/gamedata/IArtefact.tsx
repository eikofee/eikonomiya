import { IStatTuple } from "./IStatTuple";
import { ISubStat } from "./ISubStat";
import { EArtefact } from "./enums/EArtefact";
import { ERarity } from "./enums/ERarity";

export interface IArtefact {
    type: EArtefact;
    name: string;
    set: string;
    level: number;
    rarity: ERarity;
    mainStat: IStatTuple;
    subStats: ISubStat[];
    assets: {
        icon: string
    }
}

export function copyArtefact(x: IArtefact) : IArtefact {
    let subStats: ISubStat[] = []
    for (let i = 0; i < x.subStats.length; ++i) {
        subStats.push({
            name: x.subStats[i].name,
            value: x.subStats[i].value,
            rollValue: x.subStats[i].rollValue
        })
    }
    
    const res : IArtefact = {
        type: x.type,
        name: x.name,
        set: x.set,
        level: x.level,
        rarity: x.rarity,
        mainStat: {
            name: x.mainStat.name,
            value: x.mainStat.value,
        },
        subStats: subStats,
        assets: {
            icon: x.assets.icon
        }
    }

    return res
}