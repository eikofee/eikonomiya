import { IEnkaCharacterData } from "./IEnkaCharacterData"

interface IEnkaAbyssesInfo {
    floor: number,
    chamber: number
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
    charShowcase: IEnkaCharacterShowcaseEntry[],
    cardShowcase: TEnkaNamecardId[],
    profilePicture: TEnkaCharacterId,
}