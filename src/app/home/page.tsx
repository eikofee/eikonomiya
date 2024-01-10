"use server";
import { getPlayerInfoList } from "@/server/DataLoader"
import {promises as fsPromises} from 'fs';

import { IPlayerInfoWithoutCharacters } from "@/server/gamedata/IPlayerInfo"
import { ConfigDirector, ETheme, IConfigDirector } from "../classes/ConfigDirector"
import path from "path";

export default async function Page() {

    const iconfig : IConfigDirector = {
        host: "http://localhost:3000",
        theme: ETheme.LIGHT
    }

    const p = path.resolve(process.cwd(), process.env.DATA_PATH!)
    const fileList = await fsPromises.readdir(p)
    if (!fileList.includes(process.env.CONFIG_FILENAME!)) {
        const p3 = path.join(process.cwd(), process.env.DATA_PATH!, process.env.CONFIG_FILENAME!)
        await fsPromises.writeFile(p3, JSON.stringify({
            "host": iconfig.host,
            "theme": iconfig.theme
        }))
    }

    const p2 = path.resolve(process.cwd(), process.env.DATA_PATH!)
    const jsonData = JSON.parse((await fsPromises.readFile(p2.concat("/", process.env.CONFIG_FILENAME!))).toString())
    iconfig.host = jsonData["host"]
    iconfig.theme = jsonData["theme"]
    const config = new ConfigDirector(iconfig)
    let infoElement = <div className={""}>
        <div className={"w-full rounded-md border backdrop-blur-xl bg-white/25 p-2 gap-2 mb-2 z-10 border-slate-400"}>
            Please indicate your UID in the address bar : <code className="px-2">{config.hostUrl("/<UID>")}</code> to start using Eikonomiya.
        </div>
    </div>


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
const debpis = await getPlayerInfoList()
const pis = debpis[1] as IPlayerInfoWithoutCharacters[]
let piList = []
for (let i = 0; i < pis.length; ++i) {
    piList.push(<div className="group rounded-md border min-w-36 max-w-md backdrop-blur-xl bg-white/25 px-3 cursor-pointer z-10 gap-10 text-center" >{buildPlayerCard(pis[i])}</div>)
}

    let content = <div className="flex flex-col h-screen pl-1 w-full place-content-center items-center">
        {infoElement}
        <div className="mt-10">
            Saved UIDs : {debpis[0] as number}
        </div>
        <div className={"rounded-md border backdrop-blur-xl bg-white/25 p-2 grid grid-cols-5 w-2/3 gap-2 mb-2 z-10 border-slate-400"}>
                                {piList}
                            </div>
    </div>

    return (
        content
    )

}