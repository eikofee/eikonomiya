"use client";
import CharacterSelectButton from "../CharacterSelectButton"
import { ConfigContext } from "../ConfigContext"
import PlayerInfoCardBig from "../playerInfoCards/PlayerInfoCard"
import { buildDefaultIPlayerInfo, IPlayerInfo } from "@/server/gamedata/IPlayerInfo"
import { ICharacterData } from "@/server/gamedata/ICharacterData"
import { ConfigDirector } from "@/app/classes/ConfigDirector"
import { ColorDirector } from "@/app/classes/ColorDirector"
import { EElement } from "@/server/gamedata/enums/EElement"
import LogButton from "../LogButton";
import { useEffect, useState } from "react";

export default function PlayerPageRoot({uid, config} : {uid: string, config: ConfigDirector}) {

    const [playerInfo, setPlayerInfo] = useState(buildDefaultIPlayerInfo())
    const [playerInfoLoaded, setPlayerInfoLoaded] = useState(false)

    const [characters, setCharacters] = useState([])
    const [charactersLoaded, setCharactersLoaded] = useState(false)

    const [useUpdate, setUseUpdate] = useState(false)

    const refreshCallback = () => {
        setUseUpdate(true)
        setPlayerInfoLoaded(false)
    }

    const updatePlayerInfo = async () => {
        try {
            const r = await fetch(`/api/uid/${uid}${useUpdate ? "?update=true":""}`)
            const data = await r.json()
            setPlayerInfo(data)
            setPlayerInfoLoaded(true)
            setUseUpdate(false)
        } catch (e) {

        }
    }

    useEffect(() => {
        if (!playerInfoLoaded) {
            updatePlayerInfo()
        }
    }, [playerInfoLoaded])

    useEffect(() => {
        const f = async() => {
            try {
                const r = await fetch(`/api/uid/${uid}/characters`)
                const data = await r.json()
                setCharacters(data)
                setCharactersLoaded(true)
            } catch (e) {

            }
        }

        if (playerInfoLoaded) {
            f()
        }
    }, [playerInfo])

    
    let charList = []
    const [popupId, setPopupId] = useState(0)
    
    if (charactersLoaded) {
        charList = []
        for (let i = 0; i < characters.length; ++i) {
            charList.push(<CharacterSelectButton uid={playerInfo.uid} character={characters[i]} useHref={true} useLargeFont={false} useBackground={true} borderColor="" />)
        }
    }

    let content = <div className={"pl-1 w-full h-screen flex flex-col place-content-center items-center"}>
        {playerInfoLoaded ? <PlayerInfoCardBig info={playerInfo} refreshCallback={refreshCallback}/> : <div>Fetching player info...</div>}
        {!playerInfoLoaded && playerInfo.name != "default" ? [<PlayerInfoCardBig info={playerInfo} refreshCallback={refreshCallback}/>, <div className="absolute inset-0 z-10 backdrop-grayscale bg-white/30"></div>] : ""}
        <div className="grid grid-cols-auto-fit-fr-medium max-w-[1600px] gap-2 rounded-md border backdrop-blur-xl bg-white/25 p-2 w-3/4 border-slate-400">
            {charactersLoaded ? charList : <div>Fetching characters...</div>}
            {playerInfoLoaded ? "" : <div className="absolute inset-0 z-10 backdrop-grayscale bg-white/30"></div>}
        </div>
    </div>

    return <ConfigContext.Provider value={{colorDirector: new ColorDirector(EElement.NONE), config: config}}>
        {content}
        <div className="fixed top-0 right-0 z-10">
            <LogButton popupId={popupId} setPopupId={setPopupId}/>
        </div>

    </ConfigContext.Provider>
}