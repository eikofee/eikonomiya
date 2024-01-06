import { ICharacterData, copyCharacterData } from "./ICharacterData";

interface IAbyssesInfo {
    floor: number,
    chamber: number
}

export interface IPlayerInfo {
    name: string,
    uid: string,
    arLevel: number,
    description: string,
    worldLevel: number,
    achievementCount: number,
    abysses: IAbyssesInfo,
    characters: ICharacterData[],
    profilePictureCharacterName: string,
}

export interface IPlayerInfoWithoutCharacters {
    name: string,
    uid: string,
    arLevel: number,
    description: string,
    worldLevel: number,
    achievementCount: number,
    abysses: IAbyssesInfo,
    profilePictureCharacterName: string,
}

export function copyIPlayerInfo(x: IPlayerInfo): IPlayerInfo {
    let chars : ICharacterData[] = []
    for (let i = 0; i < x.characters.length; ++i){
        chars.push(copyCharacterData(x.characters[i]))
    }

    const res : IPlayerInfo = {
        name: x.name,
        uid: x.uid,
        arLevel: x.arLevel,
        description: x.description,
        worldLevel: x.worldLevel,
        achievementCount: x.achievementCount,
        abysses: {
            floor: x.abysses.floor,
            chamber: x.abysses.chamber
        },
        characters: chars,
        profilePictureCharacterName: x.profilePictureCharacterName
    }

    return res
}

export function copyIPlayerInfoWithoutCharacters(x: IPlayerInfo | IPlayerInfoWithoutCharacters): IPlayerInfoWithoutCharacters {
    const res: IPlayerInfoWithoutCharacters = {
        name: x.name,
        uid: x.uid,
        arLevel: x.arLevel,
        description: x.description,
        worldLevel: x.worldLevel,
        achievementCount: x.achievementCount,
        abysses: {
            floor: x.abysses.floor,
            chamber: x.abysses.chamber
        },
        profilePictureCharacterName: x.profilePictureCharacterName
    }

    return res
}

export function readIPlayerInfoWithoutCharacters(x: any) {
    const res: IPlayerInfoWithoutCharacters = {
        name: x["name"],
        uid: x["uid"],
        arLevel: parseInt(x["arLevel"]),
        description: x["description"],
        worldLevel: parseInt(x["worldLevel"]),
        achievementCount: parseInt(x["achievementCount"]),
        abysses: {
            floor: parseInt(x["abysses"]["floor"]),
            chamber: parseInt(x["abysses"]["chamber"])
        },
        profilePictureCharacterName: x["profilePictureCharacterName"]
    }

    return res
}