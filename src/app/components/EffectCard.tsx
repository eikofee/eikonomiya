import { IEffect } from "@/server/gamedata/IEffect";
import { eStatToReadable } from "@/server/gamedata/enums/EStat";
import Icon from "./Icon";
import { Card } from "./Card";
import { useContext, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import { ICharacterData } from "@/server/gamedata/ICharacterData";
import { EEffectType } from "@/server/gamedata/enums/EEffectType";
import Tooltip from "./Tooltip";

export default function EffectCard({effect: effect, effectUpdateCallback: effectUpdateCallback, character: character, controller: controller} : ({effect: IEffect, effectUpdateCallback: (x: IEffect) => void, character: ICharacterData, controller?: JSX.Element[]})) {
    let ls = []
    const {colorDirector} = useContext(ThemeContext)
    if (effect.options.enabled) {

        for (let i = 0; i < effect.statChanges.length; ++i) {
            let statChange = effect.statChanges[i]
            let s = eStatToReadable(statChange.name)
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
    }

    let child = <div className={"flex flex-row flex-grow w-full rounded-t-md ".concat(colorDirector.bgAccent(7))}>
                    <img src={effect.icon} className="aspect-square w-8 place-self-start"/>
                    <div className="pl-2 text-sm font-semibold place-self-center grow">{effect.source}</div>
                    {effect.tag != "" ? <div className="text-right place-self-end self-center h-1/2 bg-orange-500 rounded-md text-sm mr-2 p-1">{effect.tag}</div> : ""}
                </div>
    let title = effect.text == "" ? child : <Tooltip child={child} info={effect.text} />

    let content = <div className="bg-inherit">
        {title}
        {controller}
        {/* {effect.text != "" ? <div className={"text-left m-1 text-sm "}>{effect.text}</div>: ""} */}
        <ul>
            {ls}
        </ul>
    </div>;

    return <Card c={content} />
}