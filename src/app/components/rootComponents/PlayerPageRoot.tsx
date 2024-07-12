"use client";
import CharacterSelectButton from "../CharacterSelectButton"
import { ConfigContext } from "../ConfigContext"
import PlayerInfoCardBig from "../playerInfoCards/PlayerInfoCard"
import { IPlayerInfo } from "@/server/gamedata/IPlayerInfo"
import { ICharacterData } from "@/server/gamedata/ICharacterData"
import { ICharacterRule } from "@/app/interfaces/ICharacterRule"
import { ConfigDirector } from "@/app/classes/ConfigDirector"
import { ColorDirector } from "@/app/classes/ColorDirector"
import { EElement } from "@/server/gamedata/enums/EElement"

export default function PlayerPageRoot({playerInfo, characters, characterRules, config} : {playerInfo: IPlayerInfo, characters: ICharacterData[], characterRules: ICharacterRule[], config: ConfigDirector}) {

    
    let charList = []

    for (let i = 0; i < characters.length; ++i) {
        const charRule = characterRules.filter(x => x.character == characters[i].name)[0]
        // charList.push(<Card c={buildCharacterCard(characterList[i], true, false) } cname="px-3 cursor-pointer z-10" />)
        charList.push(<CharacterSelectButton uid={playerInfo.uid} character={characters[i]} rule={charRule} useHref={true} useLargeFont={false} useBackground={true} borderColor="" />)
    }

    
    let content = <div className={"pl-1 w-full h-screen flex flex-col place-content-center items-center"}>
        <PlayerInfoCardBig info={playerInfo} />
        <div className="grid grid-cols-auto-fit-fr-medium max-w-[1600px] gap-2 rounded-md border backdrop-blur-xl bg-white/25 p-2 w-3/4 z-10 border-slate-400">
            {charList}
        </div>
    </div>

    return <ConfigContext.Provider value={{colorDirector: new ColorDirector(EElement.NONE), config: config}}>
        {content}

    </ConfigContext.Provider>
}