import { EElement } from "../enums/EElement"
import { ERarity } from "../enums/ERarity"
import { EWeaponType } from "../enums/EWeaponType"
import { IEnkaCostumeEntry } from "./IEnkaCostumeEntry"
import { IEnkaProudMapEntry } from "./IEnkaProudMapEntry"
import { IEnkaSkillEntry } from "./IEnkaSkillEntry"

export interface IEnkaCharacterCommonData {
    id: TEnkaCharacterId,
    element: EElement,
    constellationIds: string[],
    skills: IEnkaSkillEntry[],
    proudMap: IEnkaProudMapEntry[],
    nameId: TEnkaLocaleId,
    sideIconId: string,
    rarity: ERarity,
    weapon: EWeaponType,
    costumes: IEnkaCostumeEntry[]
}