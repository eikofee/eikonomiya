import fs from "fs"

export enum ELogType {
    INFO = "INFO",
    WARN = "WARNING",
    ERROR = "ERROR"
}

class LogService {
    private static instance: LogService //singleton

    private constructor(){}

    public static getInstance() {
        if (LogService.instance == undefined) {
            LogService.instance = new LogService()
        }

        return LogService.instance
    }

    public log(message: string, type : ELogType = ELogType.INFO) {
        const logLine = `[${new Date().toISOString()}] ${type} - ${message}\n`

        fs.appendFile("log.log", logLine, (e) => {
            if (e) {
                console.error(`Cannot write to log file : ${e.message}`)
        }})
    }
}

export const logService = LogService.getInstance()