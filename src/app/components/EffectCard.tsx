import { IEffect, addSpecialIcon } from "@/server/gamedata/IEffect";
import { Card } from "./Card";
import { useContext, useState } from "react";
import { ConfigContext } from "./ConfigContext";
import { ICharacterData } from "@/server/gamedata/ICharacterData";
import Tooltip from "./Tooltip";
import StatLineDraw from "./StatLineDrawer";
import Icon from "./Icon";

export function buildImgOrIconForEffect(e : IEffect) {
    e = addSpecialIcon(e)
    let icon = <img className="w-full h-full" src={e.icon} />
    if (e.icon.includes("icon")) {
        let item = e.icon.replace("icon-", "")
        icon = <div className="p-1">
                <Icon n={item} useTooltip={false}/>
            </div>
    }

    return icon
}

export default function EffectCard({effect: effect, effectUpdateCallback: effectUpdateCallback, character: character, controller: controller, removable} : ({effect: IEffect, effectUpdateCallback: (x: IEffect) => void, character: ICharacterData, controller?: JSX.Element[], removable: undefined | (() => void) })) {
    let ls = []
    const {colorDirector} = useContext(ConfigContext)
    if (effect.options.enabled) {

        for (let i = 0; i < effect.statChanges.length; ++i) {
            let statChange = effect.statChanges[i]
            let s = statChange.name
            ls.push(<StatLineDraw name={s} value={statChange.value} rounded={i == effect.statChanges.length - 1} />)
        }
    }

    let icon = buildImgOrIconForEffect(effect)


    let child = <div className={"flex flex-row flex-grow w-full rounded-t-md ".concat(colorDirector.bgAccent(7))}>
                    {/* <img alt="" src={effect.icon} className="aspect-square w-8 place-self-start"/> */}
                    <div className="aspect-square w-8 place-self-start">
                        {icon}
                    </div>
                    <div className="pl-2 text-sm font-semibold place-self-center grow">{effect.name}</div>
                    {removable != undefined ? <button onClick={removable} className={"pr-2 text-sm text-right cursor-pointer ".concat(colorDirector.textAccent(3))}>Remove</button> : ""}
                    {effect.tag != "" ? <div className={"text-right place-self-end self-center h-1/2 rounded-md text-xs mr-2 p-1 text-white ".concat(colorDirector.bgAccent(3))}>{effect.tag}</div> : ""}
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