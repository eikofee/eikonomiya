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
        characterNameCard: string,
        aa: string,
        skill: string,
        burst: string,
        a1: string,
        a4: string,
        c1: string,
        c2: string,
        c3: string,
        c4: string,
        c5: string,
        c6: string,
    }

    ascensionStatName: EStat,
    ascensionStatBaseValue: number,

    baseStats: IBaseStats
}