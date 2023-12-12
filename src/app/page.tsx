import { hostUrl } from "./host"

export default async function Page() {


    let infoElement = <div className={""}>
        <div className={"w-full rounded-md border backdrop-blur-xl bg-white/25 p-2 gap-2 mb-2 z-10 border-slate-400"}>
            Please indicate your UID in the address bar : <code className="px-2">{hostUrl("/<UID>")}</code> to start using Eikonomiya.
        </div>
    </div>

const buildUIDCards = (uid: string) => {
    let content = <div className="basis-1/4 items-center h-full flex flex-row cursor-pointer">
                <div className={"items-center text-center basis-1/2 font-semibold text-xl"}>
                    {uid}
                </div>
            </div>
    return <a href={"/".concat(uid)}>{content}</a>
}

const uidData = await fetch(hostUrl("/api/uids"))
const uids = (await uidData.json())["uids"]

let uidList = []
for (let i = 0; i < uids.length; ++i) {
    uidList.push(<div className="group rounded-md border min-w-36 max-w-md backdrop-blur-xl bg-white/25 px-3 cursor-pointer z-10 gap-10 text-center" >{buildUIDCards(uids[i])}</div>)
}

    let content = <div className="flex flex-col h-screen pl-1 w-full place-content-center items-center">
        {infoElement}
        <div className="mt-10">
            Saved UIDs :
        </div>
        <div className={"rounded-md border backdrop-blur-xl bg-white/25 p-2 grid grid-cols-5 w-1/2 gap-2 mb-2 z-10 border-slate-400"}>
                                {uidList}
                            </div>
    </div>

    return (
        content
    )

}