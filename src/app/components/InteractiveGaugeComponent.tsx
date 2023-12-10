import { useContext, useState } from "react"
import { ICharacterRule } from "../interfaces/ICharacterRule"
import { ThemeContext } from "./ThemeContext"

export default function InteractiveGaugeComponent({label, rule, ruleSetterCallback}: {label: string, rule: ICharacterRule, ruleSetterCallback: (_x : ICharacterRule) => void}) {
    const {colorDirector} = useContext(ThemeContext)
    const [currentSliderValue, setCurrentSliderValue] = useState(rule.stats.get(label))
    const handleSliderChange = (n:number) => (e: any) => {
        let newValue = n
        setCurrentSliderValue(newValue)
        let kv = rule.stats.copy()
        kv.set(label, newValue)
        let newRule : ICharacterRule = {
            character: rule.character,
            ruleName: rule.ruleName,
            stats: kv
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
            <button id={label.concat(" ", j.toString())} className={bClassName} onClick={handleSliderChange(j)} />
            )
        }

    return buttons
}