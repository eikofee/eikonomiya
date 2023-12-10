import { useState } from "react";
import { ICharacter } from "../interfaces/ICharacter";
import { Card } from "./Card";

export default function NavigationComponent({currentCharacter, characterList, uid}:{currentCharacter: ICharacter, characterList: ICharacter[], uid: string}) {

    const buildCharacterCard = (c: ICharacter, useHref: boolean) => {
        let content = <div className="basis-1/4 items-center h-full flex flex-row cursor-pointer">
                    <div className="h-12">
                        <img className="h-12" src={"/characterPortraits/".concat(c.name.toLowerCase(), ".png")} />
                    </div>
                    <div>
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
        charList.push(<Card c={buildCharacterCard(characterList[i], true) } cname="px-3 cursor-pointer" />)
    }

    const [hiddableClassname, setHiddableClassname] = useState("hidden")

    const toggleHiddable = () => {
        if (hiddableClassname == "hidden") {
            setHiddableClassname("flex flex-row h-full gap-x-2 mb-2 z-10")
        } else {
            setHiddableClassname("hidden")
        }
    }

    let currentButton = <div className="h-full" onClick={toggleHiddable}>
                            {buildCharacterCard(currentCharacter, false)}
                        </div>


    return (
        <div className={"pl-1 w-full flex flex-col h-14"}>
            <div className="h-full flex flex-row mb-2">
                <Card c={currentButton} cname="px-3 cursor-pointer"/>
            </div>
            <div className={hiddableClassname}>
                {charList}
            </div>
        </div>
            
    )
}