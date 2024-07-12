import { IStatTuple } from "@/server/gamedata/IStatTuple";

export interface ICharacterRule {
    ruleName: string,
    character: string,
    stats: IStatTuple[],
    currentRating: number[]
}

export function buildDefaultICharacterRule() {
    const res : ICharacterRule = {
        character: "Default Character",
        ruleName: "defaultRuleName",
        stats: [],
        currentRating: []
    }

    return res
}