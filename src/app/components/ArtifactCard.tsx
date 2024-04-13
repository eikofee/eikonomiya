"use client";

import { useContext } from "react";
import { ICharacterRule } from "../interfaces/ICharacterRule";
import Icon from "./Icon";
import Tooltip from "./Tooltip";
import { ConfigContext } from "./ConfigContext";
import { IArtifact } from "@/server/gamedata/IArtifact";
import { EStat } from "@/server/gamedata/enums/EStat";
import { ImgApi } from "./ImgApi";
import Card, { ECardSize } from "./Card";
import { EAccentType } from "../classes/ColorDirector";

export interface IArtifactCardInfo {
    rule: ICharacterRule,

    totalRolls: number,
    potentialAll: number,
    potentialAllPercent: number,
    potentialP: number,
    potentialPPercent: number,
    scaledScore: number,
    scaledScorePercent: number,
    totalScore: number,
    totalScorePercent: number,
    div: number

}

export default function ArtifactCard({equip, score} : {equip: IArtifact, score: IArtifactCardInfo}) {

    const getRuleValue = (e: EStat) => {
        for (let i = 0; i < score.rule.stats.length; ++i) {
            if (score.rule.stats[i].name == e) {
                return score.rule.stats[i].value
            }
        }

        return 0;
    }
    const isPercentage = (s: string) => s.includes("%")
    const {colorDirector} = useContext(ConfigContext)

    const badStats = [
        EStat.HP,EStat.ATK,EStat.DEF
    ]

    let statList = []
    let statLine = <div key="statline" className="w-full flex flex-row items-center">
                        <div key="stat-label" className="text-left">
                            <div className="w-4 h-4">
                                <Icon key="icon-main" n={equip.mainStat.name.toString()}/>
                            </div>
                        </div>
                        <div key="stat-value" className={"text-right grow"}>
                            {isPercentage(equip.mainStat.name) ? (equip.mainStat.value * 100).toFixed(1): equip.mainStat.value}{isPercentage(equip.mainStat.name) ? "%" : ""}
                        </div>
                    </div>

    statList.push(
        <li key="stat-main" className="flex justify-between place-items-center font-bold">
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
                rolls.push(<div key={"roll-bar-".concat(bar.toString())} className={"h-1 col-span-1 ".concat(colorDirector.bgAccent(EAccentType.STRONG))} />)
            }

            let rest = equip.subStats[i].rollValue - bar + 1;
            rolls.push(<div key={"roll-bar-mid-".concat(i.toString())} className={"h-1 w-full col-span-1 flex flex-row ".concat(colorDirector.bgAccent(EAccentType.LIGHT))}>
                <div className={"h-1 ".concat(colorDirector.bgAccent(EAccentType.STRONG))} style={{width: (rest*100).toString().concat("%")}}/>
                </div>)

            for (bar = bar + 1; bar <= 6; ++bar) {
                rolls.push(<div key={"roll-bar-last-".concat(bar.toString())} className={"h-1 col-span-1 ".concat(colorDirector.bgAccent(EAccentType.LIGHT))} />)
            }
        }

        let statLineClassname = "w-full flex flex-row items-center font-normal ".concat(badStats.includes(equip.subStats[i].name) ? "text-slate-500/50 fill-slate-500/50 " : "text-current")
        let statLine = <div className={statLineClassname}>
                            <div key={"statline-".concat(i.toString(), "-left")} className={"text-left"}>
                                <div className="w-4 h-4">
                                    <Icon key={"icon-".concat(i.toString())} n={equip.subStats[i].name}/>
                                </div>
                            </div>
                            <div key={"statline-".concat(i.toString(), "-right")} className={"text-right grow"}>
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
        <li key={"stat-".concat(i.toString())} className={liClassName}>
            <div className="flex flex-col w-full py-1">
                {statLine}
                <Tooltip key={"tooltip-".concat(i.toString())} child={scoreLineDisplay} info={infoLine} />
            </div>
        </li>
        )
    }

    let infoLine = [
        <p key="total-rolls">Total Rolls : {score.totalRolls.toFixed(1)}/9</p>,
        <p key="potential-all">Potential (all): {(score.potentialAllPercent).toFixed(1)}%</p>,
        <p key="potential-percent">Potential (%): {(score.potentialPPercent).toFixed(1)}%</p>,
        <p key="scaled-score">Scaled Score : {(score.scaledScorePercent).toFixed(1)}%</p>,
        <p key="total-score">Total Score : {(score.totalScore * score.div).toFixed(1)}/{score.div}</p>
    ]
    let scoreLine = <div className="w-full flex flex-row items-center align-baseline font-semibold">
        <div key="score-title" className="text-left basis-3/5 truncate">
            Score :
        </div>
        <div key="score-value" className={"text-right basis-2/5"}>
            {(score.totalScorePercent).toFixed(0).concat("%")}
        </div>
    </div>

    let stars = []
    let starCount = Math.floor(score.potentialP * 9 - 3)
    for (let i = 1; i <= starCount; ++i) {
        let scaledScoreIncr = (0.9 / starCount) * i
            stars.push(<div key={"star-div-".concat(i.toString())}>
                <Icon key={"star-".concat(i.toString())} n="star" useTooltip={false} customColor={score.scaledScore > scaledScoreIncr ? colorDirector.element : "none"}/>
            </div>
            )
    }

    let content = <div className="flex flex-col">
        <div key="artifact-img" className="aspect-square grad-5star basis-1/5 flex items-center justify-center rounded-t-md">
            <div className="relative">
                <ImgApi key="img" alt="" src={equip.assets.icon} className="max-w-full max-h-full"/>
                <div key="stars" className="absolute h-3 flex flex-row bottom-1 w-full justify-center">
                    {stars}
                </div>
            </div>
        </div>
        <div key="artifact-stats" className="basis-4/5 px-1 py-2">
            <ul key="artifact-stats-list">
                {statList}
            </ul>
            <div key="artifact-stats-score" className="w-full flex flex-row">
                <Tooltip key="tooltip-scoreline" child={scoreLine} info={infoLine} childClassname="w-full"/>
            </div>
        </div>
    </div>

    return (
        <Card key="artifact-card" content={content} minw={ECardSize.SMALL} maxw={ECardSize.SEMI}/>
    )
}