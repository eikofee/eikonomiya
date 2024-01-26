

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
    theme: ETheme
}


export class ConfigDirector {
    theme: ETheme

    constructor(i: IConfigDirector) {
        this.theme = i.theme
    }
}