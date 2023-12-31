import { IEffectImplication } from "./IEffectImplication";
import { IEffectOptions } from "./IEffectOptions";
import { INumberInstance, copyNumberInstance } from "./INumberInstances";
import { IStatTuple, copyStatTuple } from "./IStatTuple";
import { EEffectType } from "./enums/EEffectType";

export interface IEffect {
    source: string,
    tag: string,
    icon: string,
    text: string,
    type: EEffectType,
    options: IEffectOptions,
    implications: IEffectImplication[][],
    statChanges: IStatTuple[],
}

export function copyEffect(x: IEffect): IEffect {
    let statChanges: IStatTuple[] = []
    for (let i = 0; i < x.statChanges.length; ++i) {
        statChanges.push({
            name: x.statChanges[i].name,
            value: x.statChanges[i].value,
        })
    }
    let implicationsSet = []
    for (let j = 0; j < x.implications.length; ++j) {

        let implications : IEffectImplication[] = []
        for (let i = 0; i < x.implications[j].length; ++i) {
            const iei : IEffectImplication = {
                target: x.implications[j][i].target,
                flatValue: x.implications[j][i].flatValue == undefined ? undefined : {
                    name: x.implications[j][i].flatValue!.name,
                    value: x.implications[j][i].flatValue!.value,
                },
                ratioValue: x.implications[j][i].ratioValue == undefined ? undefined : {
                    base: x.implications[j][i].ratioValue!.base,
                    maxvalue: x.implications[j][i].ratioValue!.maxvalue,
                    ratio: x.implications[j][i].ratioValue!.ratio,
                    source: x.implications[j][i].ratioValue!.source,
                    step: x.implications[j][i].ratioValue!.step,
                    target: x.implications[j][i].ratioValue!.target
                }
            }

            implications.push(iei)
        }

        implicationsSet.push(implications)
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
            maxstack: x.options.maxstack,
        },
        statChanges: statChanges,
        implications: implicationsSet
    }

    return res
}