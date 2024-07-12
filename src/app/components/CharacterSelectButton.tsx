import { ICharacterData } from "@/server/gamedata/ICharacterData"
import { ImgApi } from "./ImgApi"
import { ICharacterRule } from "../interfaces/ICharacterRule"
import Icon from "./Icon"

export default function CharacterSelectButton({uid, character, rule, useHref, useLargeFont, useBackground, borderColor}: {uid: string, character: ICharacterData, rule: ICharacterRule, useHref: boolean, useLargeFont: boolean, useBackground: boolean, borderColor: string}) {
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
        let colorValue = "fill-red-600"
        let currentValue = rule.currentRating[i]
        if (currentValue > 0.25) {
            colorValue = "fill-yellow-600"
        }
        
        if (currentValue > 0.5) {
            colorValue = "fill-green-600"
        }

        artes.push(<Icon n={artesNames[i]} customStyle={colorValue} customInfo={(currentValue * 100).toFixed(0).concat("%")}/>)
    }

    let content = <div className="items-center h-20 w-full flex flex-row cursor-pointer relative">
                        <div className="absolute inset-y-0 -left-2 overflow-hidden">
                            <ImgApi className="h-full" src={"characters_".concat(character.apiName, "_face")} alt={""} />
                        </div>
                        <div className={"p-1 text-center absolute top-2 left-20 -right-2 text-ellipsis bg-slate-100/70 rounded-md ".concat(useLargeFont ? "font-bold text-xl" : textSize)}>
                            {character.name}
                        </div>
                        
                        <div className="text-xs absolute flex flex-row gap-1 p-1 bottom-1 left-20 text-ellipsis h-6 bg-slate-100/70 rounded-md">
                            {artes}
                        </div>
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