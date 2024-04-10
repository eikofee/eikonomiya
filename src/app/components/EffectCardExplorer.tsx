import { IEffect, copyEffect } from '@/server/gamedata/IEffect';
import EffectCardSmall from './EffectCardSmall';
import { ChangeEvent, ChangeEventHandler, useContext, useState } from 'react';
import { ConfigContext } from './ConfigContext';

export default function EffectCardExplorer({allCards, addToCharacterCb} : {allCards : IEffect[], addToCharacterCb : (x: IEffect) => void}) {

    let [currentSearch, setCurrentSearch] = useState("")


    const cb = (x: IEffect) => {
        setCurrentSearch("")
        addToCharacterCb(x)
    }
    let effectCards = []
    if (currentSearch != "") {
        const csws = currentSearch.split(" ")
        let candidates :IEffect[] = []
        allCards.forEach(x => candidates.push(x))
        // for (let ii = 0; ii < csws.length; ++ii) {
        for (let ii = 0; ii < csws.length; ++ii) {
            let currentCandidates : IEffect[] = []
            const w = csws[ii]
            if (w != "") {
                for (let i = 0; i < candidates.length; ++i) {
                    if (candidates[i].name.toLowerCase().includes(w.toLowerCase())
                    || candidates[i].keywords.join(" ").toLowerCase().includes(w.toLowerCase())) {
                        currentCandidates.push(candidates[i])
                    }
                }

                candidates = []
                currentCandidates.forEach(x => candidates.push(x))
            }
        }

        for (let i = 0; i < Math.min(5, candidates.length); ++i) {
            effectCards.push(<EffectCardSmall e={candidates[i]} addToCharacterCb={cb} />)
        }
    }
        

    const setSearchCb = (e: any) => {
        setCurrentSearch(e.target.value)
    }

    const {colorDirector} = useContext(ConfigContext)

    return <div className={"group rounded-md border min-w-[300px] max-w-[500px] backdrop-blur-xl bg-white/25 ".concat(colorDirector.borderAccent(3))}>
            <div className="flex flex-col">
                <div className="flex flex-row p-2 h-full items-center">
                    <p className="text-sm mr-1 h-full min-w-[80px]">
                        Add effect :
                    </p>
                    <input className="rounded-md pl-2 grow " type="text" value={currentSearch} onChange={setSearchCb}/>
                </div>
                <div>
                    {effectCards}
                </div>
            </div>
        </div>
}
