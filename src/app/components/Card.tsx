import React, { useContext } from "react"
import { ThemeContext } from "./ThemeContext"

interface CardProps {
    c: React.ReactNode
    cname?: string
}

export const Card = (c: CardProps) => {
    const {colorDirector} = useContext(ThemeContext)
    let cname = ""
    let baseCname = "group rounded-md border min-w-36 max-w-md backdrop-blur-xl bg-white/25 "
    if (c.cname != undefined) {
        if (c.cname.includes("max-w-")) {
            baseCname = baseCname.replaceAll("max-w-md", "")
        }
        cname = c.cname
    }
    return (
        <div key={Math.random()} className={baseCname.concat(colorDirector.borderAccent(3), " ", cname)} >{c.c}</div>
    )
}