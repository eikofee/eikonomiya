import { IEffect } from "@/server/gamedata/IEffect";
import { EEffectType } from "@/server/gamedata/enums/EEffectType";
import EffectCardBoolean from "./effectCards/EffectCardBoolean";
import { computeStats } from "@/server/gamedata/StatComputations";
import EffectCardBasic from "./effectCards/EffectCardBasic";
import EffectCardStack from "./effectCards/EffectCardStack";
import { ICharacterData, copyCharacterData } from "@/server/gamedata/ICharacterData";
import { IStatBag } from "@/server/gamedata/IStatBag";

export enum EEffectListType {
    STATIC,
    DYNAMIC
}

export default function EffectList({char, effects, type, cb}: {char: ICharacterData, effects: IEffect[], type: EEffectListType, cb: (a: ICharacterData, b: IStatBag) => void}) {
    let effectCards = []
    function updateEffect(i: number) {
        return (x: IEffect) => {
            let c = copyCharacterData(char)
            if (type == EEffectListType.STATIC) {
                c.staticEffects[i] = x
            } else {
                c.dynamicEffects[i] = x
            }
            const res = computeStats(c)
            cb(res.a, res.b)
        }
    }

    const removeCb = (n: number) => {
        return () => {
            let c = copyCharacterData(char)
            let newDynamicEffects = []
            for (let i = 0; i < c.dynamicEffects.length; ++i) {
                if (i != n)
                newDynamicEffects.push(c.dynamicEffects[i])
            }

            c.dynamicEffects = newDynamicEffects
            const res = computeStats(c)
            cb(res.a, res.b)
        }
    }

    for (let e = 0; e < effects.length; ++e) {
        const effect = effects[e]
        switch (effect.type) {
            case EEffectType.BOOLEAN:
                effectCards.push(<EffectCardBoolean key={"effect-card-".concat(e.toString())} effect={effect} character={char} effectUpdateCallback={updateEffect(e)} removable={type == EEffectListType.DYNAMIC ? removeCb(e) : undefined}/>)
                break;
            case EEffectType.STACK:
            case EEffectType.STACK_PRECISE:
                effectCards.push(<EffectCardStack key={"effect-card-".concat(e.toString())} effect={effect} character={char} effectUpdateCallback={updateEffect(e)} removable={type == EEffectListType.DYNAMIC ? removeCb(e) : undefined}/>)
                break;
            default:
                effectCards.push(<EffectCardBasic key={"effect-card-".concat(e.toString())} effect={effect} character={char} effectUpdateCallback={updateEffect(e)} removable={type == EEffectListType.DYNAMIC ? removeCb(e) : undefined}/>)
                break;
        }
    }

    return effectCards
}