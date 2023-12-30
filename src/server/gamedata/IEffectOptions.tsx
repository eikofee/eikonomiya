import { EEffectType } from "./enums/EEffectType"

export interface IEffectOptions {
    enabled: boolean,
    stack: number,
    maxstack: number,
}

export function addOptions(x: EEffectType, maxstack: number) : IEffectOptions {
    switch(x) {
        case EEffectType.NONE:
        case EEffectType.UNKNOWN:
        default:
            return { enabled: false, stack: 0, maxstack: 0};
        case EEffectType.STATIC:
            return { enabled: true, stack: 0, maxstack: 0};
        case EEffectType.BOOLEAN:
            return { enabled: false, stack: 0, maxstack: 0};
        case EEffectType.INFO:
            return { enabled: true, stack: 0, maxstack: 0};
        case EEffectType.STACK:
        case EEffectType.STACK_PRECISE:
            return { enabled: false, stack: 0, maxstack: maxstack};
    }
}