import { IArtefact } from "./IArtefact"
import { IWeapon } from "./IWeapon"
import { IEffect } from "./IEffect"
import { StatBag } from "./StatBag"
import { EElement } from "./enums/EElement"
import { ERegion } from "./enums/ERegion"
import { ICharacterCommonData } from "./ICharacterCommonData"
import { IStatBag } from "./IStatBag"
import { EStat } from "./enums/EStat"

export interface ICharacterData {
    name: string
    element: EElement
    region?: ERegion
    assets?: {
        characterCard?: string
        characterPortrait?: string
    }

    level: number
    ascensionLevel: number
    ascensionStatName: EStat,
    ascensionStatValue: number,
    friendshipLevel: number
    skills: {
        levelAA: number
        levelSkill: number
        levelUlt: number
    }

    commonData: ICharacterCommonData
    weapon: IWeapon
    artefacts: IArtefact[]

    totalStats: IStatBag
    lastUpdated: number
    anormalStats: IStatBag

    staticEffects: IEffect[]
    dynamicEffects: IEffect[]
}