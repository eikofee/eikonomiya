"use client";

import { ICharacterRule } from "../interfaces/ICharacterRule";
import Card from "./Card";
import Icon from "./Icon";
import InteractiveGaugeComponent from "./InteractiveGaugeComponent";
import { EStat, eStatToReadable } from "@/server/gamedata/enums/EStat";
import { THiddableContentCb } from "./TopOverSpace";
import { ColorDirector } from "../classes/ColorDirector";
import { ConfigContext } from "./ConfigContext";
import { useContext, useState } from "react";
import { IStatTuple } from "@/server/gamedata/IStatTuple";



export default function RuleCard({rule, ruleSetterCallback, saveRuleCallback, setContentCallback}: {rule: ICharacterRule, ruleSetterCallback: (_x : ICharacterRule) => void, saveRuleCallback: (_x : ICharacterRule) => void, setContentCallback: THiddableContentCb}) {
    let ls = []
    const {colorDirector} = useContext(ConfigContext)
    const badStats = [
        EStat.HP,EStat.ATK,EStat.DEF
    ]

    const [rrule, setRrule] = useState(rule)
    let saveRule = () => {
        console.log("saving")
        console.log(rrule.stats.map(x => "stat=".concat(x.name, "value=", x.value.toString())))
        saveRuleCallback(rrule)
    }


    function setRuleCallbackLocal(x: number, id: number) {
        console.log("called with")
        console.log(x.toString().concat(", id=", id.toString()))
        let newValue = x
        let stats : IStatTuple[] = []
        for (let i = 0; i < rrule.stats.length; ++i) {
            if (i == id) {
                stats.push({
                    name: rrule.stats[i].name,
                    value: newValue,
                })
            } else {
                stats.push({
                    name: rrule.stats[i].name,
                    value: rrule.stats[i].value,
                })
            }
        }
        let newRule : ICharacterRule = {
            character: rrule.character,
            ruleName: rrule.ruleName,
            stats: stats
        }

        setRrule(newRule)
        ruleSetterCallback(newRule)
        // saveRuleCallback(x)
    }
    
    for (let i = 0; i < rrule.stats.length; ++i) {
        let label = rrule.stats[i].name
            let classname = "w-full flex flex-row justify-between items"
            if (i == rrule.stats.length - 1) {
                classname += " rounded-md"
            }
            
            const iconDivClassName = badStats.includes(label) ? "text-slate-500/50 fill-slate-500/50" : ""
                ls.push(
                    <li className={classname}>
            <div className={"text-left items-center m-1 flex flex-row ".concat(iconDivClassName)}>
                <div className={"mr-1 h-4 w-4"}>
                    <Icon n={label} />
                </div><p>
                    {eStatToReadable(label)}
                </p>
            </div>
            <div className="items-center">
                {<InteractiveGaugeComponent label={label} rule={rrule} gaugeid={i} ruleSetterCallback={setRuleCallbackLocal} />}
            </div>
        </li>)
    }



    console.log("base log")
    console.log(rrule.stats.map(x => "stat=".concat(x.name, "value=", x.value.toString())))

    let hiddableContent = <div className=" w-full flex flex-col rounded-md border backdrop-blur-xl bg-white/25 p-2 z-10 border-slate-400">
            <div className={"w-full items-center justify-around h-full px-2 rounded-md cursor-pointer ".concat(colorDirector.bgAccent(5))} onClick={saveRule}>
                Save Rule
            </div>
                                <ul>
                                    {ls}
                                </ul>
                        </div>
    const buttonIcon = <div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-8 h-8 ">
            <path d="M2 1C1.44772 1 1 1.44772 1 2V21C1 22.1046 1.89543 23 3 23H22C22.5523 23 23 22.5523 23 22C23 21.4477 22.5523 21 22 21L4 21C3.44772 21 3 20.5523 3 20V2C3 1.44772 2.55228 1 2 1Z" fill="#0F0F0F"/>
            <path d="M7 18C6.44771 18 6 17.5523 6 17C6 16.4477 6.44771 16 7 16H10C10.5523 16 11 16.4477 11 17C11 17.5523 10.5523 18 10 18H7Z" fill="#0F0F0F"/>
            <path d="M6 13C6 13.5523 6.44771 14 7 14H13C13.5523 14 14 13.5523 14 13C14 12.4477 13.5523 12 13 12H7C6.44771 12 6 12.4477 6 13Z" fill="#0F0F0F"/>
            <path d="M7 10C6.44771 10 6 9.55229 6 9C6 8.44771 6.44771 8 7 8H16C16.5523 8 17 8.44771 17 9C17 9.55228 16.5523 10 16 10H7Z" fill="#0F0F0F"/>
            <path d="M6 5C6 5.55228 6.44772 6 7 6L19 6C19.5523 6 20 5.55228 20 5C20 4.44771 19.5523 4 19 4L7 4C6.44771 4 6 4.44772 6 5Z" fill="#0F0F0F"/>
        </svg>
    </div>

    let toggleHiddableContent = () => {
            setContentCallback(hiddableContent, 2, true)
    }
    
    let content = <div className="h-full">
            <div className="px-1 font-semibold cursor-pointer h-full" onClick={toggleHiddableContent}>
                <div className={"flex flex-row gap-2 items-center h-full px-2 rounded-md "}>
                    {buttonIcon}
                    Artefact Rating Rule
                </div>
            </div>
    </div>;
    return <Card content={content} />
}