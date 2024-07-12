"use client";

import { IWeapon } from "@/server/gamedata/IWeapon";
import { ICharacterRule } from "../interfaces/ICharacterRule";
import Icon from "./Icon";
import { eStatToReadable, statIsPercentage } from "@/server/gamedata/enums/EStat";
import Tooltip from "./Tooltip";
import { ImgApi } from "./ImgApi";
import Card, { ECardSize } from "./Card";

export default function WeaponCard({equip, rule} : {equip: IWeapon, rule: ICharacterRule}) {


    let subLine = <p></p>
    if (equip.subStat != undefined) {
        subLine = <li className="flex justify-between place-items-center">
        <div className="flex flex-col w-full">
        <div className="w-full flex flex-row items-center">
                <div className="text-left">
                    <div className="w-4 h-4">
                        <Icon n={equip.subStat.name}/>
                    </div>
                </div>
                <div className={"text-right grow"}>
                    {statIsPercentage(equip.subStat.name) ? (equip.subStat.value! * 100).toFixed(1).concat("%"): equip.subStat.value}
                </div>
            </div>
        </div>
    </li>
    }
    let content = <div className="flex flex-col">
    <div className="aspect-square grad-5star basis-1/5 flex items-center justify-center rounded-t-md">
    <Tooltip childClassname="items-center justify-center" child={<ImgApi alt="" src={equip.assets.icon} className="max-w-full max-h-full items-center justify-center"/>} info={<p>{equip.name}</p>} infoClassname="rounded-md text-sm bg-gray-800/80 text-white font-normal w-full max-w-xl p-2 absolute top-full left-1/2 transform -translate-x-1/2 translate-y-1 z-20" />
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
                        <div className="text-left">
                            <div className="h-4 w-4">
                                <Icon n={equip.mainStat.name}/>
                            </div>
                        </div>
                        <div className={"text-right grow"}>
                            {statIsPercentage(equip.mainStat.name) ? (equip.mainStat.value * 100).toFixed(1).concat("%"): equip.mainStat.value}
                        </div>
                    </div>
                </div>
            </li>
            {subLine}
        </ul>
    </div>
</div>

    return (
        <Card content={content} minw={ECardSize.SMALL} maxw={ECardSize.SEMI}/>
    )
}