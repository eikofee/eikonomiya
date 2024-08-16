export enum ERegion {
    MONDSTADT = "mondstadt",
    LIYUE = "liyue",
    INAZUMA = "inazuma",
    SUMERU = "sumeru",
    FONTAINE = "fontaine",
    OTHER = "other",
    UNKNOWN = "unknown"
}

export function stringToERegion (s: string) : ERegion {
    switch (s) {
        case "mondstadt" : return ERegion.MONDSTADT;
        case "liyue" : return ERegion.LIYUE;
        case "inazuma" : return ERegion.INAZUMA;
        case "sumeru" : return ERegion.SUMERU;
        case "fontaine" : return ERegion.FONTAINE;
        case "other" : return ERegion.OTHER;
        default: return ERegion.UNKNOWN;

    }
}