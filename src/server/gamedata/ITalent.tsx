import { IComputingInstance } from "./IComputingInstance";
import { ETalentType } from "./enums/ETalentType";

export interface ITalent {
    type: ETalentType,
    name: string,
    description: string,
    icon: string,
    level: number,
    levelMax: number,
    instances: IComputingInstance[],
}