import { ETarget } from "./enums/EEffectTarget";
import { EStat } from "./enums/EStat";

export interface IStatTuple {
    name: EStat;
    value: number;
    target: ETarget
}
