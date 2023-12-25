export enum EElement {
    NONE = "none",
    ANEMO = "anemo",
    GEO = "geo",
    ELECTRO = "electro",
    DENDRO = "dendro",
    HYDRO = "hydro",
    PYRO = "pyro",
    CRYO = "cryo",
    UNKNOWN = "unknown"
}

export function stringToEElement(s: string) : EElement {
    switch (s) {
        case "none": return EElement.NONE;
        case "anemo": return EElement.ANEMO;
        case "geo": return EElement.GEO;
        case "electro": return EElement.ELECTRO;
        case "dendro": return EElement.DENDRO;
        case "hydro": return EElement.HYDRO;
        case "pyro": return EElement.PYRO;
        case "cryo": return EElement.CRYO;
        default: return EElement.UNKNOWN;
    }
}