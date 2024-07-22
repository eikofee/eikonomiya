import { INumericField } from "./INumericField";
import { ETalentType } from "./enums/ETalentType";

export interface ITalent {
    type: ETalentType,
    name: string,
    description: string[],
    icon: string,
    level: number,
    bonusLevel: number,
    levelMax: number,
    fields: INumericField[],
}

export function buildDefaultITalent() {
    const res : ITalent = {
        type: ETalentType.NONE,
        name: "Default Talent Name",
        description: ["Default Talent Description"],
        icon: "Default Talent Icon",
        level: 0,
        bonusLevel: 0,
        levelMax: 0,
        fields: []
    }

    return res
}

export function copyTalent(ref: ITalent) : ITalent {
    const fields : INumericField[] = []
    for (let i = 0; i < ref.fields.length; ++i) {
        const f : INumericField = {
            name: ref.fields[i].name,
            values: ref.fields[i].values,
        }
        fields.push(f)
    }

    const res : ITalent = {
        type: ref.type,
        name: ref.name,
        description: ref.description,
        icon: ref.icon,
        level: ref.level,
        bonusLevel: ref.bonusLevel,
        levelMax: ref.levelMax,
        fields: fields
    }

    return res
}