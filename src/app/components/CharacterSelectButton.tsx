"use client";
import { ICharacterData } from "@/server/gamedata/ICharacterData"
import { ImgApi } from "./ImgApi"
import { ICharacterRule } from "../interfaces/ICharacterRule"
import Icon from "./Icon"
import { useContext } from "react"
import { ConfigContext } from "./ConfigContext"

export default function CharacterSelectButton({uid, character, rule, useHref, useLargeFont, useBackground, borderColor}: {uid: string, character: ICharacterData, rule: ICharacterRule, useHref: boolean, useLargeFont: boolean, useBackground: boolean, borderColor: string}) {

    const {config} = useContext(ConfigContext)
    let textSize = "text-sm"
    if (character.name.length > 14) {
        textSize = "text-xs"
    }

    let age = Date.now() - character.lastUpdated
    let updateIndicator = <div className="h-2 w-2 m-1 rounded-full bg-green-600"/>
    // let updateIndicator = <div className="text-xs[8px] text-green-700">up</div>
    if (age > 900000) {
        let h = ""
        let div = 1
        if (age < 3600000) {
            h = "m ago"
            div = 60000
        } else if (age < 24 * 3600000) {
            h = "h ago"
            div = 3600000
        } else if (age < 7 * 24 * 3600000) {
            h = "d ago"
            div = 24 * 3600000
        } else {
            h = "w ago"
            div = 7 * 24 * 3600000
        }
        let text = Math.floor(age / div).toString().concat(h)
        updateIndicator = <div className="text-xs[8px] px-1">{text}</div>
    }

    let artes = []
    let artesNames = ["fleur", "plume", "sablier", "coupe", "couronne"]
    for (let i = 0 ; i < rule.currentRating.length; ++i) {
        let colorValue = !useBackground ? "bg-red-600" : "fill-red-600"
        let currentValue = rule.currentRating[i]
        if (!rule.currentRated[i]) {
            colorValue = !useBackground ? "bg-gray-500" : "fill-gray-500"
        } else {

            if (currentValue > config.artifactRating.low) {
                colorValue = !useBackground ? "bg-yellow-600" : "fill-yellow-600"
            }
            
            if (currentValue > config.artifactRating.med) {
                colorValue = !useBackground ? "bg-green-600" : "fill-green-600"
            }
        }

        if (useBackground) {
            artes.push(<Icon n={artesNames[i]} customStyle={colorValue} customInfo={(rule.currentRated[i] ? (currentValue * 100).toFixed(0).concat("%") : "N/A")}/>)
        } else {
            artes.push(<div className={"w-1/5 h-[6px] rounded-full ".concat(colorValue)}></div>)
        }
    }

    let arteline = <div className="text-xs absolute flex flex-row gap-1 p-1 bottom-1 left-20 text-ellipsis h-6 bg-slate-100/70 rounded-md">
        {artes}
    </div>
    if (!useBackground) {
        arteline = <div className="text-xs absolute flex flex-row gap-1 p-1 top-10 -right-2 left-20 text-ellipsis h-[14px] rounded-md bg-slate-100/70">
        {artes}
    </div>
    }
    let content = <div className="items-center h-20 w-full flex flex-row cursor-pointer relative">
                        <div className="absolute inset-y-0 -left-2 overflow-hidden">
                            <ImgApi className="h-full w-full" src={"characters_".concat(character.apiName, "_face")} alt={""} s={256} />
                        </div>
                        <div className={"p-1 text-center absolute top-2 left-20 -right-2 text-ellipsis bg-slate-100/70 rounded-md ".concat(useLargeFont ? "font-bold text-xl" : textSize)}>
                            {character.name}
                        </div>
                        
                        {arteline}
                        <div className="text-xs absolute bottom-1 -right-2 text-right text-ellipsis bg-slate-100/70 rounded-md p-px">
                            {updateIndicator}
                        </div>
                    </div>

    if (useHref) {
        content = <a href={"/uid/".concat(uid,"/",character.name)}>{content}</a>
    }

    if (useBackground) {
        return <div className="min-w-[200px] max-w-full transition ease-in-out group rounded-md border bg-white/25 px-3 cursor-pointer z-10 hover:shadow-lg" style={{
            backgroundImage : "url(/api/assets/characters_".concat(character.apiName, "_namecard)"),
            backgroundSize : "cover"
        }} >{content}</div>
    } else {
        return <div className={"min-w-[200px] max-w-full transition ease-in-out group rounded-md border bg-white/25 px-3 cursor-pointer z-10 hover:shadow-lg ".concat(borderColor)}>{content}</div>
    }
}