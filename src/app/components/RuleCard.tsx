"use client";

import { ICharacterRule } from "../interfaces/ICharacterRule";
import Card from "./Card";
import Icon from "./Icon";
import InteractiveGaugeComponent from "./InteractiveGaugeComponent";
import { EStat, eStatToReadable, stringToEStat } from "@/server/gamedata/enums/EStat";
import { ConfigContext } from "./ConfigContext";
import { useContext, useState } from "react";
import { IStatTuple } from "@/server/gamedata/IStatTuple";



export default function RuleCard({rule, setRuleCallback, saveRuleCallback, popupId, setPopupId}: {rule: ICharacterRule, setRuleCallback: (_x : ICharacterRule) => void, saveRuleCallback: () => void, popupId: number, setPopupId: (x: number) => void}) {
    const thisId = 2
    let ls = []
    const {colorDirector} = useContext(ConfigContext)
    const badStats = [
        EStat.HP,EStat.ATK,EStat.DEF
    ]

    const [ruleValues, setRuleValues] = useState(rule.stats.map(x => x.value))

    function updateRuleFromGauge(e: any) {
        let value = parseInt(e.target.value)
        let label = parseInt(e.target.name)
        const newValues = [...ruleValues]
        newValues[label] = value
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
            stats: stats
        }
        
        setRuleCallback(newRule)
    }
    
    for (let i = 0; i < rule.stats.length; ++i) {
        let label = rule.stats[i].name
            let classname = "w-full flex flex-row justify-between items"
            if (i == rule.stats.length - 1) {
                classname += " rounded-md"
            }
            
            const iconDivClassName = badStats.includes(label) ? "text-slate-500/50 fill-slate-500/50" : ""
                ls.push(
                    <li className={classname}>
            <div className={"text-left items-center m-1 flex flex-row ".concat(iconDivClassName)}>
                <div className={"mr-1 h-4 w-4"}>
                    <Icon n={label} />
                </div><p>
                    {eStatToReadable(label)} : {ruleValues[i]}
                </p>
            </div>
            <div className="items-center">
                {<InteractiveGaugeComponent type={2} label={i} value={ruleValues[i]} ruleSetterCallback={updateRuleFromGauge} />}
            </div>
        </li>)
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
        // TODO: set proper callback answer (200 or else)
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
                    <div className=" w-96 -translate-x-1/4 translate-y-1 absolute flex flex-col rounded-md border backdrop-blur-xl bg-white/25 p-2 z-10 border-slate-400">
                    <ul>
                        {ls}
                    </ul>
                        <div className={"w-full text-center justify-around h-full px-2 rounded-md cursor-pointer ".concat(colorDirector.bgAccent(5))} onClick={saveRuleCb}>
                            {textSaveButton}
                        </div>
            </div>
        </div>
    }
}