"use client";

import { useContext, useState } from "react";
import { ICharacterRule } from "../interfaces/ICharacterRule";
import { Card } from "./Card";
import Icon from "./Icon";
import Tooltip from "./Tooltip";
import { ThemeContext } from "./ThemeContext";
import { IArtefact } from "@/server/gamedata/IArtefact";
import { EStat, eStatToReadable } from "@/server/gamedata/enums/EStat";
import { IStatTuple } from "@/server/gamedata/IStatTuple";

export default function ArtefactCard({equip, rule, sortedStats, scoreState} : {equip: IArtefact, rule: ICharacterRule, sortedStats: IStatTuple[], scoreState: (a: number) => void}) {



    const getRuleValue = (e: EStat) => {
        for (let i = 0; i < rule.stats.length; ++i) {
            if (rule.stats[i].name == e) {
                return rule.stats[i].value
            }
        }

        return 0;
    }
    const isPercentage = (s: string) => s.includes("%")
    const {colorDirector} = useContext(ThemeContext)
    const fontWeight = [
        // "font-light", //0-1
        "font-normal", //1-2
        "font-normal", //1-2
        // "font-normal", //1-2
        "font-medium", // 2-3
        "font-medium", //3-4
        "font-bold", //4-5
        "font-bold"
    ]

    const badStats = [
        EStat.HP,EStat.ATK,EStat.DEF
    ]

    let mainIndex = 0
    let div = 1;
    let mvs = sortedStats
    if (mvs[mainIndex].name == equip.mainStat.name) {
        mainIndex += 1
    }

    div = 6 * mvs[mainIndex].value
    for (let i = mainIndex + 1; i < mainIndex + 4; ++i) {
        if (mvs[i].name != equip.mainStat.name) {
            div += mvs[i].value
        } else {
            mainIndex += 1
        }
    }
    div = Math.max(1, div)

    let statList = []
    let statLine = <div className="w-full flex flex-row items-center">
                        <div className="text-left max-h-4">
                            <Icon n={equip.mainStat.name.toString()}/>
                        </div>
                        <div className={"text-right grow"}>
                            {isPercentage(equip.mainStat.name) ? (equip.mainStat.value * 100).toFixed(1): equip.mainStat.value}{isPercentage(equip.mainStat.name) ? "%" : ""}
                        </div>
                    </div>

    statList.push(
        <li className="flex justify-between place-items-center font-bold">
            <div className="flex flex-col w-full py-1">
                {statLine}
            </div>
        </li>
    )

    for (let i = 0; i < equip.subStats.length; ++i) {
        let liClassName = "flex justify-between place-items-center"
        let rolls = []
        let bar = 0
        if (equip.subStats[i].rollValue > 0) {
            for (bar = 1; bar < equip.subStats[i].rollValue; ++bar) {
                rolls.push(<div className={"h-1 col-span-1 ".concat(colorDirector.bgAccent(3))} />)
            }

            let rest = equip.subStats[i].rollValue - bar + 1;
            rolls.push(<div className={"h-1 w-full col-span-1 flex flex-row ".concat(colorDirector.bgAccent(5))}>
                <div className={"h-1 ".concat(colorDirector.bgAccent(3))} style={{width: (rest*100).toString().concat("%")}}/>
                </div>)

            for (bar = bar + 1; bar <= 6; ++bar) {
                rolls.push(<div className={"h-1 col-span-1 ".concat(colorDirector.bgAccent(5))} />)
            }
        }

        let statLineClassname = "w-full flex flex-row items-center ".concat(fontWeight[Math.floor(equip.subStats[i].rollValue)], " ", badStats.includes(equip.subStats[i].name) ? "text-slate-500/50 fill-slate-500/50 " : "text-current")
        let statLine = <div className={statLineClassname}>
                            <div className={"text-left max-h-4"}>
                                <Icon n={equip.subStats[i].name}/>
                            </div>
                            <div className={"text-right grow"}>
                                {isPercentage(equip.subStats[i].name) ? (equip.subStats[i].value * 100).toFixed(1): equip.subStats[i].value}{isPercentage(equip.subStats[i].name) ? "%" : ""}
                            </div>
                        </div>
        let infoLine = <div>
            <p>
            {"".concat("Rolls = ", (equip.subStats[i].rollValue).toFixed(1))}
            </p><p>
                {"Score = ".concat((equip.subStats[i].rollValue * getRuleValue(equip.subStats[i].name!)).toFixed(1))}
                </p>
            </div>
        let scoreLineDisplay = <div className="grid grid-cols-6 gap-x-0.5">
            {rolls}
        </div>
        statList.push(
        <li className={liClassName}>
            <div className="flex flex-col w-full py-1">
                {statLine}
                
                    <Tooltip child={scoreLineDisplay} info={infoLine} />
            </div>
        </li>
        )
    }
    let score = 0
    for (let i = 0; i < equip.subStats.length; ++i) {
        score += equip.subStats[i].rollValue * getRuleValue(equip.subStats[i].name)
    }

    let scoreValue = score/div*100
    scoreState(scoreValue)
    let infoLine = <p>{score.toFixed(1)}/{div}</p>
    let scoreLine = <div className="w-full flex flex-row items-center align-baseline font-semibold">
        <div className="text-left basis-3/5 truncate">
            Score :
        </div>
        <div className={"text-right basis-2/5"}>
            {scoreValue.toFixed(0).concat("%")}
        </div>
    </div>

    let content = <div className="flex flex-col">
    <div className="aspect-square grad-5star basis-1/5 flex items-center justify-center rounded-t-md">
        <img alt="" src={equip.assets.icon} className="max-w-full max-h-full"/>
    </div>
    <div className="basis-4/5 px-1 py-2">
        <ul>
            {statList}
        </ul>
        <div className="w-full flex flex-row">
            <Tooltip child={scoreLine} info={infoLine} childClassname="w-full"/>
        </div>
    </div>
</div>

    return (
        <Card c={content}/>
    )
}