import { ELoadStatus, ILoadPlayerInfoStatus, Updater } from "@/server/gamedata/Updater";
import { getPlayerInfoList, loadCharacters, loadConfigFile, loadRules } from "@/server/DataLoader";
import CharacterSelectButton from "../../components/CharacterSelectButton";
import PlayerInfoCardBig from "@/app/components/playerInfoCards/PlayerInfoCard";
import MarkdownDescription from "@/app/components/MarkdownDescription";
import PlayerPageRoot from "@/app/components/rootComponents/PlayerPageRoot";

export default async function Page({ params }: { params: { uid: string } }) {
    const uid = params.uid
    let playerInfo = undefined
    let loadStatus : ILoadPlayerInfoStatus = {
        status: ELoadStatus.FAILED,
        message: ""
    }

    const configDirector = await loadConfigFile(true)

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
    }
    
    if (loadStatus.message != "") {
        return <div className="bg-blue-500 w-full h-full">
            {loadStatus.message.split("\n").map(x => <p key={x}>{x}</p>)}
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
    const charRules = await loadRules(uid)

    return <PlayerPageRoot playerInfo={playerInfo} characters={characters} characterRules={charRules} config={configDirector} />
}