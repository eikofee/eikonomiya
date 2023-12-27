import { EElement } from "./enums/EElement";
import { ERarity } from "./enums/ERarity";
import { ERegion } from "./enums/ERegion";
import { EStat } from "./enums/EStat";
import { EWeaponType } from "./enums/EWeaponType";

export interface ICharacterCommonData {
    name: string,
    element: EElement,
    rarity: ERarity,
    region: ERegion,
    weaponType: EWeaponType,

    assets : {
        characterPortrait: string,
        characterCard: string,
    }

    // skillIdAA: string,
    // skillIdSkill: string,
    // skillIdUlt: string,

    ascensionStatName: EStat,
    ascensionStatBaseValue: number,

    baseStats: IBaseStats
}