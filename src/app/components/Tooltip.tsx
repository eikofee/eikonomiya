"use client";
import { useState } from "react"

interface InfoDivProps {
    child: React.ReactNode,
    childClassname?: string
    info: React.ReactNode
    infoClassname? :string
}

export default function InfoDiv(c: InfoDivProps) {

    let [ttClassName, setTTClassName] = useState("hidden")
    let cn = c.childClassname
    if (cn == undefined)
    {
        cn = "w-full hover:bg-violet-500/10"
    }

    let iname = c.infoClassname
    if (iname == undefined)
    {
        iname = "transition duration-300 z-10 absolute bg-gray-800 text-white font-normal text-sm rounded p-2 whitespace-nowrap top-full left-1/2 transform -translate-x-1/2 -translate-y-16"
    }

    function displayTT() {
        setTTClassName(iname!)
    }

    function hideTT() {
        setTTClassName("transition duration-300 hidden")
    }

    return(<div className={cn?.concat(" relative")} onMouseEnter={displayTT} onMouseLeave={hideTT}>
        {c.child}
        <div className={ttClassName} onMouseEnter={hideTT}>
            {c.info}
        </div>
    </div>
    )
}