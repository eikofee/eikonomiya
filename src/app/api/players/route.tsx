import { apiLogicGetPlayers } from "@/server/api/ApiLogicGetPlayers"
import { apiResponse, EDataType, EStatusCode } from "@/server/api/ApiResponseGenerator"

export async function GET(request: Request) {
    try {
        const p = await apiLogicGetPlayers()
        console.log(p.content)
        return apiResponse(EStatusCode.SUCCESS, JSON.stringify(p.content!), undefined, EDataType.JSON)
    } catch (e) {
        return apiResponse(EStatusCode.INTERNAL_ERROR, e as string)
    }
}