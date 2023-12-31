import { EStat } from "./enums/EStat";

export interface IStatTuple {
    name: EStat;
    value: number;
}

export function copyStatTuple(x: IStatTuple) {
    return {
        name: x.name,
        value: x.value,
    }
}
