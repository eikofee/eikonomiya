"use client";

import { ICharacterRule } from "../interfaces/ICharacterRule";
import Card from "./Card";
import Icon from "./Icon";
import { EStat, eStatToReadable, statIsPercentage, stringToEStat } from "@/server/gamedata/enums/EStat";
import { ConfigContext } from "./ConfigContext";
import { useContext, useState } from "react";
import { IStatTuple } from "@/server/gamedata/IStatTuple";
import { getTotalStatRollValue, ICharacterData } from "@/server/gamedata/ICharacterData";



export default function RuleCard({rule, characterData, setRuleCallback, saveRuleCallback, popupId, setPopupId}: {rule: ICharacterRule, characterData: ICharacterData, setRuleCallback: (_x : ICharacterRule) => void, saveRuleCallback: () => void, popupId: number, setPopupId: (x: number) => void}) {
    const thisId = 2
    let ls = []
    const {colorDirector} = useContext(ConfigContext)
    const [ruleValues, setRuleValues] = useState(rule.stats.map(x => x.value))

    function toggleStatImportance(label: number) {
        return () => {

            let value = ruleValues[label]
            const newValues = [...ruleValues]
            newValues[label] = value == 0 ? 1 : 0
            setRuleValues(newValues)
            let stats : IStatTuple[] = []
            for (let i = 0; i < rule.stats.length; ++i) {
                stats.push({
                    name: rule.stats[i].name,
                    value: newValues[i],
                })
            }
            let newRule : ICharacterRule = {
                character: rule.character,
                ruleName: rule.ruleName,
                stats: stats,
                currentRating: rule.currentRating
            }
            
            setRuleCallback(newRule)
        }
    }
    
    for (let i = 0; i < rule.stats.length; ++i) {
        let label = rule.stats[i].name
            let classname = "flex flex-row justify-between items"
            if (i == rule.stats.length - 1) {
                classname += " rounded-md"
            }

            let statValue = getTotalStatRollValue(characterData, label)
            let statValueText = statValue.toFixed(0)
            if (statIsPercentage(label)) {
                statValueText = (statValue*100).toFixed(1).concat("%")
            }
            
            const iconDivClassName = rule.stats[i].value < 1 ? "text-slate-500/50 fill-slate-500/50" : ""
                ls.push(
            <div className={"text-left items-center m-1 flex flex-row border-2 p-2 rounded-full cursor-pointer ".concat(iconDivClassName, " ", colorDirector.borderAccent(5))} onClick={toggleStatImportance(i)}>
                <div className={"mr-1 h-4"}>
                    <Icon n={label} />
                </div><p>
                    {statValueText}
                </p>
            </div>)
    }

    const buttonIcon = <div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-8 h-8 ">
            <path d="M2 1C1.44772 1 1 1.44772 1 2V21C1 22.1046 1.89543 23 3 23H22C22.5523 23 23 22.5523 23 22C23 21.4477 22.5523 21 22 21L4 21C3.44772 21 3 20.5523 3 20V2C3 1.44772 2.55228 1 2 1Z" fill="#0F0F0F"/>
            <path d="M7 18C6.44771 18 6 17.5523 6 17C6 16.4477 6.44771 16 7 16H10C10.5523 16 11 16.4477 11 17C11 17.5523 10.5523 18 10 18H7Z" fill="#0F0F0F"/>
            <path d="M6 13C6 13.5523 6.44771 14 7 14H13C13.5523 14 14 13.5523 14 13C14 12.4477 13.5523 12 13 12H7C6.44771 12 6 12.4477 6 13Z" fill="#0F0F0F"/>
            <path d="M7 10C6.44771 10 6 9.55229 6 9C6 8.44771 6.44771 8 7 8H16C16.5523 8 17 8.44771 17 9C17 9.55228 16.5523 10 16 10H7Z" fill="#0F0F0F"/>
            <path d="M6 5C6 5.55228 6.44772 6 7 6L19 6C19.5523 6 20 5.55228 20 5C20 4.44771 19.5523 4 19 4L7 4C6.44771 4 6 4.44772 6 5Z" fill="#0F0F0F"/>
        </svg>
    </div>

    const [textSaveButton, setTextSaveButton] = useState("Save Rule")

    let toggleHiddableContent = () => {
        if (popupId == thisId) {
            setTextSaveButton("Save Rule")
        }

        setPopupId(popupId == thisId ? 0 : thisId)
    }

    let saveRuleCb = () => {
        saveRuleCallback()
        setTextSaveButton("Rule Saved")
    }
    
    let content =
            <div className="px-1 font-semibold cursor-pointer h-full" onClick={toggleHiddableContent}>
                <div className={"flex flex-row gap-2 items-center h-full px-2 rounded-md "}>
                    {buttonIcon}
                    Artifact Rating Rule
                </div>
            </div>

    if (popupId != thisId) {
        return <Card content={content} hfull={true} />
    } else {
        return <div className="relative h-full">
                    <Card content={content} hfull={true} />
                    <div className=" w-96 -translate-x-1/4 translate-y-1 absolute rounded-md border flex flex-col backdrop-blur-xl bg-white/25 p-2 z-10 border-slate-400">
                        <div className="flex flex-wrap">
                            {ls}
                        </div>
                        <div className={"w-full text-center justify-around h-full px-2 rounded-md cursor-pointer ".concat(colorDirector.bgAccent(5))} onClick={saveRuleCb}>
                            {textSaveButton}
                        </div>
                    </div>
                </div>
    }
}