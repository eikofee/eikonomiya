import { EArtefact } from "./enums/EArtefact";
import { ERarity } from "./enums/ERarity";

export interface IArtefact {
    type: EArtefact;
    name: string;
    set: string;
    level: number;
    rarity: ERarity;
    mainStat: IStatTuple;
    subStats: ISubStat[];
    assets: {
        icon: string
    }
}
