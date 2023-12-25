import { Updater } from "@/server/gamedata/Updater";
import { Card } from "../components/Card";
import { hostUrl } from "../host";
import { ICharacterData } from "@/server/gamedata/ICharacterData";

async function fetchAllData(endpoint: string, uid: string) {
    const path = "/api/".concat(endpoint, "?uid=", uid)
    const data = await fetch(hostUrl(path));
    return data.json()
}

export default async function Page({ params }: { params: { uid: string } }) {
    const uid = params.uid
    // await fetch(hostUrl("/api/update?uid=".concat(uid)))
    const u = new Updater(uid)
    await u.initialize()
    const playerInfo = await u.loadPlayerData()
    // let data: Record<string, any> = await fetchAllData("characters", uid);
    if (playerInfo == undefined) {
        return (
            <div className="bg-blue-500 w-full">
                Fetching data, please wait...
            </div>
        )
    }

    const characters = playerInfo.characters

    const buildCharacterCard = (c: ICharacterData, useHref: boolean, useLargeFont: boolean) => {
        let content = <div className="basis-1/4 items-center h-full flex flex-row cursor-pointer">
                    <div className="h-12 basis-1/2 overflow-hidden">
                        <img className="aspect-square h-full" src={c.assets?.characterPortrait} />
                    </div>
                    <div className={"items-center basis-1/2 ".concat(useLargeFont ? "font-bold text-xl" : "")}>
                        {c.name}
                    </div>
                </div>
        if (useHref) {
            return <a href={"/".concat(uid,"/",c.name)}>{content}</a>
        } else {
            return content
        }
    }

    // const charKeys = Object.keys(data)
    // let characters :ICharacter[] = []
    // for (let i = 0; i < charKeys.length; ++i) {
    //     let c = data[charKeys[i]]
    //     characters.push(buildCharacter(c))
    // }

    let charList = []
    for (let i = 0; i < characters.length; ++i) {
        // charList.push(<Card c={buildCharacterCard(characterList[i], true, false) } cname="px-3 cursor-pointer z-10" />)
        charList.push(<div className="group rounded-md border min-w-36 max-w-md backdrop-blur-xl bg-white/25 px-3 cursor-pointer z-10" >{buildCharacterCard(characters[i], true, false)}</div>)
    }
    
    let content = <div className={"pl-1 w-full h-screen flex flex-col place-content-center items-center"}>
                            <div className={"rounded-md border backdrop-blur-xl bg-white/25 p-2 grid grid-cols-5 w-1/2 gap-2 mb-2 z-10 border-slate-400"}>
                                {charList}
                            </div>
                    </div>

    return (
            content
    )
}