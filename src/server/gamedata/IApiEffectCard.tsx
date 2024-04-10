import { IApiEffect } from "./IApiEffect"
import { EEffectType } from "./enums/EEffectType"

export interface IApiEffectCard {
    name: string,
    tag? : string,
    keywords? : string,
    source? : string,
    type: EEffectType,
    text?: string,
    maxstack? : number,
    effects? : IApiEffect[],
    effectsPrecise? : Record<number, IApiEffect[]>
}