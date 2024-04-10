import { ETarget } from "./enums/ETarget";
import { EStat } from "./enums/EStat";

export interface IApiEffect {
    target: ETarget,
    stat: EStat,
    value?: number,
    source? : EStat,
    ratio? : number,
    step? : number,
    maxvalue? : number,
    base? : number,
    r1value? : number,
    r5value? : number,
    r1ratio? : number,
    r5ratio? : number,
    r1maxvalue? : number,
    r5maxvalue? : number
}