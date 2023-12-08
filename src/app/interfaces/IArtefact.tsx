import { IEquip } from "./IEquip";

export interface IArtefact extends IEquip {
    type: string;
    icon: string;
    mainStatName: string;
    mainStatValue: number;
    subtype: string;
    subStatNames: string[];
    subStatValues: number[];
    rolls: number[];
    set: string;
}
