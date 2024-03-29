import { IEffectImplication } from "./IEffectImplication";
import { IEffectOptions } from "./IEffectOptions";
import { IStatTuple, copyStatTuple } from "./IStatTuple";
import { EEffectType } from "./enums/EEffectType";

export interface IEffect {
    name: string,
    source: string,
    source2: string,
    tag: string,
    icon: string,
    text: string,
    keywords: string[]
    type: EEffectType,
    options: IEffectOptions,
    implications: IEffectImplication[][],
    statChanges: IStatTuple[],
}

export function addSpecialIcon(x: IEffect): IEffect {
    if (x.icon != "") {
        return x
    }

    if (x.source == "no resonance") {
        x.icon = "icon-def"
    } else if (x.source.includes("resonance")) {
        x.icon = "icon-".concat(x.source.replace(" resonance", ""))
    }

    return x
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
        name: x.name,
        source: x.source,
        source2: x.source2,
        tag: x.tag,
        keywords: x.keywords,
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