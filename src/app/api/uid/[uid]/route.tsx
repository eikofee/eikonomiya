import { apiResponse, EStatusCode, EDataType } from "@/server/api/ApiResponseGenerator"
import { updater } from "@/server/gamedata/Updater"

export async function GET(request: Request, {params}: {params: {uid: string}}) {
    const { searchParams } = new URL(request.url)
    const uid = params.uid
    const updateParam = searchParams.get("update")
    const useUpdate = updateParam == "true"
    try {
        const p = await updater.loadPlayerData(uid, !useUpdate)
        return apiResponse(EStatusCode.SUCCESS, JSON.stringify(p.playerInfo!), undefined, EDataType.JSON)
    } catch (e) {
        return apiResponse(EStatusCode.INTERNAL_ERROR, e as string)
    }
}