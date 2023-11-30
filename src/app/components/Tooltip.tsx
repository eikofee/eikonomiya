"use client";
import { useState } from "react"

interface InfoDivProps {
    child: React.ReactNode,
    info: React.ReactNode
}

export default function InfoDiv(c: InfoDivProps) {
    let [ttClassName, setTTClassName] = useState("hidden")
    function displayTT() {
        setTTClassName("z-10 absolute bg-gray-800 text-white font-normal text-sm rounded p-2 whitespace-nowrap top-full left-1/2 transform -translate-x-1/2 -translate-y-16")
    }

    function hideTT() {
        setTTClassName("hidden")
    }

    return(<div className="relative inline-block hover:bg-violet-500/10" onMouseEnter={displayTT} onMouseLeave={hideTT}>
        {c.child}
        <div className={ttClassName} onMouseEnter={hideTT}>
            {c.info}
        </div>
    </div>
    )
}