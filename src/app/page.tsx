import { getPlayerInfoList, loadConfigFile } from "@/server/DataLoader"
import { IPlayerInfoWithoutCharacters } from "@/server/gamedata/IPlayerInfo"
import { ConfigDirector } from "./classes/ConfigDirector"
import AddUidWidget from "./components/AddUidWidget"
import { ImgApi } from "./components/ImgApi"
import UpdateResources from "./components/UpdateResources"

export default async function Page() {

    const buildPlayerCard = (pi: IPlayerInfoWithoutCharacters) => {
        let content = <div className="items-center h-full flex flex-row cursor-pointer">
                        <div className="h-12 basis-1/2 overflow-hidden">
                            <ImgApi className="w-12" src={pi.profilePictureCharacterName} alt={""} />
                        </div>
                        <div className="text-center text-ellipsis items-center w-full font-bold text-xl">
                            {pi.name}
                        </div>
                    </div>
    
            return <a href={"/uid/".concat(pi.uid)}>{content}</a>
    }
    
    const playerInfoList = await getPlayerInfoList()
    const iconfig = await loadConfigFile(true)
    const config = new ConfigDirector(iconfig)
    
    let piList = []
    for (let i = 0; i < playerInfoList.length; ++i) {
        piList.push(<div className="group rounded-md border min-w-[144px] max-w-md backdrop-blur-xl bg-white/25 px-3 cursor-pointer z-10 gap-10 text-center" >{buildPlayerCard(playerInfoList[i])}</div>)
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
            <div>
                <UpdateResources />
            </div>
        </div>
    
        return (
            content
        )
    }