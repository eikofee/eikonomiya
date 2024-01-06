import { getPlayerInfoList, getUIDFolderList } from "@/server/DataLoader"
import { hostUrl } from "./host"
import { IPlayerInfoWithoutCharacters } from "@/server/gamedata/IPlayerInfo"

export default async function Page() {


    let infoElement = <div className={""}>
        <div className={"w-full rounded-md border backdrop-blur-xl bg-white/25 p-2 gap-2 mb-2 z-10 border-slate-400"}>
            Please indicate your UID in the address bar : <code className="px-2">{hostUrl("/<UID>")}</code> to start using Eikonomiya.
        </div>
    </div>

// const buildUIDCards = (uid: string) => {
//     let content = <div className="basis-1/4 items-center h-full flex flex-row cursor-pointer">
//                 <div className={"items-center text-center basis-1/2 font-semibold text-xl"}>
//                     {uid}
//                 </div>
//             </div>
//     return <a href={"/".concat(uid)}>{content}</a>
// }

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
const pis = await getPlayerInfoList()
let piList = []
for (let i = 0; i < pis.length; ++i) {
    piList.push(<div className="group rounded-md border min-w-36 max-w-md backdrop-blur-xl bg-white/25 px-3 cursor-pointer z-10 gap-10 text-center" >{buildPlayerCard(pis[i])}</div>)
}

    let content = <div className="flex flex-col h-screen pl-1 w-full place-content-center items-center">
        {infoElement}
        <div className="mt-10">
            Saved UIDs :
        </div>
        <div className={"rounded-md border backdrop-blur-xl bg-white/25 p-2 grid grid-cols-5 w-2/3 gap-2 mb-2 z-10 border-slate-400"}>
                                {/* {uidList} */}
                                {piList}
                            </div>
    </div>

    return (
        content
    )

}