import { useContext, useState } from "react"
import { ICharacterRule } from "../interfaces/ICharacterRule"
import { ConfigContext } from "./ConfigContext"
import { EStat } from "@/server/gamedata/enums/EStat";
import { IStatTuple } from "@/server/gamedata/IStatTuple";

export default function InteractiveGaugeComponent({label, rule, ruleSetterCallback}: {label: EStat, rule: ICharacterRule, ruleSetterCallback: (_x : ICharacterRule) => void}) {
    const {colorDirector} = useContext(ConfigContext)
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
                    value: newValue,
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
        let bClassName = "h-3 w-3 rounded-full"
        if (j <= currentSliderValue) {
            bClassName = bClassName.concat(" ", colorDirector.bgAccent(3))
            // bClassName = bClassName.concat(" ", colors[currentSliderValue])
        } else {
            // bClassName = bClassName.concat(" ", colorsDown[currentSliderValue])
            bClassName = bClassName.concat(" ", colorDirector.bgAccent(6))
        }
        buttons.push(
            <button className={bClassName} onClick={handleSliderChange(j)} />
            )
        }

    return buttons
}