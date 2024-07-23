import { useContext, useState } from "react";
import { ConfigContext } from "./ConfigContext";
import { ICharacterData } from "@/server/gamedata/ICharacterData";
import { ImgApi } from "./ImgApi";
import Card, { ECardSize } from "./Card";
import MarkdownDescription from "./MarkdownDescription";


export default function CharacterCard({char} : {char: ICharacterData}) {
    const {colorDirector} = useContext(ConfigContext)
    let bgClass = "max-w-md flex flex-col"
    const [hoveredItem, setHoveredItem] = useState(0)
    const [hiddableClassname, setHiddableClassname] = useState("hidden")
    const [lockedItem, setLockedItem] = useState(0)

    const buildDescription = (title : string, text : string[]) => {
        const childs = []
        for (let i = 0; i < text.length; ++i) {
            childs.push(<MarkdownDescription html={text[i]} />)
        }
        return <div key="level">
            <p className="text-lg font-bold">{title}</p>
            <br/>
            {childs}
        </div>
    }

    const changeOnHoverCb = (n : number) => {
        return () => {
            if (lockedItem == 0) {
                setHiddableClassname("flex flex-col overflow-y-auto ");
            }

            setHoveredItem(n)
        }
    }

    const changeOnClickCb = (n : number) => {
        return () => {
            if (lockedItem == 0) {
                setHiddableClassname("flex flex-col overflow-y-auto ");
            } else if (lockedItem == n) {
                setHiddableClassname("hidden");
            }
            
            if (lockedItem == n) {
                setLockedItem(0)
            } else {
                setLockedItem(n)
            }
        }
    }

    const changeOffHoverCb = () => {
        if (lockedItem == 0) {
            setHiddableClassname("hidden");
        }

        setHoveredItem(0)
    }

    const buildConstellationIcon = (n: number) => {
        const cn = "w-8 h-8 rounded-full relative cursor-pointer ".concat(char.constellationLevel >= n ? "bg-slate-700/70 outline outline-2 outline-offset-2 ring ".concat(colorDirector.outlineAccent(3)) : "bg-slate-700/30 brightness-25", lockedItem == n ? " outline outline-2 outline-offset-3 ring outline-pink-500 " : "")
        const content = <div key={"const-".concat(n.toString())} className={cn} onMouseEnter={changeOnHoverCb(n)} onMouseLeave={changeOffHoverCb} onClick={changeOnClickCb(n)}>
                            <ImgApi key={"constellation-".concat(n.toString())} src={"characters_".concat(char.apiName, "_c", n.toString())} />
                        </div>
        return content
    }

    let constellations = []
    for (let i = 0; i < char.constellations.length; ++i) {
        constellations.push(buildConstellationIcon(i+1))
    }

    let contentTitle = ""
    let contentDescription = [""]
    let displayedItem = 0
    if (lockedItem > 0) {
        displayedItem = lockedItem
    } else if (hoveredItem > 0) {
        displayedItem = hoveredItem
    }

    if (displayedItem > 0) {
        if (displayedItem > 10) {
            switch (displayedItem) {
                case 11:
                    contentTitle = char.talents.auto.name
                    contentDescription = char.talents.auto.description
                    break;
                case 12:
                    contentTitle = char.talents.skill.name
                    contentDescription = char.talents.skill.description
                    break;
                case 13:
                    contentTitle = char.talents.burst.name
                    contentDescription = char.talents.burst.description
                    break;
            }
        } else {
            contentTitle = char.constellations[displayedItem - 1].name
            contentDescription = char.constellations[displayedItem - 1].description
        }
    }

    let content = <div className={bgClass}>
    <div key="character-card" className="relative flex flex-row justify-center mb-2">
        <ImgApi key="character-card" alt="" className="rounded-md" src={"characters_".concat(char.apiName, "_card")} />
        <div className={"absolute outline outline-1 inset-0 rounded-md text-sm bg-gray-800/80 text-white font-normal w-full max-w-xl p-2 ".concat(hiddableClassname, " ", colorDirector.outlineAccent(5))}>
            {displayedItem > 0 ? buildDescription(contentTitle, contentDescription) : [""]}
        </div>
    </div>
    <div key="character-talents" className="grid grid-cols-3 justify-items-center">
            <div className={"w-16 h-16 rounded-full bg-slate-700/70 relative cursor-pointer".concat(lockedItem == 11 ? " outline outline-2 outline-offset-3 ring outline-pink-500 " : "")} onMouseEnter={changeOnHoverCb(11)} onMouseLeave={changeOffHoverCb} onClick={changeOnClickCb(11)}>
                <ImgApi key="talent-aa" src={"generic_".concat(char.weaponType.toString().toLowerCase())} />
                <div className={"absolute rounded-md text-sm px-1 left-3/4 top-3/4 font-bold ".concat(colorDirector.bgAccent(5))}>{char.talents.auto.level + char.talents.auto.bonusLevel}</div>
            </div>
            <div className={"w-16 h-16 rounded-full bg-slate-700/70 relative cursor-pointer".concat(lockedItem == 12 ? " outline outline-2 outline-offset-3 ring outline-pink-500 " : "")} onMouseEnter={changeOnHoverCb(12)} onMouseLeave={changeOffHoverCb} onClick={changeOnClickCb(12)}>
                <ImgApi key="talent-skill" src={"characters_".concat(char.apiName, "_skill")} />
                <div className={"absolute rounded-md text-sm px-1 left-3/4 top-3/4  font-bold ".concat(colorDirector.bgAccent(5))}>{char.talents.skill.level + char.talents.skill.bonusLevel}</div>
            </div>
            <div className={"w-16 h-16 rounded-full bg-slate-700/70 relative cursor-pointer".concat(lockedItem == 13 ? " outline outline-2 outline-offset-3 ring outline-pink-500 " : "")} onMouseEnter={changeOnHoverCb(13)} onMouseLeave={changeOffHoverCb} onClick={changeOnClickCb(13)}>
                <ImgApi key="talent-burst" src={"characters_".concat(char.apiName, "_burst")} />
                <div className={"absolute rounded-md text-sm px-1 left-3/4 top-3/4  font-bold ".concat(colorDirector.bgAccent(5))}>{char.talents.burst.level + char.talents.burst.bonusLevel}</div>
            </div>
    </div>
    <div key="character-consts" className="grid grid-cols-6 my-3 justify-items-center">
        {constellations}
    </div>

</div>
    return (
        <Card content={content} minw={ECardSize.LARGE} />
    )
}