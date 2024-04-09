import React, { useContext } from "react"
import { ConfigContext } from "./ConfigContext"

export enum ECardSize {
    TINY = 60,
    SMALL = 120,
    SEMI = 200,
    MEDIUM = 280,
    LARGE = 300,
    VERY_LARGE = 500
}

function eCardSizeToTailwindSize(size : ECardSize, min : boolean) {
    if (min) {
        switch(size) {
            case ECardSize.TINY:
                return "min-w-[60px]"
            case ECardSize.SMALL:
                return "min-w-[120px]"
            case ECardSize.SEMI:
                return "min-w-[200px]"
            case ECardSize.MEDIUM:
                return "min-w-[280px]"
            case ECardSize.LARGE:
                return "min-w-[400px]"
            case ECardSize.VERY_LARGE:
                return "min-w-[500px]"
        }
    } else {
        switch(size) {
            case ECardSize.TINY:
                return "max-w-[60px]"
            case ECardSize.SMALL:
                return "max-w-[120px]"
            case ECardSize.SEMI:
                return "max-w-[200px]"
            case ECardSize.MEDIUM:
                return "max-w-[280px]"
            case ECardSize.LARGE:
                return "max-w-[400px]"
            case ECardSize.VERY_LARGE:
                return "max-w-[500px]"
        }
    }
}

export default function Card({
        content,
        minw,
        maxw,
        grow,
        hfull,
        wfull
    } : {
        content: React.ReactNode,
        minw?: ECardSize,
        maxw?: ECardSize,
        grow?: boolean,
        hfull?: boolean,
        wfull?: boolean
    }) {
    const {colorDirector} = useContext(ConfigContext)
    const baseName = `
        shrink
        rounded-md
        border
        backdrop-blur-xl
        bg-white/25
    `
    const colorBase = colorDirector.borderAccent(3)
    const growBase = grow ? "grow" : ""
    const minSize = minw != undefined ? eCardSizeToTailwindSize(minw, true) : ""
    const maxSize = maxw != undefined ? eCardSizeToTailwindSize(maxw, false) : ""
    const hfullBase = hfull ? "h-full" : ""
    const wfullBase = wfull ? "w-full" : ""

    const finaleClassname = [baseName, colorBase, growBase, minSize, maxSize, hfullBase, wfullBase].join(" ")
    return (
        <div className={finaleClassname}>{content}</div>
    )
}