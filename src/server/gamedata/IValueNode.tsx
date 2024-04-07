import { EStat } from "./enums/EStat";
import { EValueNodeType } from "./enums/EValueNodeType";

export interface IValueNode {
    type: EValueNodeType,
    value: number,
    scaling: EStat
}