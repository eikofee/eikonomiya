import React, { useContext } from "react"
import { ThemeContext } from "./ThemeContext"

interface CardProps {
    c: React.ReactNode
}

export const Card = (c: CardProps) => {
    const {colorDirector} = useContext(ThemeContext)
    return (
        <div className={"group rounded-md border min-w-36 ".concat(colorDirector.borderAccent(3))} >{c.c}</div>
    )
}