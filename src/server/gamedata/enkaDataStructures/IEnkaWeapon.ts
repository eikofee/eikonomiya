import { IStatTuple } from "../IStatTuple";
import { ERarity } from "../enums/ERarity";
import { EWeaponType } from "../enums/EWeaponType";

export interface IEnkaWeapon {
    type: EWeaponType;
    name: string;
    id: string;
    mainStat: IStatTuple;
    subStat?: IStatTuple;
    level: number;
    refinement?: number,
    rarity: ERarity;
    ascensionLevel: number
}
