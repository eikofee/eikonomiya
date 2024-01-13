import { IEffect } from "@/server/gamedata/IEffect";
import { EEffectType } from "@/server/gamedata/enums/EEffectType";
import { EStat, eStatToReadable } from "@/server/gamedata/enums/EStat";


export default function EffectCardSmall({ e, addToCharacterCb}: { e: IEffect, addToCharacterCb: (x: IEffect) => void }) {

    let summary = []
    if (e.type != EEffectType.NONE) {

        for (let i = 0; i < e.implications[e.implications.length - 1].length; ++i) {
            if (i > 0) {
                summary.push(<span>,</span>)
            }
        
            let impl = e.implications[e.implications.length - 1][i]
            let stat = EStat.UNKNOWN
            if (impl.flatValue != undefined) {
                stat = impl.flatValue.name
            } else if (impl.ratioValue != undefined) {
                stat = impl.ratioValue.target
            }
            summary.push(
                <span>+ {}<span className="font-semibold">{eStatToReadable(stat)}</span></span>
            )
        }
    }

    const cb = () => {
        addToCharacterCb(e)
    }

    return <div onClick={cb} className="bg-slate-200/30 hover:bg-slate-200/90 w-full flex flex-row rounded-md p-2 cursor-pointer">
        <img className="w-12 h-12" src={e.icon} />
        <div className="flex flex-col w-full h-full">
            <p>{e.name}</p>
            <div className="">{summary}</div>
        </div>
    </div>
}
