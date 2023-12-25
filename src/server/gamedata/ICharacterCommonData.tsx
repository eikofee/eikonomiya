import { EElement } from "./enums/EElement";
import { ERarity } from "./enums/ERarity";
import { EStat } from "./enums/EStat";
import { EWeaponType } from "./enums/EWeaponType";

export interface ICharacterCommonData {
    name: string,
    element: EElement,
    rarity: ERarity,
    weaponType: EWeaponType,

    // skillIdAA: string,
    // skillIdSkill: string,
    // skillIdUlt: string,

    ascensionStatName: EStat,
    ascensionStatBaseValue: number,

    baseStats: IBaseStats
}