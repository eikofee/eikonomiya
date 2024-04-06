import { IStatTuple } from "@/server/gamedata/IStatTuple";

export interface ICharacterRule {
    ruleName: string,
    character: string,
    stats: IStatTuple[]
}

export function buildDefaultICharacterRule() {
    const res : ICharacterRule = {
        character: "Default Character",
        ruleName: "defaultRuleName",
        stats: []
    }

    return res
}