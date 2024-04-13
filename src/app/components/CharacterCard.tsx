import { useContext, useState } from "react";
import { ConfigContext } from "./ConfigContext";
import { ICharacterData } from "@/server/gamedata/ICharacterData";
import { ImgApi } from "./ImgApi";
import Card, { ECardSize } from "./Card";
import MarkdownDescription from "./MarkdownDescription";


export default function CharacterCard({char} : {char: ICharacterData}) {
    const {colorDirector} = useContext(ConfigContext)
    let bgClass = "max-w-md flex flex-col"
    let fname = char.commonData.assets.characterCard
    const [hoveredItem, setHoveredItem] = useState(0)
    const [hiddableClassname, setHiddableClassname] = useState("hidden")

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
        return () => {setHiddableClassname("flex flex-col"); setHoveredItem(n)}
    }

    const changeOffHoverCb = () => {setHiddableClassname("hidden"); setHoveredItem(0)}

    const buildConstellationIcon = (path: string, n: number) => {
        const cn = "w-8 h-8 rounded-full relative ".concat(char.constellation >= n ? "bg-slate-700/70 outline outline-2 outline-offset-2 ring ".concat(colorDirector.outlineAccent(3)) : "bg-slate-700/30 brightness-25")
        const content = <div key={"const-".concat(n.toString())} className={cn} onMouseEnter={changeOnHoverCb(n)} onMouseLeave={changeOffHoverCb}>
                            <ImgApi key={"constellation-".concat(n.toString())} src={path} />
                        </div>
        return content
    }

    let constellations = []
    const constPaths = [char.commonData.assets.c1, char.commonData.assets.c2, char.commonData.assets.c3, char.commonData.assets.c4, char.commonData.assets.c5, char.commonData.assets.c6]
    const constNames = [char.commonData.constNames.c1, char.commonData.constNames.c2, char.commonData.constNames.c3, char.commonData.constNames.c4, char.commonData.constNames.c5, char.commonData.constNames.c6]
    const constTexts = [char.commonData.constTexts.c1, char.commonData.constTexts.c2, char.commonData.constTexts.c3, char.commonData.constTexts.c4, char.commonData.constTexts.c5, char.commonData.constTexts.c6]
    for (let i = 0; i < constPaths.length; ++i) {
        constellations.push(buildConstellationIcon(constPaths[i], i+1))
    }

    let content = <div className={bgClass}>
    <div key="character-card" className="relative flex flex-row justify-center mb-2">
        <ImgApi key="character-card" alt="" className="rounded-md" src={fname} />
        <div className={"absolute outline outline-1 inset-0 rounded-md text-sm bg-gray-800/80 text-white font-normal w-full max-w-xl p-2 ".concat(hiddableClassname, " ", colorDirector.outlineAccent(5))}>
            {hoveredItem > 0 ? buildDescription(constNames[hoveredItem - 1], constTexts[hoveredItem - 1]) : [""]}
        </div>
    </div>
    <div key="character-talents" className="grid grid-cols-3 justify-items-center">
    <div className="w-16 h-16 rounded-full bg-slate-700/70 relative">
                <ImgApi key="talent-aa" src={char.commonData.assets.aa} />
                <div className={"absolute rounded-md text-sm px-1 left-3/4 top-3/4 ".concat(colorDirector.bgAccent(5))}>{char.skills.levelAA}</div>
            </div>
            <div className="w-16 h-16 rounded-full bg-slate-700/70 relative">
                <ImgApi key="talent-skill" src={char.commonData.assets.skill} />
                <div className={"absolute rounded-md text-sm px-1 left-3/4 top-3/4 ".concat(colorDirector.bgAccent(5))}>{char.skills.levelSkill}</div>
            </div>
            <div className="w-16 h-16 rounded-full bg-slate-700/70 relative">
                <ImgApi key="talent-burst" src={char.commonData.assets.burst} />
                <div className={"absolute rounded-md text-sm px-1 left-3/4 top-3/4 ".concat(colorDirector.bgAccent(5))}>{char.skills.levelUlt}</div>
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