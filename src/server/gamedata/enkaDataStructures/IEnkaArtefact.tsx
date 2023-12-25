import { EArtefact } from "../enums/EArtefact";
import { ERarity } from "../enums/ERarity";

export interface IEnkaArtefact {
    type: EArtefact;
    name: string;
    id: string;
    set: string;
    level: number;
    rarity: ERarity;
    mainStat: IStatTuple;
    subStats: ISubStat[];
}
