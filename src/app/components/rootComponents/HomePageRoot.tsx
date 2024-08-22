"use client";
import { ConfigDirector } from "@/app/classes/ConfigDirector"
import { IPlayerInfoWithoutCharacters } from "@/server/gamedata/IPlayerInfo"
import { info } from "console"
import { useEffect, useState } from "react"
import AddUidWidget from "../AddUidWidget"
import LogButton from "../LogButton"
import PlayerInfoCardSmall from "../playerInfoCards/PlayerInfoCardSmall"
import UpdateResources from "../UpdateResources"

export default function HomePageRoot({config} : {config: ConfigDirector}) {


    const [popupId, setPopupId] = useState(0)

    const [playerInfoList, setPlayerInfoList] = useState([])
    const [playerListLoaded, setPlayerListLoaded] = useState(false)
    useEffect(() => {
        const f = async () => {
            try {
                const r = await fetch("/api/players")
                const data = await r.json()
                setPlayerInfoList(data)
                setPlayerListLoaded(true)
            } catch (e) {

            }
        }

        f()
    }, [])

        let infoElement = <div className="w-1/3">
        <div className={"w-full rounded-md border backdrop-blur-xl bg-white/25 p-2 gap-2 mb-2 z-10 border-slate-400"}>
            <AddUidWidget />
        </div>
    </div>

    let content = <div className="flex flex-col h-screen pl-1 w-full place-content-center items-center">
        {infoElement}
        <div className="mt-10">
            Fetching player info...
        </div>
        <div className={"rounded-md border backdrop-blur-xl bg-white/25 p-2 grid grid-cols-3 w-2/3 gap-2 mb-2 z-10 border-slate-400"}>
            Please wait...
        </div>
        <div>
            <UpdateResources />
        </div>
        <div className="fixed top-0 right-0 z-10">
            <LogButton popupId={popupId} setPopupId={setPopupId}/>
        </div>
    </div>
    
    if (playerListLoaded) {
        let piList = []
        for (let i = 0; i < playerInfoList.length; ++i) {
            piList.push(<PlayerInfoCardSmall info={playerInfoList[i]}/>)
        }

        content = <div className="flex flex-col h-screen pl-1 w-full place-content-center items-center">
            {infoElement}
            <div className="mt-10">
                Saved UIDs : {playerInfoList.length}
            </div>
            <div className={"rounded-md border backdrop-blur-xl bg-white/25 p-2 grid grid-cols-3 w-2/3 gap-2 mb-2 z-10 border-slate-400"}>
                {piList}
            </div>
            <div>
                <UpdateResources />
            </div>
                <div className="fixed top-0 right-0 z-10">
                    <LogButton popupId={popupId} setPopupId={setPopupId}/>
            </div>
        </div>
    }
    
    
        return (
            content
        )
}