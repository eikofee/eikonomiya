import { StatBag } from "../StatBag";
import { IEnkaArtifact } from "./IEnkaArtifact";
import { IEnkaCharacterCommonData } from "./IEnkaCharacterCommonData";
import { IEnkaSkill } from "./IEnkaSkill";
import { IEnkaWeapon } from "./IEnkaWeapon";

export interface IEnkaCharacterData {
    id: TEnkaCharacterId,
    commonData: IEnkaCharacterCommonData,
    ascensionLevel: number, //1002
    level: number, // 4001
    finalStats: StatBag,
    baseStats: StatBag,
    skills: IEnkaSkill[],
    skillExtraLevel: number[], // auto, skill, burst
    artifacts: IEnkaArtifact[],
    weapon: IEnkaWeapon,
    constellation: number,
    friendship: number

}