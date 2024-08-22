import { IEnkaCharacterData } from "./IEnkaCharacterData"

interface IEnkaAbyssesInfo {
    floor: number,
    chamber: number
}

interface IEnkaTheaterInfo {
    act: number,
    stars: number,
    mode: number //difficulty ? useless then ?
}

export interface IEnkaCharacterShowcaseEntry {
    avatarId: TEnkaCharacterId,
    level: number,
    info: IEnkaCharacterData
}

export interface IEnkaPlayerInfo {
    name: string,
    arLevel: number,
    description: string,
    worldLevel: number,
    namecardId: TEnkaNamecardId,
    achievementCount: number,
    abysses: IEnkaAbyssesInfo,
    theater: IEnkaTheaterInfo,
    charShowcase: IEnkaCharacterShowcaseEntry[],
    cardShowcase: TEnkaNamecardId[],
    profilePicture: TEnkaCharacterId,
}