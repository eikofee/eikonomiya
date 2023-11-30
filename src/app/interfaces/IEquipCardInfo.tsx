import { Stat } from "../classes/Stat";

export interface IEquipCardInfo {
    name: string;
    image: string;
    level: number;
    refinement: number;
    stats: Stat[];
}