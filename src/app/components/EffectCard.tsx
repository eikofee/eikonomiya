import { IEffect, addSpecialIcon } from "@/server/gamedata/IEffect";
import { useContext, useState } from "react";
import { ConfigContext } from "./ConfigContext";
import { ICharacterData } from "@/server/gamedata/ICharacterData";
import Tooltip from "./Tooltip";
import StatLineDraw from "./StatLineDrawer";
import Icon from "./Icon";
import { ImgApi } from "./ImgApi";
import Card, { ECardSize } from "./Card";
import { EAccentType } from "../classes/ColorDirector";

export function buildImgOrIconForEffect(e : IEffect) {
    e = addSpecialIcon(e)
    let icon = <ImgApi className="w-full h-full" src={e.icon} />
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
            ls.push(<StatLineDraw key={"stat-line-draw-".concat(i.toString())} name={s} value={statChange.value} rounded={i == effect.statChanges.length - 1} />)
        }
    }

    let icon = buildImgOrIconForEffect(effect)


    let child = <div key="effect-child" className={"flex flex-row flex-grow w-full rounded-t-md ".concat(colorDirector.bgAccent(7))}>
                    {/* <img alt="" src={effect.icon} className="aspect-square w-8 place-self-start"/> */}
                    <div className="aspect-square w-8 place-self-start">
                        {icon}
                    </div>
                    <div className="pl-2 text-sm font-semibold place-self-center grow">{effect.name}</div>
                    {removable != undefined ? <button onClick={removable} className={"pr-2 text-sm text-right cursor-pointer ".concat(colorDirector.textAccent(3))}>Remove</button> : ""}
                    {effect.tag != "" ? <div className={"text-right place-self-end self-center h-1/2 rounded-md text-xs mr-2 p-1 text-white ".concat(colorDirector.bgAccent(EAccentType.STRONG))}>{effect.tag}</div> : ""}
                </div>
    let title = effect.text == "" ? child : <Tooltip child={child} info={effect.text} />

    let content = <div className="bg-inherit">
        {title}
        {controller}
        <ul key="effect-list">
            {ls}
        </ul>
    </div>;

    return <Card content={content} minw={ECardSize.LARGE} />
}