
export interface IHiddableContent {
    state: boolean,
    content: React.ReactNode,
    currentToggleId: number,
    fit: boolean
}

export type THiddableContentCb = (content: React.ReactNode, currentToggleId:number, fit: boolean) => void

export default function TopOverSpace({content} : {content: IHiddableContent}) {

    let hiddableClassname = "hidden"
    if (content.state) {
        hiddableClassname = "z-10 absolute translate-y-[62px] max-w-[1800px] ".concat(content.fit ? "w-fit" : "w-[100%]")
    }

    return <div className={hiddableClassname}>
        <div className={"rounded-md border backdrop-blur-xl bg-white/25 p-2 z-10 border-slate-400"}>
                    {content.content}
        </div>
    </div>
}