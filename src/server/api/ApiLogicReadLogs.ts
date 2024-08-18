import {promises as fsPromises} from "fs"
import { IApiResult } from "@/app/interfaces/IApiResult"

export async function apiLogicReadLogs() {
    const res : IApiResult<string> = {success: false}
    const data = (await fsPromises.readFile("log.log")).toString()
    res.content = data
    res.success = true
    return res
}