import { IDamageEntry } from "./IDamageEntry";

export interface IComputingInstance {
    name: string,
    description: string,
    icon: string,
    damageEntries: IDamageEntry[]
}