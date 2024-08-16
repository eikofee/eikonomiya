import { EStat } from "./enums/EStat";

export interface INumberInstance {
    iconId: string;
    name: string;
    sourceStat: EStat;
    targetStat: EStat;
    ratio: number;
    base: number;
    step: number;
    maxvalue: number;
}

export function copyNumberInstance(x: INumberInstance) {
    return {
        iconId: x.iconId,
        name: x.name,
        sourceStat: x.sourceStat,
        targetStat: x.targetStat,
        ratio: x.ratio,
        base: x.base,
        step: x.step,
        maxvalue: x.maxvalue
    }
}