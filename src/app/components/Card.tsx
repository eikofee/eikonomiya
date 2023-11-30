import React from "react"

interface CardProps {
    c: React.ReactNode
}

export const Card = (c: CardProps) => {
    return (
        <div className="group rounded-md border border-indigo-500 min-w-36" >{c.c}</div>
    )
}