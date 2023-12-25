import { useContext, useState } from "react"
import { ICharacterRule } from "../interfaces/ICharacterRule"
import { ThemeContext } from "./ThemeContext"

export default function InteractiveGaugeComponent({label, rule, ruleSetterCallback}: {label: string, rule: ICharacterRule, ruleSetterCallback: (_x : ICharacterRule) => void}) {
    const {colorDirector} = useContext(ThemeContext)
    let baseValue = 3;
    let baseIndex = 0;
    for (let i = 0; i < rule.stats.length; ++i){
        if (rule.stats[i].name == label) {
            baseValue = rule.stats[i].value
            baseIndex = i
        }
    }

    const [currentSliderValue, setCurrentSliderValue] = useState(baseValue)
    const handleSliderChange = (n:number) => (e: any) => {
        let newValue = n
        setCurrentSliderValue(newValue)
        let stats : IStatTuple[] = []
        for (let i = 0; i < rule.stats.length; ++i) {
            if (i == baseIndex) {
                stats.push({
                    name: label,
                    value: newValue
                })
            } else {
                stats.push(rule.stats[i])
            }
        }
        let newRule : ICharacterRule = {
            character: rule.character,
            ruleName: rule.ruleName,
            stats: stats
        }

        ruleSetterCallback(newRule)
    }

    let buttons = []
    for (let j = 0; j < 7; ++j) {
        let bClassName = "h-1/2 rounded-md"
        if (j <= currentSliderValue) {
            bClassName = bClassName.concat(" ", colorDirector.bgAccent(3))
            // bClassName = bClassName.concat(" ", colors[currentSliderValue])
        } else {
            // bClassName = bClassName.concat(" ", colorsDown[currentSliderValue])
            bClassName = bClassName.concat(" ", colorDirector.bgAccent(6))
        }
        buttons.push(
            <button key={label.concat(" ", j.toString())} className={bClassName} onClick={handleSliderChange(j)} />
            )
        }

    return buttons
}