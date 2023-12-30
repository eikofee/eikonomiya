import { EStat } from "./enums/EStat";

export interface INumberInstance {
    iconId: string;
    name: string;
    source: EStat;
    ratio: number;
    base: number;
    step: number;
    maxvalue: number;
}
