import { Updater } from "@/server/gamedata/Updater";
import { ICharacterData } from "@/server/gamedata/ICharacterData";
import { loadCharacters } from "@/server/DataLoader";

export default async function Page({ params }: { params: { uid: string } }) {
    const uid = params.uid
    let playerInfo = undefined
    if (!isNaN(parseInt(uid))) {
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

    const buildCharacterCard = (c: ICharacterData, useHref: boolean, useLargeFont: boolean) => {
        let content = <div className="items-center h-full w-full flex flex-row cursor-pointer">
                        <div className="h-16 w-full max-w-16 overflow-hidden">
                            <img className="h-16" src={c.commonData.assets.characterPortrait} alt={""} />
                        </div>
                        <div className={"p-1 text-center w-full text-ellipsis bg-slate-100/60 rounded-md ".concat(useLargeFont ? "font-bold text-xl" : "text-sm")}>
                            {c.name}
                        </div>
                    </div>
        if (useHref) {
            return <a href={"/".concat(uid,"/",c.name)}>{content}</a>
        } else {
            return content
        }
    }

    let charList = []
    for (let i = 0; i < characters.length; ++i) {
        // charList.push(<Card c={buildCharacterCard(characterList[i], true, false) } cname="px-3 cursor-pointer z-10" />)
        charList.push(<div className="group rounded-md border bg-white/25 px-3 cursor-pointer z-10 mb-2" style={{
            backgroundImage : "url(".concat(characters[i].commonData.assets.characterNameCard, ")"),
            backgroundSize : "cover"
        }} >{buildCharacterCard(characters[i], true, false)}</div>)
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