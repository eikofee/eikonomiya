"use client"
import { useState } from "react"

export default function AddUidWidget() {

    let [currentUid, setCurrentUid] = useState("")

    const setUidCb = (e: any) => {
        setCurrentUid(e.target.value)
    }

    return <div className={"group rounded-md border border-slate-500 w-full backdrop-blur-xl bg-white/25"}>
    <div className="flex flex-col">
        <div className="flex flex-row p-2 h-full items-center">
            <div className="text-sm w-24 mr-1 h-full">
                Add UID :
            </div>
            <input className="rounded-md pl-2 w-full mr-2 " type="text" value={currentUid} onChange={setUidCb}/>
            <div className="text-sm basis-1/5 mr-1 h-full">
                <a href={"/".concat(currentUid)}>
                    <button className="h-1/2 w-full rounded-md text-sm mr-1 border bg-slate-300">Add</button>
                </a>
            </div>
        </div>
    </div>
</div>
}