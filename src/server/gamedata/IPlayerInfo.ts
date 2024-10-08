import { ICharacterData, copyCharacterData } from "./ICharacterData";

interface IAbyssesInfo {
    floor: number,
    chamber: number
}

interface ITheaterInfo {
    act: number,
    stars: number
}

export interface IPlayerInfo {
    version: string,
    name: string,
    uid: string,
    arLevel: number,
    description: string,
    worldLevel: number,
    achievementCount: number,
    abysses: IAbyssesInfo,
    theater: ITheaterInfo,
    characters: ICharacterData[],
    profilePictureCharacterName: string,
    namecardName: string,
}

export interface IPlayerInfoWithoutCharacters {
    version: string,
    name: string,
    uid: string,
    arLevel: number,
    description: string,
    worldLevel: number,
    achievementCount: number,
    abysses: IAbyssesInfo,
    theater: ITheaterInfo,
    profilePictureCharacterName: string,
    namecardName: string,
}

export function copyIPlayerInfo(x: IPlayerInfo): IPlayerInfo {
    let chars : ICharacterData[] = []
    for (let i = 0; i < x.characters.length; ++i){
        chars.push(copyCharacterData(x.characters[i]))
    }

    const res : IPlayerInfo = {
        version: x.version,
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
        theater: {
            act: x.theater.act,
            stars: x.theater.stars
        },
        characters: chars,
        profilePictureCharacterName: x.profilePictureCharacterName,
        namecardName: x.namecardName
    }

    return res
}

export function buildDefaultIPlayerInfo() : IPlayerInfo {
    const res : IPlayerInfo = {
        version: "",
        name: "default",
        uid: "",
        arLevel: 0,
        description: "",
        worldLevel: 0,
        achievementCount: 0,
        abysses: {
            floor: 0,
            chamber: 0
        },
        theater: {
            act: 0,
            stars: 0,
        },
        characters: [],
        profilePictureCharacterName: "",
        namecardName: ""
    }

    return res
}

export function copyIPlayerInfoWithoutCharacters(x: IPlayerInfo | IPlayerInfoWithoutCharacters): IPlayerInfoWithoutCharacters {
    const res: IPlayerInfoWithoutCharacters = {
        version: x.version,
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
        theater: {
            act: x.theater.act,
            stars: x.theater.stars
        },
        profilePictureCharacterName: x.profilePictureCharacterName,
        namecardName: x.namecardName
    }

    return res
}

export function readIPlayerInfoWithoutCharacters(x: any) {
    const res: IPlayerInfoWithoutCharacters = {
        version: x["version"],
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
        theater: {
            act: parseInt(x["theater"]["act"]),
            stars: parseInt(x["theater"]["stars"]),
        },
        profilePictureCharacterName: x["profilePictureCharacterName"],
        namecardName: x["namecardName"]
    }

    return res
}