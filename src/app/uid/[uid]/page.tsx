import { ELoadStatus, ILoadPlayerInfoStatus, Updater } from "@/server/gamedata/Updater";
import { getPlayerInfoList, loadCharacters, loadConfigFile } from "@/server/DataLoader";
import CharacterSmallCard from "../../components/CharacterSmallCard";
import PlayerInfoCard from "@/app/components/playerInfoCards/PlayerInfoCard";

export default async function Page({ params }: { params: { uid: string } }) {
    const uid = params.uid
    let playerInfo = undefined
    let loadStatus : ILoadPlayerInfoStatus = {
        status: ELoadStatus.FAILED,
        message: ""
    }

    if (!isNaN(parseInt(uid))) {
        const u = new Updater(uid)
        await u.initialize()
        
        loadStatus = await u.loadPlayerData()
        if (loadStatus.status != ELoadStatus.FAILED) {
            playerInfo = loadStatus.playerInfo!
        }
    } else {
        return (
            <div className="bg-blue-500 w-full">
            Given UID is not a number : <code>{uid}</code>
        </div>
        )
    } if (loadStatus.message != "") {
        return <div className="bg-blue-500 w-full">
                {loadStatus.message}
            </div>
    } else if (playerInfo == undefined) {
            return (
                <div className="bg-blue-500 w-full">
                Fetching data, please wait...
            </div>
            )
        }
    
    playerInfo.characters = await loadCharacters(uid)
    const characters = playerInfo.characters

    let charList = []

    for (let i = 0; i < characters.length; ++i) {
        // charList.push(<Card c={buildCharacterCard(characterList[i], true, false) } cname="px-3 cursor-pointer z-10" />)
        charList.push(<CharacterSmallCard uid={uid} character={characters[i]} useHref={true} useLargeFont={false} useBackground={true} borderColor="" />)
    }

    
    let content = <div className={"pl-1 w-full h-screen flex flex-col place-content-center items-center"}>
        <PlayerInfoCard info={playerInfo} />
                            <div className="grid grid-cols-auto-fit-fr-medium max-w-[1600px] gap-2 rounded-md border backdrop-blur-xl bg-white/25 p-2 w-3/4 z-10 border-slate-400">
                                {charList}
                            </div>
                    </div>

    return (
            content
    )
}