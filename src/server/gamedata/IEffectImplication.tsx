import { IStatRatio } from "./IStatRatio";
import { IStatTuple } from "./IStatTuple";
import { ETarget } from "./enums/EEffectTarget";

export interface IEffectImplication {
    target: ETarget,
    flatValue?: IStatTuple,
    ratioValue?: IStatRatio,
}