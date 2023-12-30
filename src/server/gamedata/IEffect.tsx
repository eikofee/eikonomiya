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

export function copyEffect(x: IEffect): IEffect {
    let statChanges: IStatTuple[] = []
    for (let i = 0; i < x.statChanges.length; ++i) {
        statChanges.push({
            name: x.statChanges[i].name,
            value: x.statChanges[i].value,
            target: x.statChanges[i].target
        })
    }

    let ratioNumbers: INumberInstance[] = []
    for (let i = 0; i < x.ratioNumbers.length; ++i) {
        ratioNumbers.push({
            iconId: x.ratioNumbers[i].iconId,
            name: x.ratioNumbers[i].name,
            source: x.ratioNumbers[i].source,
            ratio: x.ratioNumbers[i].ratio,
            base: x.ratioNumbers[i].base,
            step: x.ratioNumbers[i].step,
            maxvalue: x.ratioNumbers[i].maxvalue
        })
    }
    
    const res: IEffect = {
        source: x.source,
        tag: x.tag,
        icon: x.icon,
        text: x.text,
        type: x.type,
        options: {
            enabled: x.options.enabled,
            stack: x.options.stack,
            maxstack: x.options.maxstack
        },
        statChanges: statChanges,
        ratioNumbers: ratioNumbers
    }

    return res
}