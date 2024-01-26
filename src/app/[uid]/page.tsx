import { Updater } from "@/server/gamedata/Updater";
import { ICharacterData } from "@/server/gamedata/ICharacterData";
import { getPlayerInfoList, loadCharacters, loadConfigFile } from "@/server/DataLoader";
import { IPlayerInfoWithoutCharacters } from "@/server/gamedata/IPlayerInfo";
import { IConfigDirector, ETheme, ConfigDirector } from "../classes/ConfigDirector";
import AddUidWidget from "../components/AddUidWidget";
import CharacterSmallCard from "../components/CharacterSmallCard";

async function home() {
    const buildPlayerCard = (pi: IPlayerInfoWithoutCharacters) => {
        let content = <div className="items-center h-full flex flex-row cursor-pointer">
                        <div className="h-12 basis-1/2 overflow-hidden">
                            <img className="w-12" src={pi.profilePictureCharacterName} alt={""} />
                        </div>
                        <div className="text-center text-ellipsis items-center w-full font-bold text-xl">
                            {pi.name}
                        </div>
                    </div>
    
            return <a href={"/".concat(pi.uid)}>{content}</a>
    }
    
    // const uids = await getUIDFolderList()
    // let uidList = []
    // for (let i = 0; i < uids.length; ++i) {
    //     uidList.push(<div className="group rounded-md border min-w-36 max-w-md backdrop-blur-xl bg-white/25 px-3 cursor-pointer z-10 gap-10 text-center" >{buildUIDCards(uids[i])}</div>)
    // }
    const playerInfoList = await getPlayerInfoList()
    const iconfig = await loadConfigFile(true)
    const config = new ConfigDirector(iconfig)

    let piList = []
    for (let i = 0; i < playerInfoList.length; ++i) {
        piList.push(<div className="group rounded-md border min-w-36 max-w-md backdrop-blur-xl bg-white/25 px-3 cursor-pointer z-10 gap-10 text-center" >{buildPlayerCard(playerInfoList[i])}</div>)
    }
        let infoElement = <div className="w-1/3">
        <div className={"w-full rounded-md border backdrop-blur-xl bg-white/25 p-2 gap-2 mb-2 z-10 border-slate-400"}>
            <AddUidWidget />
        </div>
    </div>
    
        let content = <div className="flex flex-col h-screen pl-1 w-full place-content-center items-center">
            {infoElement}
            <div className="mt-10">
                Saved UIDs : {playerInfoList.length}
            </div>
            <div className={"rounded-md border backdrop-blur-xl bg-white/25 p-2 grid grid-cols-5 w-2/3 gap-2 mb-2 z-10 border-slate-400"}>
                                    {piList}
                                </div>
        </div>
    
        return (
            content
        )
}

export default async function Page({ params }: { params: { uid: string } }) {
    const uid = params.uid
    let playerInfo = undefined
    if (uid == "home") {
        return await home()
    } else if (!isNaN(parseInt(uid))) {
        const u = new Updater(uid)
        await u.initialize()
        playerInfo = await u.loadPlayerData()
    } else {
        return (
            <div className="bg-blue-500 w-full">
            Given UID is not a number : <code>{uid}</code>
        </div>
        )
    }
        if (playerInfo == undefined) {
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
                            <div className={"grid gap-2 grid-cols-1 xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-2 rounded-md border backdrop-blur-xl bg-white/25 p-2 w-3/4 z-10 border-slate-400"}>
                                {charList}
                            </div>
                    </div>

    return (
            content
    )
}