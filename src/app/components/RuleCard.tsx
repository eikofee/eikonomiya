"use client";

import { useContext, useState } from "react";
import { ICharacterRule } from "../interfaces/ICharacterRule";
import { Card } from "./Card";
import { RootContext } from "./RootContext";
import { KVStats } from "../classes/KVStats";



export default function RuleCard() {
    let ls = []
    const colors = [
        "bg-red-400",
        "bg-orange-400",
        "bg-yellow-400",
        "bg-lime-400",
        "bg-green-400",
        "bg-teal-400",
        "bg-sky-400",
    ]

    let [hiddableClassname, setHiddableClassname] = useState("hidden")
    const {defaultRule, ruleCallback} = useContext(RootContext)
    const labels = ["HP", "ATK", "DEF", "HP%", "ATK%", "DEF%", "EM", "ER%", "Crit Rate%", "Crit DMG%"]
    
    for (let i = 0; i < labels.length; ++i) {
        let label = labels[i]
            const [currentSliderValue, setCurrentSliderValue] = useState(defaultRule.stats.get(label))
            const handleSliderChange = (n:number) => (e: any) => {
                let newValue = n
                setCurrentSliderValue(newValue)
                let kv = defaultRule.stats.copy()
                kv.set(label, newValue)
                let newRule : ICharacterRule = {
                    character: defaultRule.character,
                    ruleName: defaultRule.ruleName,
                    stats: kv
                }
                console.log(newRule)
                ruleCallback(newRule)
            }
            let classname = "flex flex-row justify-between items " + (i%2 == 0 ? "bg-slate-50" : "bg-slate-100")
            if (i == labels.length - 1) {
                classname += " rounded-b-md"
            }
            
            let buttons = []
            for (let j = 0; j < 7; ++j) {
                let classname = "w-full h-1/2"
                if (j <= currentSliderValue) {
                    classname = classname.concat(" ", colors[currentSliderValue])
                } else {
                    classname = classname.concat(" bg-current")
                }
                if (j == 0) {
                    classname = classname.concat(" rounded-l-lg")
                }
                if (j == 6) {
                    classname = classname.concat(" rounded-r-lg")
                }
                buttons.push(
                    <button id={i.toString().concat(" ", j.toString())} className={classname} onClick={handleSliderChange(j)} />
                    )
                }
                
                ls.push(
                    <li className={classname}>
            <div className="text-left basis-2/5 px-1 items-center">{labels[i]}</div>
            <div className="grid basis-3/5 grid-cols-7 items-center px-2">
                {buttons}
            </div>
        </li>)
    }
    
    let hiddableContent =   <ul className={hiddableClassname}>
                                {ls}
                            </ul>
    let toggleHiddableContent = () => {setHiddableClassname(hiddableClassname == "" ? "hidden" : "")}
    
    let content = <div className="">
        <div className="px-1 font-semibold" onClick={toggleHiddableContent}>{defaultRule.ruleName}</div>
        {hiddableContent}
    </div>;
    return <Card c={content} />
}