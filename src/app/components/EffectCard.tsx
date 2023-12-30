import { IEffect } from "@/server/gamedata/IEffect";
import { eStatToReadable } from "@/server/gamedata/enums/EStat";
import Icon from "./Icon";
import { Card } from "./Card";
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import { ICharacterData } from "@/server/gamedata/ICharacterData";
import { EEffectType } from "@/server/gamedata/enums/EEffectType";

export default function EffectCard({effect: effect, effectUpdateCallback: effectUpdateCallback, character: character} : ({effect: IEffect, effectUpdateCallback: (x: IEffect) => void, character: ICharacterData})) {
    let ls = []
    const {colorDirector} = useContext(ThemeContext)

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

    const enableCallback = () => {
        effect.options.enabled = !effect.options.enabled
        effectUpdateCallback(effect)
    }

    let content = <div className="bg-inherit">
        <div className={"flex flex-row flex-grow w-full rounded-t-md ".concat(colorDirector.bgAccent(7))}>
            <img src={effect.icon} className="aspect-square w-8 place-self-start"/>
            <div className="pl-2 font-semibold place-self-center grow">{effect.source}</div>
            {effect.tag != "" ? <div className="text-right place-self-end self-center h-1/2 bg-orange-500 rounded-md text-sm mr-2 p-1">{effect.tag}</div> : ""}
        </div>
        {effect.type == EEffectType.BOOLEAN ? <button className={"text-sm self-start place-self-center w-full ".concat(effect.options.enabled ? "bg-green-300" : "bg-red-300" )} onClick={enableCallback}>{effect.options.enabled ? "Enabled" : "Disabled"}</button> : ""}
        {effect.text != "" ? <div className={"text-left m-1 text-sm "}>{effect.text}</div>: ""}
        <ul>
            {ls}
        </ul>
    </div>;

    return <Card c={content} />
}