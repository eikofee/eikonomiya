import { useContext, useState } from "react";
import { Card } from "./Card";
import { ThemeContext } from "./ThemeContext";
import { ICharacterData } from "@/server/gamedata/ICharacterData";

export default function NavigationComponent({currentCharacter, characterList, uid}:{currentCharacter: ICharacterData, characterList: ICharacterData[], uid: string}) {

    const {colorDirector} = useContext(ThemeContext)
    const buildCharacterCard = (c: ICharacterData, useHref: boolean, useLargeFont: boolean) => {
        let content = <div className="basis-1/4 items-center h-full flex flex-row cursor-pointer">
                    <div key={Math.random()} className="h-12 basis-1/2 overflow-hidden">
                        <img alt="" className="aspect-square h-full" src={c.commonData.assets.characterPortrait} />
                    </div>
                    <div key={Math.random()} className={"items-center basis-1/2 ".concat(useLargeFont ? "font-bold text-xl" : "")}>
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
        charList.push(<Card c={buildCharacterCard(characterList[i], true, false) } cname="px-3 cursor-pointer z-10" />)
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
                <div className={"rounded-md border backdrop-blur-xl bg-white/25 p-2 grid grid-cols-5 w-1/2 gap-2 mb-2 z-10 ".concat(colorDirector.borderAccent(3))}>
                    {charList}
                </div>
            </div>
        </div>
            
    )
}