import { createContext } from "react";
import { ICharacterRule } from "../interfaces/ICharacterRule";
import { KVStats } from "../classes/KVStats";

export function generateDefaultRule() : ICharacterRule {
    return {ruleName: "defaultRuleName",
    character: "defaultCharacterName",
    stats: new KVStats()}
}

const defaultRule: ICharacterRule = {ruleName: "defaultRuleName",
    character: "defaultCharacterName",
    stats: new KVStats()
}

let ruleCallback: (arg0: ICharacterRule) => void = () => {}
// const defaultContext:{rule: ICharacterRule, } = {
//     rule: defaultRule(),
//     ruleCallback: () => {}
// }

// export const RootContext = createContext(defaultContext)
export const RootContext = createContext({defaultRule, ruleCallback})