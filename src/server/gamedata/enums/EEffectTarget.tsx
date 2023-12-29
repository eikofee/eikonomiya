export enum EEffectTarget {
    SELF = "self",
    TEAM = "team",
    TEAM_EXCLUSIVE = "team-exclusive",
    TARGET = "target",
    UNKNOWN = "unknown"
}

export function stringToEEffectTarget(s: string): EEffectTarget {
    switch(s) {
        case "self": return EEffectTarget.SELF;
        case "team": return EEffectTarget.TEAM;
        case "team-exclusive": return EEffectTarget.TEAM_EXCLUSIVE;
        case "target": return EEffectTarget.TARGET;
        default: return EEffectTarget.UNKNOWN;
    }
}
