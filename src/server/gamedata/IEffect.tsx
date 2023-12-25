import { INumberInstances } from "./INumberInstances";
import { EEffectTarget } from "./enums/EEffectTarget";

export interface IEffect {
    source: string,
    target: EEffectTarget,
    statChanges: IStatTuple[],
    staticNumber: INumberInstances[],
}