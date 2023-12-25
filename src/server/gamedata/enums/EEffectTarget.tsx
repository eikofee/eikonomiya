export enum EEffectTarget {
    SELF = "self",
    TEAM = "team",
    TARGET = "target",
    UNKNOWN = "unknown"
}

export function stringToEEffectTarget(s: string): EEffectTarget {
    switch(s) {
        case "self": return EEffectTarget.SELF;
        case "team": return EEffectTarget.TEAM;
        case "target": return EEffectTarget.TARGET;
        default: return EEffectTarget.UNKNOWN;
    }
}
