import { IEffect } from "@/server/gamedata/IEffect";
import { eStatToReadable } from "@/server/gamedata/enums/EStat";
import { useContext, useState } from "react";
import { ICharacterData } from "@/server/gamedata/ICharacterData";
import Icon from "../Icon";
import { ConfigContext } from "../ConfigContext";
import EffectCard from "../EffectCard";

export default function EffectCardStack({effect: effect, effectUpdateCallback: effectUpdateCallback, character: character, removable} : ({effect: IEffect, effectUpdateCallback: (x: IEffect) => void, character: ICharacterData, removable: undefined | (() => void) })) {
    let ls = []
    const {colorDirector} = useContext(ConfigContext)

    for (let i = 0; i < effect.statChanges.length; ++i) {
        let statChange = effect.statChanges[i]
        let s = eStatToReadable(statChange.name)
        // let classname = "flex flex-row justify-between items ".concat(i%2 == 1 ? colorDirector.bg(0) : colorDirector.bg(1))
        let classname = "flex flex-row justify-between items p-1 ".concat(effect.options.enabled ? "" : "text-gray-400")
        if (i == effect.statChanges.length - 1) {
            classname += " rounded-b-md"
        }
        let n = <div className="flex flex-row items-center"><Icon n={s} /> <span className="pl-1">{s}</span></div>
        let value = statChange.value * (s.includes("%") ? 100 : 1)
        let fv = (s.includes("%") ? 1 : 0)
        let v = <div>{value.toFixed(fv).toString().concat(s.includes("%") ? "%" : "")}</div>
        ls.push(
        <li className={classname}>
            <div className="text-left basis-3/5 items-center">{n}</div>
            <div className="text-right basis-2/5 pr-2">{v}</div>
        </li>)
    }

    const [stackValue, setStackValue] = useState(effect.options.stack)
    const switchCallback = (n: number) => () => {
        effect.options.enabled = n > 0
        effect.options.stack = Math.min(effect.options.maxstack, n)
        setStackValue(n)
        effectUpdateCallback(effect)
    }

    const stackClassname = "flex flex-col text-sm w-full p-1 ".concat(effect.options.enabled ? "" : "rounded-b-md")
    const stackButtons = []
    if (effect.options.maxstack < 10) {
        for (let i = 0; i < effect.options.maxstack + 1; ++i) {
            stackButtons.push(<button key={"stack-button-".concat(i.toString())} onClick={switchCallback(i)} className={"h-1/2 w-full min-w-6 rounded-md text-sm mr-1 border ".concat(colorDirector.borderAccent(5), effect.options.stack == i ? i == 0 ? " bg-red-300" : " bg-green-300" : "")}>{i}</button>)
        }
    } else {
        for (let i = 0; i < effect.options.maxstack + 1; i += 50) {
            stackButtons.push(<button key={"stack-button-".concat(i.toString())} onClick={switchCallback(i)} className={"h-1/2 w-full rounded-md text-sm mr-1 border ".concat(colorDirector.borderAccent(5), effect.options.stack == i ? i == 0 ? " bg-red-300" : " bg-green-300" : "")}>{i}</button>)
        }

        stackButtons.push(<button key={"stack-button-max"} onClick={switchCallback(effect.options.maxstack)} className={"h-1/2 w-full rounded-md text-sm mr-1 border ".concat(colorDirector.borderAccent(5), effect.options.stack == effect.options.maxstack ? effect.options.maxstack == 0 ? " bg-red-300" : " bg-green-300" : "")}>{effect.options.maxstack}</button>)
    }

    const controller = <div key="effect-stack-controller" className={stackClassname}>
        <p className="self-center text-xs">Stacks : </p>
        <div className="flex flex-row w-full justify-center">
            {stackButtons}
        </div>
    </div>


    return <EffectCard effect={effect} effectUpdateCallback={effectUpdateCallback} character={character} controller={[controller]} removable={removable} />
}