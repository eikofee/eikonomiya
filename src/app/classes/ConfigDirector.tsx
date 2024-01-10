

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
    host: string,
    theme: ETheme
}


export class ConfigDirector {
    host: string
    theme: ETheme

    constructor(i: IConfigDirector) {
        this.host = i.host
        this.theme = i.theme
    }

    public hostUrl(s: string) {
        return this.host.concat(s)
    }
}