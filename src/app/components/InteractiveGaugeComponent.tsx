import { useContext, useState } from "react"
import { ConfigContext } from "./ConfigContext"

export default function InteractiveGaugeComponent({type, label, value, ruleSetterCallback}: {type: number, label: number, value: number, ruleSetterCallback: (e:any) => void}) {
    const {colorDirector} = useContext(ConfigContext)

    const sliderClassName = "".concat(
        "w-full appearance-none bg-transparent [&::-webkit-slider-thumb]:opacity-0 [&::-webkit-slider-thumb]:bg-none ",
    )



    let slider = <div className="flex flex-col gap-1 p-2 w-full h-full items-center">
        <div className="relative w-full h-full">
            <input type="range" className={sliderClassName} name={label.toString()} min="0" max="6" step="1" onChange={ruleSetterCallback} value={value} />
            <span className={"pointer-events-none absolute h-3 left-0 translate-y-1 ".concat(colorDirector.bgAccent(3))} style={{width: (value/7*100).toString().concat("%")}}></span>
            <span className={"pointer-events-none absolute h-3 right-0 translate-y-1 ".concat(colorDirector.bgAccent(6))} style={{width: ((6-value)/6*100).toString().concat("%")}}></span>
            <span className={"pointer-events-none absolute h-4 w-4 translate-y-0.5 ".concat(colorDirector.bgAccent(1))} style={{left: (value/7*100).toString().concat("%")}}></span>

        </div>
    </div>

    if (type == 2) {
        let squares = []
        for (let i = 1; i < 7; ++i) {
            squares.push(
                <span className={"translate-y-1 pointer-events-none w-full ".concat(colorDirector.bgAccent(value >= i ? 3 : 6))}></span>
            )
        }

        slider = <div className="flex flex-col gap-1 p-2 w-full h-full items-center">
            <div className="relative w-full h-full">
                <input type="range" className={sliderClassName} name={label.toString()} min="0" max="6" step="1" onChange={ruleSetterCallback} value={value} />
                <div className="absolute pointer-events-none h-1 left-1 w-[108px] flex flex-row gap-1 -translate-y-5">
                    {squares}
                </div>
                <span className={"pointer-events-none absolute h-4 w-2 translate-y-0.5 ".concat(colorDirector.bgAccent(1))} style={{left: (value*18).toString().concat("px")}}></span>
            </div>
        </div>
    }

    return slider
}