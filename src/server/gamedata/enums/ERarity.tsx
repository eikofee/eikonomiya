export enum ERarity {
    I = "1",
    II = "2",
    III = "3",
    IV = "4",
    V = "5",
    V_RED = "5_SP",
    UNKNOWN = "unknown"
}

export function stringToERarity(s: string) : ERarity {
    switch (s) {
        case "1" : return ERarity.I;
        case "2" : return ERarity.II;
        case "3" : return ERarity.III;
        case "4" : return ERarity.IV;
        case "5" : return ERarity.V;
        case "5_SP" : return ERarity.V_RED;
        default: return ERarity.UNKNOWN
    }
}