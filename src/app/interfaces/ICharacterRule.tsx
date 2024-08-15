import { EStat } from "@/server/gamedata/enums/EStat";
import { IStatTuple } from "@/server/gamedata/IStatTuple";

export interface ICharacterRule {
    version: string,
    ruleName: string,
    character: string,
    stats: IStatTuple[]
}

export function buildDefaultICharacterRule() {
    const res : ICharacterRule = {
        version: process.env.BUILD_VERSION!,
        character: "Default Character",
        ruleName: "defaultRuleName",
        stats: [
            {name: EStat.HP, value: 0},
            {name: EStat.ATK, value: 0},
            {name: EStat.DEF, value: 0},
            {name: EStat.HP_P, value: 0},
            {name: EStat.ATK_P, value: 0},
            {name: EStat.DEF_P, value: 0},
            {name: EStat.EM, value: 0},
            {name: EStat.ER_P, value: 0},
            {name: EStat.CR_P, value: 0},
            {name: EStat.CDMG_P, value: 0},
        ]
    }

    return res
}