import { IEffect } from "@/server/gamedata/IEffect";
import { Card } from "./Card";
import { useContext, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import { ICharacterData } from "@/server/gamedata/ICharacterData";
import Tooltip from "./Tooltip";
import StatLineDraw from "./StatLineDrawer";

export default function EffectCard({effect: effect, effectUpdateCallback: effectUpdateCallback, character: character, controller: controller} : ({effect: IEffect, effectUpdateCallback: (x: IEffect) => void, character: ICharacterData, controller?: JSX.Element[]})) {
    let ls = []
    const {colorDirector} = useContext(ThemeContext)
    if (effect.options.enabled) {

        for (let i = 0; i < effect.statChanges.length; ++i) {
            let statChange = effect.statChanges[i]
            let s = statChange.name
            ls.push(<StatLineDraw name={s} value={statChange.value} rounded={i == effect.statChanges.length - 1} />)
        }
    }

    let child = <div className={"flex flex-row flex-grow w-full rounded-t-md ".concat(colorDirector.bgAccent(7))}>
                    <img alt="" src={effect.icon} className="aspect-square w-8 place-self-start"/>
                    <div className="pl-2 text-sm font-semibold place-self-center grow">{effect.source}</div>
                    {effect.tag != "" ? <div className="text-right place-self-end self-center h-1/2 bg-orange-500 rounded-md text-xs mr-2 p-1">{effect.tag}</div> : ""}
                </div>
    let title = effect.text == "" ? child : <Tooltip child={child} info={effect.text} />

    let content = <div className="bg-inherit">
        {title}
        {controller}
        <ul>
            {ls}
        </ul>
    </div>;

    return <Card c={content} />
}