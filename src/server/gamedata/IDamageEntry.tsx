import { IValueNode } from "./IValueNode";
import { EDamageType } from "./enums/EDamageType";
import { EElement } from "./enums/EElement";

export interface IDamageEntry {
    name: string,
    icon: string,
    element: EElement,
    type: EDamageType,
    valueNodes: IValueNode[]
}