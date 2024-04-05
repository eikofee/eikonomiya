import { IStatRatio } from "./IStatRatio";
import { IStatTuple } from "./IStatTuple";
import { ETarget } from "./enums/ETarget";

export interface IEffectImplication {
    target: ETarget,
    flatValue?: IStatTuple,
    ratioValue?: IStatRatio,
}