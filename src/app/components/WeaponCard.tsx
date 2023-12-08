"use client";

import { ICharacterRule } from "../interfaces/ICharacterRule";
import { IWeapon } from "../interfaces/IWeapon";
import { Card } from "./Card";
import Icon from "./Icon";
import InfoDiv from "./Tooltip";

export default function WeaponCard({equip, rule} : {equip: IWeapon, rule: ICharacterRule}) {


    const isPercentage = (s: string) => s.includes("%")
    const fontWeight = [
        "font-light", //0-1
        "font-normal", //1-2
        "font-medium", // 2-3
        "font-semibold", //3-4
        "font-bold", //4-5
        "font-bold"
    ]

    let subLine = <p></p>
    if (equip.subStatName != undefined) {
        subLine = <li className="flex justify-between place-items-center font-bold">
        <div className="flex flex-col w-full py-1">
        <div className="w-full flex flex-row items-center">
                <div className="text-left basis-3/5 max-h-4">
                    <Icon n={equip.subStatName}/>
                </div>
                <div className={"text-right basis-2/5"}>
                    {isPercentage(equip.subStatName) ? (equip.subStatValue! * 100).toFixed(1): equip.subStatValue}{isPercentage(equip.subStatName) ? "%" : ""}
                </div>
            </div>
        </div>
    </li>
    }
    let content = <div className="flex flex-col">
    <div className="aspect-square grad-5star basis-1/5 flex items-center justify-center rounded-t-md">
        <img src={equip.icon} className="max-w-full max-h-full"/>
    </div>
    <div className="basis-4/5 px-1 py-2">
        <ul>
        <li className="flex justify-between place-items-center font-bold">
                <div className="flex flex-col w-full py-1">
                <div className="w-full flex flex-row items-center">
                        <div className="text-left basis-3/5 max-h-4">
                            <Icon n={equip.mainStatName}/>
                        </div>
                        <div className={"text-right basis-2/5"}>
                            {isPercentage(equip.mainStatName) ? (equip.mainStatValue * 100).toFixed(1): equip.mainStatValue}{isPercentage(equip.mainStatName) ? "%" : ""}
                        </div>
                    </div>
                </div>
            </li>
            {subLine}
        </ul>
    </div>
</div>

    return (
        <Card c={content}/>
    )
}