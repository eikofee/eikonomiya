import { useContext, useState } from "react"
import { ICharacterRule } from "../interfaces/ICharacterRule"
import { ConfigContext } from "./ConfigContext"
import { EStat } from "@/server/gamedata/enums/EStat";
import { IStatTuple } from "@/server/gamedata/IStatTuple";

export default function InteractiveGaugeComponent({label, rule, gaugeid, ruleSetterCallback}: {label: EStat, rule: ICharacterRule, gaugeid: number, ruleSetterCallback: (x: number, id: number) => void}) {
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

    let customSliderChangeCb = (x: any) => {
        console.log(x.target.value)
        let newValue = parseInt(x.target.value)
        // let stats : IStatTuple[] = []
        // for (let i = 0; i < rule.stats.length; ++i) {
        //     if (i == baseIndex) {
        //         stats.push({
        //             name: label,
        //             value: newValue,
        //         })
        //     } else {
        //         console.log(rule.stats[i])
        //         stats.push(rule.stats[i])
        //     }
        // }
        // let newRule : ICharacterRule = {
        //     character: rule.character,
        //     ruleName: rule.ruleName,
        //     stats: stats
        // }

        // ruleSetterCallback(newRule)
        ruleSetterCallback(newValue, gaugeid)
        setCurrentSliderValue(x.target.value)

    }

    const sliderClassName = "".concat(
        "w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:bg-none ",
    )

    let slider = <div className="flex flex-col gap-1 p-2 w-full h-full items-center">
        <div className="relative w-full h-full">
            <input type="range" className={sliderClassName} min="0" max="6" step="1" onChange={customSliderChangeCb} value={currentSliderValue} />
            <span className={"pointer-events-none absolute h-3 left-0 translate-y-1 ".concat(colorDirector.bgAccent(3))} style={{width: (currentSliderValue/6*100).toString().concat("%")}}></span>
            <span className={"pointer-events-none absolute h-3 right-0 translate-y-1 ".concat(colorDirector.bgAccent(6))} style={{width: ((6-currentSliderValue)/6*100).toString().concat("%")}}></span>
            <span className={"pointer-events-none absolute h-4 w-4 translate-y-0.5 -translate-x-1/2 ".concat(colorDirector.bgAccent(1))} style={{left: (currentSliderValue/6*100).toString().concat("%")}}></span>

        </div>
    {/* <ul className="flex justify-between w-full px-[10px]">
        <li className="flex justify-center relative"><span className="absolute">1</span></li>
        <li className="flex justify-center relative"><span className="absolute">2</span></li>
        <li className="flex justify-center relative"><span className="absolute">3</span></li>
        <li className="flex justify-center relative"><span className="absolute">4</span></li>
        <li className="flex justify-center relative"><span className="absolute">5</span></li>
        <li className="flex justify-center relative"><span className="absolute">6</span></li>
    </ul> */}
</div>

    return slider
}