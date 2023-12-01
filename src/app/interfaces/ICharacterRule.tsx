interface RuleKV {
    name: string,
    value: number
}

export interface ICharacterRule {
    ruleName: string,
    character: string,
    minimalValues: RuleKV[]
    values: RuleKV[]
}