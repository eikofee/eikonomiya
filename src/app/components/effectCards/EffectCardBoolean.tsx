import { IEffect } from "@/server/gamedata/IEffect";
import { eStatToReadable } from "@/server/gamedata/enums/EStat";
import { useContext, useState } from "react";
import { ICharacterData } from "@/server/gamedata/ICharacterData";
import { Card } from "../Card";
import Icon from "../Icon";
import { ConfigContext } from "../ConfigContext";
import Tooltip from "../Tooltip";
import EffectCard from "../EffectCard";

export default function EffectCardBoolean({effect: effect, effectUpdateCallback: effectUpdateCallback, character: character} : ({effect: IEffect, effectUpdateCallback: (x: IEffect) => void, character: ICharacterData})) {
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

    const enableCallback = () => {
        effect.options.enabled = !effect.options.enabled
        effectUpdateCallback(effect)
    }

    const boolClassname = "text-sm cursor-pointer h-full self-start text-center w-full ".concat(effect.options.enabled ? "bg-green-300" : "bg-red-300 rounded-b-md" )
    const controller = <div className={boolClassname} onClick={enableCallback}>{effect.options.enabled ? "Enabled" : "Disabled"}</div>

    return <EffectCard effect={effect} effectUpdateCallback={effectUpdateCallback} character={character} controller={[controller]} />
}