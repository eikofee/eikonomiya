import React, { useContext } from "react"
import { ThemeContext } from "./ThemeContext"

interface CardProps {
    c: React.ReactNode
    cname?: string
}

export const Card = (c: CardProps) => {
    const {colorDirector} = useContext(ThemeContext)
    let cname = ""
    if (c.cname != undefined) {
        cname = c.cname
    }
    return (
        <div className={"group rounded-md border min-w-36 max-w-md backdrop-blur-xl bg-white/25 ".concat(colorDirector.borderAccent(3), " ", cname)} >{c.c}</div>
    )
}