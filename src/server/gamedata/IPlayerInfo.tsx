import { ICharacterData } from "./ICharacterData";

interface IAbyssesInfo {
    floor: number,
    chamber: number
}

export interface IPlayerInfo {
    name: string,
    arLevel: number,
    description: string,
    worldLevel: number,
    achievementCount: number,
    abysses: IAbyssesInfo,
    characters: ICharacterData[],
    profilePictureCharacterName: string,
}