import { apiLogicReadLogs } from "@/server/api/ApiLogicReadLogs";
import { apiResponse, EStatusCode } from "@/server/api/ApiResponseGenerator";

export async function GET(request: Request) {
    try {
        const p = await apiLogicReadLogs()
        return apiResponse(EStatusCode.SUCCESS, p.content!)
    } catch (e) {
        return apiResponse(EStatusCode.INTERNAL_ERROR, e as string)
    }
}