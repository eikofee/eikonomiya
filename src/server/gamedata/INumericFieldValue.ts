import { ENumericFieldAttribute } from "./enums/ENumericFieldAttribute";

export interface INumericFieldValue {
    attribute: ENumericFieldAttribute,
    leveledValues: number[],
    flat: boolean
}