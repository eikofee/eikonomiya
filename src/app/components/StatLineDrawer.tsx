import { EStat, eStatToReadable, stringToEStat } from "@/server/gamedata/enums/EStat"
import Icon from "./Icon"

export default function StatLineDraw({name, value, secondaryValue, prefix, rounded, sub: sub}: {name: string, value: number, secondaryValue?: number, prefix?: string, rounded: boolean, sub?: boolean}) {

    let liClassname = "flex flex-row justify-between-items p-1 text-sm"
    if (rounded) {
        liClassname = liClassname.concat(" rounded-b-md")
    }
    
    let nameClassname = "text-left basis-3/5 items-center text-sm"
    let valueClassname = "text-right basis-2/5"
    
    let v = Math.floor(value).toLocaleString("fr")
    if (name.includes("%")) {
        v = (value * 100).toFixed(1).concat("%")
    }
    if (secondaryValue != undefined) {
        v = v.concat(" -> +", Math.floor(secondaryValue).toLocaleString("fr"))
    }
    
    const lineName = stringToEStat(name) == EStat.UNKNOWN ? name : eStatToReadable(stringToEStat(name))
    let n = <div className="flex flex-row items-center"><Icon n={name} /> <span className="pl-1">{lineName}</span></div>
    
    if (sub != undefined && sub) {
        liClassname = liClassname.concat(" text-xs h-3/4 text-gray-500 italic")
        nameClassname = nameClassname.concat(" pl-4")
        valueClassname = valueClassname.concat(" pr-4")
        n = <p className="pl-2">{lineName}</p>
    } else {
        valueClassname = valueClassname.concat(" pr-2")

    }
    return <li className={liClassname}>
            <div className={nameClassname}>{n}</div>
            <div className={valueClassname}>{prefix != undefined ? prefix : ""}{v}</div>
        </li>
}