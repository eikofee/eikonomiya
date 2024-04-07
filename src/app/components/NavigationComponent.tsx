import { useContext, useState } from "react";
import { ConfigContext } from "./ConfigContext";
import { ICharacterData } from "@/server/gamedata/ICharacterData";
import CharacterSmallCard from "./CharacterSmallCard";
import { ImgApi } from "./ImgApi";
import Card from "./Card";
import { THiddableContentCb } from "./TopOverSpace";

export default function NavigationComponent({currentCharacter, characterList, uid, setContentCallback}:{currentCharacter: ICharacterData, characterList: ICharacterData[], uid: string, setContentCallback: THiddableContentCb}) {



    const {colorDirector} = useContext(ConfigContext)
    const buildCharacterCard = (c: ICharacterData, useHref: boolean, useLargeFont: boolean) => {
        let content = <div className="items-center h-14 w-full flex flex-row cursor-pointer">
                        <div className="h-14 w-full max-w-16 overflow-hidden">
                            <ImgApi className="h-14" src={c.commonData.assets.characterPortrait} alt={""} />
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
        charList.push(<CharacterSmallCard key={"nav-char-".concat(characterList[i].name)} uid={uid} character={characterList[i]} useHref={true} useLargeFont={false} useBackground={false} borderColor={colorDirector.borderAccent(3)} />)
    }

    const toggleHiddable = () => {
        const contentClassName = `
            grid
            w-full
            grid-cols-auto-fit-fr-semi
            gap-2
            rounded-md
            border
            backdrop-blur-xl
            bg-white/25
            p-2
            z-10
            border-slate-400
            `
        setContentCallback(
            <div className={contentClassName}>
            {charList}
        </div>, 1, false)
    }

    let currentButton = <div className="cursor-pointer h-full px-3 w-full" onClick={toggleHiddable}>
                            {buildCharacterCard(currentCharacter, false, true)}
                        </div>


    return (
            <div className="h-full flex w-full flex-row min-w-[64px] max-w-[384px]">
                <Card key="current-char" content={currentButton} grow={true}/>
            </div>
            
    )
}