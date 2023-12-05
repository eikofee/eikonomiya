"use client";

import { useContext, useState } from "react";
import { ICharacterRule } from "../interfaces/ICharacterRule";
import { Card } from "./Card";
import { RootContext } from "./RootContext";
import { hostUrl } from "../host";



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
    const labels = ["HP%", "ATK%", "DEF%", "EM", "ER%", "Crit Rate%", "Crit DMG%"]
    
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
                ruleCallback(newRule)
            }
            let classname = "w-64 flex flex-row justify-between items " + (i%2 == 0 ? "bg-slate-50" : "bg-slate-100")
            if (i == labels.length - 1) {
                classname += " rounded-md"
            }
            
            let buttons = []
            for (let j = 0; j < 7; ++j) {
                let bClassName = "h-1/2 rounded-md"
                if (j <= currentSliderValue) {
                    bClassName = bClassName.concat(" ", colors[currentSliderValue])
                } else {
                    bClassName = bClassName.concat(" bg-current")
                }
                // if (j == 0) {
                //     bClassName = bClassName.concat(" rounded-l-lg")
                // }
                // if (j == 6) {
                //     bClassName = bClassName.concat(" rounded-r-lg")
                // }
                buttons.push(
                    <button id={i.toString().concat(" ", j.toString())} className={bClassName} onClick={handleSliderChange(j)} />
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
    
    let hiddableContent = <div>
                                <ul className={hiddableClassname}>
                                    {ls}
                                </ul>
                        </div>
    let saveRule = () => {
        let url = hostUrl().concat("ratingRule?name=", defaultRule.character)
        for (let i = 0; i < labels.length; ++i) {
            url = url.concat("&", labels[i].replaceAll(" ", "+"), "=", defaultRule.stats.get(labels[i]).toString())
        }
        console.log(url)
        fetch(url);
    }
    let saveButton = <button onClick={saveRule}>
        <svg viewBox="0 0 24 24" className="h-4 w-4">
            <path xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd" d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z" fill="#0F0F0F"/>
        </svg>
    </button>
    let toggleHiddableContent = () => {setHiddableClassname(hiddableClassname == "" ? "hidden" : "")}
    
    let content = <div className="">
            <div className="grow px-1 font-semibold" onClick={toggleHiddableContent}>{defaultRule.ruleName}</div>
        <div className={"px-1 flex flex-row ".concat(hiddableClassname)}>
            {saveButton}
        </div>
        {hiddableContent}
    </div>;
    return <Card c={content} />
}