export enum ETalentType {
    NONE = "none",
    NORMAL = "normal",
    SKILL = "skill",
    BURST = "burst",
    A1 = "a1",
    A4 = "a4",
    OTHER = "other",
    C1 = "c1",
    C2 = "c2",
    C3 = "c3",
    C4 = "c4",
    C5 = "c5",
    C6 = "c6",
    UNKNOWN = "unknown"
}

export function stringToETalentType(name: string) : ETalentType {
    switch(name) {
        case "none": return ETalentType.NONE;
        case "normal": return ETalentType.NORMAL;
        case "skill": return ETalentType.SKILL;
        case "burst" : return ETalentType.BURST;
        case "a1" : return ETalentType.A1;
        case "a4" : return ETalentType.A4;
        case "other" : return ETalentType.OTHER;
        case "c1" : return ETalentType.C1;
        case "c2" : return ETalentType.C2;
        case "c3" : return ETalentType.C3;
        case "c4" : return ETalentType.C4;
        case "c5" : return ETalentType.C5;
        case "c6" : return ETalentType.C6;
        default: return ETalentType.UNKNOWN
    }
}