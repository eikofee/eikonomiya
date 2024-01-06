"use client";
import { useContext, useState } from "react"
import { ThemeContext } from "./ThemeContext";

interface InfoDivProps {
    child: React.ReactNode,
    childClassname?: string
    info: React.ReactNode
    infoClassname? :string
}

export default function Tooltip(c: InfoDivProps) {

    let [ttClassName, setTTClassName] = useState("hidden")
    const {colorDirector} = useContext(ThemeContext)
    let cn = c.childClassname
    if (cn == undefined)
    {
        cn = "w-full hover:bg-violet-500/10"
    }

    let iname = c.infoClassname
    if (iname == undefined) {
        iname = "rounded-md text-sm bg-gray-800/80 text-white font-normal w-full max-w-xl p-2 absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-1 z-20"
    }

    iname = iname.concat(" outline outline-1 ", colorDirector.outlineAccent(5))

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