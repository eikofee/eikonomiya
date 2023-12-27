import { ERarity } from "./enums/ERarity";
import { EWeaponType } from "./enums/EWeaponType";

export interface IWeapon {
    type: EWeaponType;
    name: string;
    assets: {
        icon: string
    }
    mainStat: IStatTuple;
    subStat?: IStatTuple;
    level: number;
    refinement?: number,
    rarity: ERarity;
    ascensionLevel: number
}
