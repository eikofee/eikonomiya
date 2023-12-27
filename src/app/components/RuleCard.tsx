"use client";

import { ICharacterRule } from "../interfaces/ICharacterRule";
import { Card } from "./Card";
import { useContext, useState } from "react";
import Icon from "./Icon";
import InteractiveGaugeComponent from "./InteractiveGaugeComponent";
import { EStat, eStatToReadable } from "@/server/gamedata/enums/EStat";



export default function RuleCard({rule, ruleSetterCallback, saveRuleCallback}: {rule: ICharacterRule, ruleSetterCallback: (_x : ICharacterRule) => void, saveRuleCallback: (_x : ICharacterRule) => void}) {
    let ls = []

    let [hiddableClassname, setHiddableClassname] = useState("hidden")
    const badStats = [
        EStat.HP,EStat.ATK,EStat.DEF
    ]
    
    for (let i = 0; i < rule.stats.length; ++i) {
        let label = rule.stats[i].name
            let classname = "w-full flex flex-row justify-between items pr-4"
            if (i == rule.stats.length - 1) {
                classname += " rounded-md"
            }
            
            const iconDivClassName = badStats.includes(label) ? "text-slate-500/50 fill-slate-500/50" : ""
                ls.push(
                    <li className={classname}>
            <div key={Math.random()} className={"text-left basis-2/5 items-center m-1 flex flex-row ".concat(iconDivClassName)}>
                <div className={"mr-1"}>
                    <Icon n={eStatToReadable(label)} />
                </div><p>
                    {eStatToReadable(label)}
                </p>
            </div>
            <div key={Math.random()} className="grid basis-3/5 grid-cols-7 items-center">
                {<InteractiveGaugeComponent label={label} rule={rule} ruleSetterCallback={ruleSetterCallback} />}
            </div>
        </li>)
    }
    
    let hiddableContent = <div className="w-full">
                                <ul className={hiddableClassname}>
                                    {ls}
                                </ul>
                        </div>
    let saveRule = () => {
        saveRuleCallback(rule)
    }
    let saveButton = <button onClick={saveRule}>
        <svg viewBox="0 0 24 24" className="h-4 w-4">
            <path xmlns="http://www.w3.org/2000/svg" fillRule="evenodd" clipRule="evenodd" d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z" fill="#0F0F0F"/>
        </svg>
    </button>
    let toggleHiddableContent = () => {setHiddableClassname(hiddableClassname == "" ? "hidden" : "")}
    
    let content = <div className="bg-inherit">
            <div className="grow px-1 font-semibold cursor-pointer" onClick={toggleHiddableContent}>Artefact Rating Rule</div>
        <div className={"px-1 gap-x-1 flex flex-row ".concat(hiddableClassname)}>
        <select className="w-full" defaultValue={rule.ruleName}>
            {<option>Add...</option>}
        </select>{saveButton}
        </div>
        {hiddableContent}
    </div>;
    return <Card c={content} />
}