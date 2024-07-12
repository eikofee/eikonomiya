

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
    theme: ETheme,
    artifactRating : {
        low: number,
        med: number
    }
}


export class ConfigDirector {
    theme: ETheme
    artifactRating: {
        low: number,
        med: number
    }

    constructor(i: IConfigDirector) {
        this.theme = i.theme
        this.artifactRating = i.artifactRating
    }
}

export function buildDefaultConfigDirector() : IConfigDirector {
    return {
        theme: ETheme.LIGHT,
        artifactRating : {
            low: 0.25,
            med: 0.5
        }
    }
}