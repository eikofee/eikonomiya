import { useContext, useState } from "react";
import { ConfigContext } from "./ConfigContext";
import { ICharacterData } from "@/server/gamedata/ICharacterData";
import CharacterSelectButton from "./CharacterSelectButton";
import { ImgApi } from "./ImgApi";
import Card from "./Card";
import { ICharacterRule } from "../interfaces/ICharacterRule";

export default function NavigationComponent({currentCharacter, characterList, characterRules, uid, popupId, setPopupId}:{currentCharacter: ICharacterData, characterList: ICharacterData[], characterRules: ICharacterRule[], uid: string, popupId: number, setPopupId: (x: number) => void}) {



    const {colorDirector} = useContext(ConfigContext)
    const thisId = 1

    const buildCharacterCard = (c: ICharacterData, useHref: boolean, useLargeFont: boolean) => {
        let content = <div className="items-center h-14 w-full flex flex-row cursor-pointer">
                        <div className="h-14 w-full max-w-16 overflow-hidden">
                            <ImgApi className="h-14" src={"characters_".concat(c.apiName, "_face")} alt={""} />
                        </div>
                        <div className={"text-center w-full text-ellipsis rounded-md ".concat(useLargeFont ? colorDirector.bgAccent(5).concat(" font-bold text-xl") : "bg-slate-100/60 text-sm")}>
                            {c.name}
                        </div>
                    </div>
        if (useHref) {
            return <a href={"/uid/".concat(uid,"/",c.name)}>{content}</a>
        } else {
            return content
        }
    }

    let charList = []
    for (let i = 0; i < characterList.length; ++i) {
        charList.push(<CharacterSelectButton key={"nav-char-".concat(characterList[i].name)} uid={uid} rule={characterRules[i]} character={characterList[i]} useHref={true} useLargeFont={false} useBackground={false} borderColor={colorDirector.borderAccent(3)} />)
    }

    const contentClassName = `
        grid
        grid-cols-auto-fit-fr-semi
        gap-2
        rounded-md
        border
        backdrop-blur-xl
        bg-white/25
        p-2
        z-10
        border-slate-400
        absolute
        translate-y-1
        w-[75vw]
        min-w-[220px]
        `
    const toggleHiddable = () => {
        setPopupId(thisId == popupId ? 0 : thisId)
    }

    let currentButton = <div className="cursor-pointer h-full px-3 w-full" onClick={toggleHiddable}>
                            {buildCharacterCard(currentCharacter, false, true)}
                        </div>


    if (thisId != popupId) {
        return (
                <div className="h-full flex w-full flex-row min-w-[220px] max-w-[384px]">
                    <Card key="current-char" content={currentButton} wfull={true}/>
                </div>
        )
    } else {
        return <div className="relative h-full w-full max-w-[384px]">
            <div className="relative flex w-full flex-row min-w-[220px] max-w-[384px]">
                    <Card key="current-char" content={currentButton} wfull={true}/>
            </div>
            <div className={contentClassName}>
                {charList}
            </div>
        </div>
    }
}