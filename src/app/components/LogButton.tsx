import { useContext, useEffect, useState } from "react";
import { ConfigContext } from "./ConfigContext";
import Card from "./Card";
import Image from "next/image";
import Icon from "./Icon";

export default function LogButton({popupId, setPopupId}:{popupId: number, setPopupId: (x: number) => void}) {



    const {colorDirector} = useContext(ConfigContext)
    const thisId = 3

    const contentClassName = `
        flex
        flex-col
        rounded-md
        border
        backdrop-blur-xl
        bg-white/25
        p-2
        z-10
        border-slate-400
        fixed
        translate-y-2
        top-20
        left-20
        right-20
        bottom-20
        overflow-y-auto
        `
    const toggleHiddable = () => {
        setPopupId(thisId == popupId ? 0 : thisId)
    }

    const [logs, setLogs] = useState([<p>Fetching logs...</p>])

    useEffect(() => {
        const f = async () => {
            try {
                const r = await fetch("/api/logs")
                const ans = await r.text()
                const logArray = ans.split("\n")
                const split = logArray.slice(-250)
                setLogs(split.map(x => <p>{x}</p>))
            } catch (e) {
                setLogs([<p>Failed to fetch logs : {e as string}</p>])
            }
        }

        f()
    }, [])

    let button = <div className="" >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="w-8 h-8 ">
            <path xmlns="http://www.w3.org/2000/svg" d="M6 22H18C19.1046 22 20 21.1046 20 20V9.82843C20 9.29799 19.7893 8.78929 19.4142 8.41421L13.5858 2.58579C13.2107 2.21071 12.702 2 12.1716 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22Z" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path xmlns="http://www.w3.org/2000/svg" d="M13 2.5V9H19" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path xmlns="http://www.w3.org/2000/svg" d="M8 17H15" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path xmlns="http://www.w3.org/2000/svg" d="M8 13H15" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path xmlns="http://www.w3.org/2000/svg" d="M8 9H9" stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>

    let content = <div className="px-1 font-semibold cursor-pointer h-full" onClick={toggleHiddable}>
        <div className={"flex flex-row gap-2 items-center h-full px-2 rounded-md "}>
            {button}
            Logs
        </div>
</div>

    if (thisId != popupId) {
        return (
                <div className="h-full flex flex-row">
                    <Card key="current-char" content={content} wfull={true}/>
                </div>
        )
    } else {
        return <div className="relative h-full">
            <div className="flex h-full flex-row">
                    <Card key="current-char" content={content} wfull={true}/>
            </div>
            <div className={contentClassName}>
                {logs}
            </div>
        </div>
    }
}