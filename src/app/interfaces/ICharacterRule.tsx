import { IStatTuple } from "@/server/gamedata/IStatTuple";

export interface ICharacterRule {
    ruleName: string,
    character: string,
    stats: IStatTuple[]
}