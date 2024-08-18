import { apiLogicReadLogs } from "@/server/api/ApiLogicReadLogs";
import { apiResponse, EDataType, EStatusCode } from "@/server/api/ApiResponseGenerator";

export async function GET(request: Request) {
    try {
        const p = await apiLogicReadLogs()
        return apiResponse(EStatusCode.SUCCESS, p.content!, undefined, EDataType.TXT)
    } catch (e) {
        return apiResponse(EStatusCode.INTERNAL_ERROR, e as string)
    }
}