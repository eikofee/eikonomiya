import { useContext, useState } from "react";
import { Card } from "./Card";
import { ThemeContext } from "./ThemeContext";
import { ICharacterData } from "@/server/gamedata/ICharacterData";

export default function NavigationComponent({currentCharacter, characterList, uid}:{currentCharacter: ICharacterData, characterList: ICharacterData[], uid: string}) {

    const {colorDirector} = useContext(ThemeContext)
    const buildCharacterCard = (c: ICharacterData, useHref: boolean, useLargeFont: boolean) => {
        let content = <div className="items-center h-12 w-full flex flex-row cursor-pointer">
                        <div className="h-12 w-full max-w-16 overflow-hidden">
                            <img className="h-12" src={c.commonData.assets.characterPortrait} alt={""} />
                        </div>
                        <div className={"text-center w-full text-ellipsis rounded-md ".concat(useLargeFont ? colorDirector.bgAccent(5).concat(" font-bold text-xl") : "bg-slate-100/60 text-sm")}>
                            {c.name}
                        </div>
                    </div>
        if (useHref) {
            return <a href={"/".concat(uid,"/",c.name)}>{content}</a>
        } else {
            return content
        }
    }

    let charList = []
    for (let i = 0; i < characterList.length; ++i) {
        charList.push(<Card c={buildCharacterCard(characterList[i], true, false) } cname="px-3 cursor-pointer z-10 h-full" />)
    }

    const [hiddableClassname, setHiddableClassname] = useState("hidden")

    const toggleHiddable = () => {
        if (hiddableClassname == "hidden") {
            setHiddableClassname("z-10")
        } else {
            setHiddableClassname("hidden")
        }
    }

    let currentButton = <div className="h-full" onClick={toggleHiddable}>
                            {buildCharacterCard(currentCharacter, false, true)}
                        </div>


    return (
        <div className={"pl-1 w-full flex flex-col h-14"}>
            <div className="h-full flex flex-row mb-2">
                <Card c={currentButton} cname="px-3 cursor-pointer w-full"/>
            </div>
            <div className={hiddableClassname}>
                <div className={"grid gap-2 grid-cols-1 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 rounded-md border backdrop-blur-xl bg-white/25 p-2 w-3/4 z-10 border-slate-400"}>
                                {charList}
                </div>
            </div>
        </div>
            
    )
}