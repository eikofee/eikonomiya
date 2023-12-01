"use client";

import { useState } from "react";
import { ICharacterRule } from "../interfaces/ICharacterRule";
import { Card } from "./Card";

export default function RuleCard({rule} : {rule: ICharacterRule}) {
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

    let [currentRule, setCurrentRule] = useState(rule)

    for (let i = 0; i < rule.values.length; ++i) {
        const [currentSliderValue, setCurrentSliderValue] = useState(rule.values[i].value)
        const handleSliderChange = (n:number) => (e: any) => {
                let newValue = n
                setCurrentSliderValue(newValue)
                let newRule = currentRule
                newRule.values[i] ={name: currentRule.values[i].name, value: newValue} 
                setCurrentRule(newRule)
                rule = newRule
        }
        let classname = "flex flex-row justify-between items " + (i%2 == 0 ? "bg-slate-50" : "bg-slate-100")
        if (i == rule.values.length - 1) {
            classname += " rounded-b-md"
        }

        let buttons = []
        for (let j = 0; j < 7; ++j) {
            let classname = "w-full h-1/2"
            if (j <= currentRule.values[i].value) {
                classname = classname.concat(" ", colors[currentRule.values[i].value])
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
                <button className={classname} onClick={handleSliderChange(j)} />
            )
        }

        ls.push(
            <li className={classname}>
            <div className="text-left basis-2/5 px-1 items-center">{rule.values[i].name}</div>
            <div className="grid basis-3/5 grid-cols-7 items-center px-2">
                {buttons}
            </div>
        </li>)
    }
    
    let content = <div className="">
        <div className="px-1 font-semibold">{rule.ruleName}</div>
        <ul>
            {ls}
        </ul>
    </div>;
    return <Card c={content} />
}