
export interface IHiddableContent {
    state: boolean,
    content: React.ReactNode,
    currentToggleId: number,
    fit: boolean,
    additional? : string
}

export type THiddableContentCb = (content: React.ReactNode, currentToggleId:number, fit: boolean, additional? : string) => void

export default function TopOverSpace({content} : {content: IHiddableContent}) {

    let hiddableClassname = "hidden"
    if (content.state) {
        hiddableClassname = "z-10 absolute translate-y-[62px] max-w-[1800px] "
            hiddableClassname = hiddableClassname.concat(content.fit ? "w-fit" : "w-[100%]", " ")
        if (content.additional != undefined) {
            hiddableClassname = hiddableClassname.concat(content.additional)
        }
    }

    return <div className={hiddableClassname}>
        <div className={"rounded-md border backdrop-blur-xl bg-white/25 p-2 z-10 border-slate-400"}>
                    {content.content}
        </div>
    </div>
}