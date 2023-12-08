import { IEquip } from "./IEquip";

export interface IWeapon extends IEquip{
    type: string;
    name: string;
    icon: string;
    mainStatName: string;
    mainStatValue: number;

    refinement: number;
    subStatName?: string;
    subStatValue?: number;
    level: number;
}
