import { IEffectOptions } from "./IEffectOptions";
import { INumberInstance } from "./INumberInstances";
import { IStatTuple } from "./IStatTuple";
import { EEffectType } from "./enums/EEffectType";

export interface IEffect {
    source: string,
    tag: string,
    icon: string,
    text: string,
    type: EEffectType,
    options: IEffectOptions,
    statChanges: IStatTuple[],
    ratioNumbers: INumberInstance[],
}