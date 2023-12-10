import { IArtefact } from "./IArtefact";
import { IArtefactSet } from "./IArtefactSet";
import { ICharacterBase } from "./ICharacterBase";
import { IStatSet } from "./IStatSet";
import { IWeapon } from "./IWeapon";

export interface ICharacter {
    name: string
    element: string
    region?: string
    level: number
    friendshipLevel: number
    skills: {
        levelAA: number
        levelSkill: number
        levelUlt: number
    }

    character: ICharacterBase
    weapon: IWeapon
    artefacts: IArtefactSet

    totalStats: IStatSet
    lastUpdated: number
    anormalStats: {
        statNames: string[],
        statValues: number[]
    }
}

function parseWeapon(data: Record<string, any>): IWeapon {
    let weap = data["weapon"]
    let res : IWeapon = {
        type: "weapon",
        name: weap["name"],
        icon: "https://enka.network/ui/" + weap["icon"] + ".png",
        mainStatName: weap["mainStatName"],
        mainStatValue: parseFloat(weap["mainStatValue"]),
        refinement: parseInt(weap["refinement"]),
        level: parseInt(weap["level"]),
        subStatName: weap["subStatName"],
        subStatValue: parseFloat(weap["subStatValue"])
    }

    return res
}



function parseArtefact(data: Record<string, any>, artefactName: string): IArtefact {
    let arte = data["artefacts"][artefactName];
    let res : IArtefact = {
        type: "artefact",
        icon: "https://enka.network/ui/" + arte["icon"] + ".png",
        mainStatName: arte["mainStatName"],
        mainStatValue: parseFloat(arte["mainStatValue"]),
        subtype: arte["subtype"],
        subStatNames: arte["subStatNames"],
        subStatValues: arte["subStatValues"],
        rolls: arte["rolls"],
        set: arte["set"]
    }

    return res

}

export const buildCharacter = (data: Record<string, any>) => {
    let statSet : IStatSet = {
        HP: data["equipStats"]["HP"],
        "HP%": data["equipStats"]["HP%"],
        ATK: data["equipStats"]["ATK"],
        "ATK%": data["equipStats"]["ATK%"],
        DEF: data["equipStats"]["DEF"],
        "DEF%": data["equipStats"]["DEF%"],
        "Crit Rate%": data["equipStats"]["Crit Rate%"],
        "Crit DMG%": data["equipStats"]["Crit DMG%"],
        "ER%": data["equipStats"]["ER%"],
        "Heal%": data["equipStats"]["Heal%"],
        EM: data["equipStats"]["EM"],
        "Phys%": data["equipStats"]["Phys%"],
        "Anemo%": data["equipStats"]["Anemo%"],
        "Geo%": data["equipStats"]["Geo%"],
        "Electro%": data["equipStats"]["Electro%"],
        "Dendro%": data["equipStats"]["Dendro%"],
        "Hydro%": data["equipStats"]["Hydro%"],
        "Pyro%": data["equipStats"]["Pyro%"],
        "Cryo%": data["equipStats"]["Cryo%"]
    }
    let artefactSet : IArtefactSet = {
        fleur: parseArtefact(data, "fleur"),
        plume: parseArtefact(data, "plume"),
        sablier: parseArtefact(data, "sablier"),
        coupe: parseArtefact(data, "coupe"),
        couronne: parseArtefact(data, "couronne")
    }

    let weapon : IWeapon = parseWeapon(data)
    let charBase : ICharacterBase = {
        baseHP: data["baseHP"],
        baseATK: data["baseATK"],
        baseDEF: data["baseDEF"],
        ascensionStatName: data["ascension"]["statNames"],
        ascensionStatValue: parseFloat(data["ascension"]["statValues"])
    }

    const res : ICharacter = {
        name: data["name"],
        element: data["element"],
        region: data["region"],
        level: parseInt(data["level"]),
        friendshipLevel: parseInt(data["friendshipLevel"]),
        skills: {
            levelAA: parseInt(data["skills"]["levelAA"]),
            levelSkill: parseInt(data["skills"]["levelSkill"]),
            levelUlt: parseInt(data["skills"]["levelUlt"]),
        },

        character: charBase,
        weapon: weapon,
        artefacts: artefactSet,

        totalStats: statSet,
        lastUpdated: data["lastUpdated"],
        anormalStats: {
            statNames: data["anormalStats"]["statNames"],
            statValues: data["anormalStats"]["statValues"]
        }
    }

    return res
}