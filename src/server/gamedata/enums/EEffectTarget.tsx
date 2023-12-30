export enum ETarget {
    SELF = "self",
    TEAM = "team",
    TEAM_EXCLUSIVE = "team-exclusive",
    TARGET = "target",
    NONE = "none",
    UNKNOWN = "unknown"
}

export function stringToETarget(s: string): ETarget {
    switch(s) {
        case "self": return ETarget.SELF;
        case "team": return ETarget.TEAM;
        case "team-exclusive": return ETarget.TEAM_EXCLUSIVE;
        case "target": return ETarget.TARGET;
        case "none": return ETarget.NONE;
        default: return ETarget.UNKNOWN;
    }
}
