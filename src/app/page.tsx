import { hostUrl } from "./host"

export default async function Page() {


    let content = <div className={"pl-1 w-full h-screen flex flex-col place-content-center items-center"}>
        <div className={"rounded-md border backdrop-blur-xl bg-white/25 p-2 w-1/2 gap-2 mb-2 z-10 border-slate-400"}>
            Please indicate your UID in the address bar : <code className="px-2">{hostUrl("/<UID>")}</code> to start using Eikonomiya.
        </div>
    </div>

    return (
        content
    )

}