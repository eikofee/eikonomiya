import { ReactNode } from "react";
import { Card } from "./Card";

export interface ILine {
    name: ReactNode
    value: ReactNode
    info?: ReactNode
}

export default function StatCard({name, lines} : {name: string, lines: ILine[]}) {

    let ls = []
    for (let i = 0; i < lines.length; ++i) {
        let classname = "flex flex-row justify-between items " + (i%2 == 0 ? "bg-slate-50" : "bg-slate-100")
        if (i == lines.length - 1) {
            classname += " rounded-b-md"
        }

        ls.push(
        <li className={classname}>
            <div className="text-left basis-3/5 px-1 items-center">{lines[i].name}</div>
            <div className="text-right basis-2/5 px-1">{lines[i].value}</div>
        </li>)
    }
    
    let content = <div className="">
        <div className="px-1 font-semibold">{name}</div>
        <ul>
            {ls}
        </ul>
    </div>;

    return(
        <Card c={content}/>
    )
}