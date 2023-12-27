"use client";

import { IWeapon } from "@/server/gamedata/IWeapon";
import { ICharacterRule } from "../interfaces/ICharacterRule";
import { Card } from "./Card";
import Icon from "./Icon";
import InfoDiv from "./Tooltip";
import { eStatToReadable } from "@/server/gamedata/enums/EStat";

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
    if (equip.subStat != undefined) {
        subLine = <li className="flex justify-between place-items-center">
        <div className="flex flex-col w-full">
        <div className="w-full flex flex-row items-center">
                <div className="text-left max-h-4">
                    <Icon n={eStatToReadable(equip.subStat.name)}/>
                </div>
                <div className={"text-right grow"}>
                    {isPercentage(eStatToReadable(equip.subStat.name)) ? (equip.subStat.value! * 100).toFixed(1): equip.subStat.value}{isPercentage(equip.subStat.name) ? "%" : ""}
                </div>
            </div>
        </div>
    </li>
    }
    let content = <div className="flex flex-col">
    <div className="aspect-square grad-5star basis-1/5 flex items-center justify-center rounded-t-md">
        <InfoDiv child={<img src={equip.assets.icon} className="max-w-full max-h-full"/>} info={<p>{equip.name}</p>} infoClassname="transition duration-300 z-20 absolute bg-gray-800 text-white font-normal text-sm rounded p-2 whitespace-nowrap top-full left-1/2 transform -translate-x-1/2" />
    </div>
    <div className="basis-4/5 px-1 py-2">
        <ul>
        <li className="flex justify-between place-items-center">
                <div className="flex flex-col w-full">
                <div className="w-full flex flex-row items-baseline font-semibold">
                        <div className="text-left max-h-4">
                            Level
                        </div>
                        <div className={"text-right grow"}>
                            {equip.level}
                        </div>
                    </div>
                    <div className="w-full flex flex-row items-center">
                        <div className="text-left max-h-4">
                            <Icon n={eStatToReadable(equip.mainStat.name)}/>
                        </div>
                        <div className={"text-right grow"}>
                            {isPercentage(equip.mainStat.name) ? (equip.mainStat.value * 100).toFixed(1): equip.mainStat.value}{isPercentage(equip.mainStat.name) ? "%" : ""}
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