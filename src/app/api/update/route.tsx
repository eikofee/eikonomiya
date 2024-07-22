import { exec, spawn } from 'child_process';
import path from 'path';
import { promisify } from 'util';
import {promises as fsPromises} from 'fs';

export interface IGo2EikoResult {
    isRunning: boolean,
    lastLine: string
}

const execPromiser = promisify(exec)
async function runGo2Eiko(mode: string) {
    if (mode == "data") {
        if (process.platform == 'win32') {
            const result = await execPromiser("python ./go2eiko.py --method checkout -d")
            await execPromiser("del go2eiko.log")

            return result.stdout

        } else {
            const result = await execPromiser("python3 ./go2eiko.py --method checkout -d")
            await execPromiser("rm go2eiko.log")

            return result.stdout
        }
    }

    if (mode == "cwal") {
        if (process.platform == 'win32') {
            const result = await execPromiser("python ./go2eiko.py --method checkout -c -w -a -l -d -v")
            await execPromiser("del go2eiko.log")
            return result.stdout

        } else {
            const result = await execPromiser("python3 ./go2eiko.py --method checkout -c -w -a -l -d -v")
            await execPromiser("rm go2eiko.log")
            return result.stdout
        }
    }

    return ""
}

async function pythonStatus() {
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

async function getGo2EikoLogs() : Promise<string[]> {
    const p = path.resolve(process.cwd(), "go2eiko.log")
    const fileContent = (await fsPromises.readFile(p)).toString()
    const lines = fileContent.split("\n")
    return lines
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const headerResponse = {headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
    }
    const mode = searchParams.get("mode")!

    let message = ""
    switch(mode) {

        case "data":
            message = await runGo2Eiko("data")
            return Response.json(message, headerResponse)
            break;

        case "assets":
            message = await runGo2Eiko("cwal")
            return Response.json(message, headerResponse)
            break;
        
        case "status":
            try {
                const status = await pythonStatus()
                const logs = await getGo2EikoLogs()
                const lastLine = logs[logs.length - 2]
                const res : IGo2EikoResult = {
                    isRunning: status,
                    lastLine: lastLine
                }
                
                return Response.json(res, headerResponse)
            } catch (e) {
                const res : IGo2EikoResult = {
                    isRunning: false,
                    lastLine: ""
                }

                return Response.json(res, headerResponse)
            }
            break;
    
        case "logs":
            const lines = await getGo2EikoLogs()
            return Response.json({logs: lines}, headerResponse)
            break;
    }

    return Response.json("empty", headerResponse)
}