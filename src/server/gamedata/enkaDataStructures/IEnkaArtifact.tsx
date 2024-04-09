import { IStatTuple } from "../IStatTuple";
import { ISubStat } from "../ISubStat";
import { EArtifact } from "../enums/EArtifact";
import { ERarity } from "../enums/ERarity";

export interface IEnkaArtifact {
    type: EArtifact;
    name: string;
    id: string;
    set: string;
    level: number;
    rarity: ERarity;
    mainStat: IStatTuple;
    subStats: ISubStat[];
}
