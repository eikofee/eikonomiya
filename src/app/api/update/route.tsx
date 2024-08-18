import { apiLogicRunGo2Eiko, apiLogicGetPythonStatus, apiLogicGetGo2EikoLogs, EGo2EikoMode } from '@/server/api/ApiLogicUpdateAssets';
import { apiResponse, EStatusCode } from '@/server/api/ApiResponseGenerator';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const mode = searchParams.get("mode")!

    let message = ""
    switch(mode) {

        case "data":
            try {
                message = await apiLogicRunGo2Eiko(EGo2EikoMode.DATA)
                return apiResponse(EStatusCode.SUCCESS, message)
            } catch (e) {
                return apiResponse(EStatusCode.INTERNAL_ERROR, e as string)
            }

        case "assets":
            try {
                message = await apiLogicRunGo2Eiko(EGo2EikoMode.GENSHIN_OPTIMIZER)
                return apiResponse(EStatusCode.SUCCESS, message)
            } catch (e) {
                return apiResponse(EStatusCode.INTERNAL_ERROR, e as string)
            }
        
        case "status":
            try {
                const status = await apiLogicGetPythonStatus()
                const logs = await apiLogicGetGo2EikoLogs()
                const lastLine = logs[logs.length - 2]
                const res = {
                    isRunning: status,
                    lastLine: lastLine
                }
                
                return apiResponse(EStatusCode.SUCCESS, res)
            } catch (e) {
                return apiResponse(EStatusCode.INTERNAL_ERROR, e as string)
            }
    
        case "logs":
            try {
                const lines = await apiLogicGetGo2EikoLogs()
                return apiResponse(EStatusCode.SUCCESS, lines)
            } catch (e) {
                return apiResponse(EStatusCode.INTERNAL_ERROR, e as string)
            }

        default:
            return apiResponse(EStatusCode.BAD_REQUEST, "Parameter mode '".concat(mode, "' unknown"))
    }

}