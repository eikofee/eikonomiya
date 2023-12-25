export enum EWeaponType {
    SWORD = "sword",
    CLAYMORE = "claymore",
    POLEARM = "polearm",
    BOW = "bow",
    CATALYST = "catalyst",
    UNKNOWN = "unknown"
}

export function stringToEWeaponType (s: string) : EWeaponType {
    switch (s) {
        case "sword": return EWeaponType.SWORD;
        case "claymore": return EWeaponType.CLAYMORE;
        case "polearm": return EWeaponType.POLEARM;
        case "bow": return EWeaponType.BOW;
        case "catalyst": return EWeaponType.CATALYST;
        default: return EWeaponType.UNKNOWN;
    }
}