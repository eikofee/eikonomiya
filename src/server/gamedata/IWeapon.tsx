export interface IWeapon {
    type: EWeaponType;
    name: string;
    mainStat: IStatTuple;
    subStat?: IStatTuple;
    level: number;
    refinement?: number,
    rarity: ERarity;
}
