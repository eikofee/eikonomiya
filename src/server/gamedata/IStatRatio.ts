import { EStat } from "./enums/EStat";

export interface IStatRatio {
    source: EStat,
    target: EStat,
    ratio: number,
    maxvalue: number,
    step: number,
    base: number
}