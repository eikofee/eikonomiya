"use client"
import { useEffect, useState } from "react";
import Card from "./Card";

export default function UpdateResources() {

    const [logLine, setLogLine] = useState("")
    const [isRunning, setIsRunning] = useState(false)

    useEffect(() => {
        if (isRunning) {
            const timer = setInterval(async () => {
                    const res = await (await fetch("/api/update?mode=status", {cache: "no-cache"})).json()
                    setLogLine(res.lastLine.replace("\r", ""))
                    setIsRunning(res.isRunning)
            }, 1000)

        return () => {
                clearInterval(timer)
            }
        }
    }, [isRunning])

    const callRefreshData = () => {
        fetch("/api/update?mode=data")
        setIsRunning(true)
    }

    const callRefreshAssets = () => {
        fetch("/api/update?mode=assets")
        setIsRunning(true)
    }


    const content = <div className="flex flex-row gap-2">
            <div className="flex flex-col gap-1">
                <button className="h-1/2 w-full rounded-md text-sm mr-1 border bg-slate-300" onClick={callRefreshData}>Update Eikonomiya Data</button>
                <button className="h-1/2 w-full rounded-md text-sm mr-1 border bg-slate-300" onClick={callRefreshAssets}>Update all data and assets</button>
            </div>
                {isRunning ? <div>{logLine.split("---")[1]}</div> : ""}
        </div>

    return <Card content={content} />

}