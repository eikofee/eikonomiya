import {promises as fsPromises} from "fs"
import { exec } from "child_process"
import path from "path"
import { promisify } from "util"

export enum EGo2EikoMode {
    DATA,
    GENSHIN_OPTIMIZER
}

const execPromiser = promisify(exec)
export async function apiLogicRunGo2Eiko(mode: EGo2EikoMode) {
    switch (mode) {
        case EGo2EikoMode.DATA:
            if (process.platform == 'win32') {
                const result = await execPromiser("python ./go2eiko.py --method checkout -d")
                return result.stdout
    
            } else {
                const result = await execPromiser("python3 ./go2eiko.py --method checkout -d")
                return result.stdout
            }

        case EGo2EikoMode.GENSHIN_OPTIMIZER:
            if (process.platform == 'win32') {
                const result = await execPromiser("python ./go2eiko.py --method checkout -c -w -a -l -d -v")
                return result.stdout
    
            } else {
                const result = await execPromiser("python3 ./go2eiko.py --method checkout -c -w -a -l -d -v")
                return result.stdout
            }
    }
}

export async function apiLogicGetPythonStatus() {
    try {
        if (process.platform == 'win32') {
            await execPromiser("powershell.exe ps python")
        } else {
            await execPromiser("ps python3")
        }
        return true
    } catch {
        return false
    }
}

export async function apiLogicGetGo2EikoLogs() : Promise<string[]> {
    const p = path.resolve(process.cwd(), "go2eiko.log")
    const fileContent = (await fsPromises.readFile(p)).toString()
    const lines = fileContent.split("\n")
    return lines
}