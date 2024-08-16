export enum EEffectType {
    UNKNOWN = "unknown",
    NONE = "none",
    STATIC = "static",
    BOOLEAN = "bool",
    INFO = "info",
    STACK = "stack",
    STACK_PRECISE = "stack-precise",
}

export function stringToEEffectType(s: string) : EEffectType {
    switch(s) {
        case "unknown": return EEffectType.UNKNOWN;
        case "static": return EEffectType.STATIC;
        case "bool": return EEffectType.BOOLEAN;
        case "stack": return EEffectType.STACK;
        case "stack-precise": return EEffectType.STACK_PRECISE;
        case "info": return EEffectType.INFO;
        case "none": return EEffectType.NONE;
        default: return EEffectType.UNKNOWN;
    }
}