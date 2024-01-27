import { ICharacterData } from "@/server/gamedata/ICharacterData"

export default function CharacterSmallCard({uid, character, useHref, useLargeFont, useBackground, borderColor}: {uid: string, character: ICharacterData, useHref: boolean, useLargeFont: boolean, useBackground: boolean, borderColor: string}) {
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
    let content = <div className="items-center h-20 w-full flex flex-row cursor-pointer relative">
                        <div className="absolute inset-y-0 -left-2 overflow-hidden">
                            <img className="h-full" src={character.commonData.assets.characterPortrait} alt={""} />
                        </div>
                        <div className={"p-1 text-center absolute top-2 left-20 -right-2 text-ellipsis bg-slate-100/70 rounded-md ".concat(useLargeFont ? "font-bold text-xl" : textSize)}>
                            {character.name}
                        </div>
                        <div className="text-xs absolute bottom-1 -right-2 text-right text-ellipsis bg-slate-100/70 rounded-md p-px">
                            {updateIndicator}
                        </div>
                    </div>

    if (useHref) {
        content = <a href={"/".concat(uid,"/",character.name)}>{content}</a>
    }

    if (useBackground) {
        return <div className="transition ease-in-out group rounded-md border bg-white/25 px-3 cursor-pointer z-10 mb-2 hover:shadow-lg" style={{
            backgroundImage : "url(".concat(character.commonData.assets.characterNameCard, ")"),
            backgroundSize : "cover"
        }} >{content}</div>
    } else {
        return <div className={"transition ease-in-out group rounded-md border bg-white/25 px-3 cursor-pointer z-10 hover:shadow-lg ".concat(borderColor)}>{content}</div>
    }
}