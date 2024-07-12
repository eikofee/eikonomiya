import { IStatTuple } from "@/server/gamedata/IStatTuple";

export interface ICharacterRule {
    version: string,
    ruleName: string,
    character: string,
    stats: IStatTuple[],
    currentRating: number[]
}

export function buildDefaultICharacterRule() {
    const res : ICharacterRule = {
        version: process.env.BUILD_VERSION!,
        character: "Default Character",
        ruleName: "defaultRuleName",
        stats: [],
        currentRating: []
    }

    return res
}