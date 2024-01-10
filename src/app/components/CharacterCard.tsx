import { useContext } from "react";
import { ConfigContext } from "./ConfigContext";
import { Card } from "./Card";
import { ICharacterData } from "@/server/gamedata/ICharacterData";

export default function CharacterCard({char} : {char: ICharacterData}) {
    const {colorDirector} = useContext(ConfigContext)
    let bgClass = "max-w-md flex flex-col"
    let fname = char.commonData.assets.characterCard

    const buildConstellationIcon = (path: string, n: number) => {
        const cn = "m-3 w-8 h-8 rounded-full relative ".concat(char.constellation >= n ? "bg-slate-700/70 outline outline-2 outline-offset-2 ring ".concat(colorDirector.outlineAccent(3)) : "bg-slate-700/30 brightness-25")
        return <div className={cn}>
        <img src={path} />
    </div>
    }

    let constellations = []
    const constPaths = [char.commonData.assets.c1, char.commonData.assets.c2, char.commonData.assets.c3, char.commonData.assets.c4, char.commonData.assets.c5, char.commonData.assets.c6]
    for (let i = 0; i < constPaths.length; ++i) {
        constellations.push(buildConstellationIcon(constPaths[i], i+1))
    }

    let content = <div className={bgClass}>
    <div>
        <img alt="" className="rounded-t-md" src={fname} />
    </div>
    <div className="grid grid-cols-3 items-center">
    <div className="w-16 h-16 rounded-full bg-slate-700/70 m-3 relative">
                <img src={char.commonData.assets.aa} />
                <div className={"absolute rounded-md text-sm px-1 left-3/4 top-3/4 ".concat(colorDirector.bgAccent(5))}>{char.skills.levelAA}</div>
            </div>
            <div className="w-16 h-16 rounded-full bg-slate-700/70 m-3 relative">
                <img src={char.commonData.assets.skill} />
                <div className={"absolute rounded-md text-sm px-1 left-3/4 top-3/4 ".concat(colorDirector.bgAccent(5))}>{char.skills.levelSkill}</div>
            </div>
            <div className="w-16 h-16 rounded-full bg-slate-700/70 m-3 relative">
                <img src={char.commonData.assets.burst} />
                <div className={"absolute rounded-md text-sm px-1 left-3/4 top-3/4 ".concat(colorDirector.bgAccent(5))}>{char.skills.levelUlt}</div>
            </div>
    </div>
    <div className="grid grid-cols-6">
        {constellations}
    </div>

</div>
    return (
        <Card c={content} />
    )
}