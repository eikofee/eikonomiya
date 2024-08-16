export interface IEikoTalentValue {
    a: string,
    v: string,
    flat: boolean
}

export interface IEikoTalentDesc {
    name: string,
    values : IEikoTalentValue[]
}

export interface IEikoTalentsKeys {
    auto : IEikoTalentDesc[],
    skill: IEikoTalentDesc[],
    burst: IEikoTalentDesc[]
}