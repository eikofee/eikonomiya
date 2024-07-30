import { IStatTuple } from "@/server/gamedata/IStatTuple";

export interface ICharacterRule {
    version: string,
    ruleName: string,
    character: string,
    stats: IStatTuple[],
    currentRating: number[],
    currentRated: boolean[]
}

export function buildDefaultICharacterRule() {
    const res : ICharacterRule = {
        version: process.env.BUILD_VERSION!,
        character: "Default Character",
        ruleName: "defaultRuleName",
        stats: [],
        currentRating: [],
        currentRated: []
    }

    return res
}