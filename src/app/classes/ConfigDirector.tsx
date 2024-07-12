

export enum ETheme {
    LIGHT = "light",
    DARK = "dark"
}

export function stringToETheme(s: string) {
    switch(s){
        default:
        case "light":
            return ETheme.LIGHT;
        case "dark":
            return ETheme.DARK;
    }
}

export interface IConfigDirector {
    version: string,
    theme: ETheme,
    artifactRating : {
        low: number,
        med: number
    }
}


export class ConfigDirector {
    version: string
    theme: ETheme
    artifactRating: {
        low: number,
        med: number
    }

    constructor(i: IConfigDirector) {
        this.theme = i.theme
        this.artifactRating = i.artifactRating
        this.version = i.version
    }
}

export function buildDefaultConfigDirector() : IConfigDirector {
    return {
        version: process.env.BUILD_VERSION!,
        theme: ETheme.LIGHT,
        artifactRating : {
            low: 0.25,
            med: 0.5
        }
    }
}